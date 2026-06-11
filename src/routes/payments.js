const router = require('express').Router();
const pool = require('../db/pool');
const { notifyPaymentUpdate } = require('../lib/notifications');

// Webhook endpoint for payment providers to notify the server of payment updates.
// Expected body: { pedidoId: number, status: 'paid'|'failed'|'pending', meta?: {} }
router.post('/webhook', async (req, res) => {
  const { pedidoId, status, meta } = req.body || {};
  if (!pedidoId || !status) return res.status(400).json({ error: 'pedidoId and status required' });

  try {
    // Update order status in DB (best-effort)
    await pool.query('UPDATE pedidos SET estado = ? WHERE id = ?', [status, pedidoId]);

    // Emit real-time event via socket.io
    try {
      const io = req.app.get('io');
      if (io) {
        // Broadcast to admin/veterinario rooms and to a room specific to the pedido
        io.to('admin').emit('payment:update', { pedidoId, status, meta });
        io.to(`pedido:${pedidoId}`).emit('payment:update', { pedidoId, status, meta });
      }
    } catch (e) {
      console.error('Socket emit error', e);
    }

    // Fire-and-forget notifications (email / WhatsApp)
    try {
      notifyPaymentUpdate(pedidoId, status, meta);
    } catch (e) {
      console.error('Notify error', e);
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Testing endpoint to simulate a payment event (dev only)
router.post('/test', async (req, res) => {
  const { pedidoId, status } = req.body || {};
  if (!pedidoId || !status) return res.status(400).json({ error: 'pedidoId and status required' });
  const io = req.app.get('io');
  if (io) {
    io.to('admin').emit('payment:update', { pedidoId, status, meta: { test: true } });
    io.to(`pedido:${pedidoId}`).emit('payment:update', { pedidoId, status, meta: { test: true } });
  }
  res.json({ ok: true });
});

module.exports = router;
