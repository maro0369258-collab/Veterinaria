const router = require('express').Router();
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const isAdmin = req.user.rol === 'admin';
  const [rows] = await pool.query(
    `SELECT p.*, u.nombre AS cliente_nombre
     FROM pedidos p JOIN usuarios u ON u.id = p.cliente_id
     ${isAdmin ? '' : 'WHERE p.cliente_id = ?'}
     ORDER BY p.creado_en DESC`,
    isAdmin ? [] : [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { items = [], cliente_id } = req.body; // items: [{producto_id, cantidad}]
  const cliente = req.user.rol === 'admin' ? (cliente_id || req.user.id) : req.user.id;
  if (!items.length) return res.status(400).json({ error: 'Sin items' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let total = 0;
    const itemRows = [];
    for (const it of items) {
      const [[prod]] = await conn.query('SELECT id, precio, stock FROM productos WHERE id = ?', [it.producto_id]);
      if (!prod) throw new Error('Producto no existe');
      if (prod.stock < it.cantidad) throw new Error('Sin stock para ' + prod.id);
      total += Number(prod.precio) * Number(it.cantidad);
      itemRows.push([prod.id, it.cantidad, prod.precio]);
      await conn.query('UPDATE productos SET stock = stock - ? WHERE id = ?', [it.cantidad, prod.id]);
    }
    const [r] = await conn.query('INSERT INTO pedidos (cliente_id, total) VALUES (?, ?)', [cliente, total]);
    for (const [pid, cant, pre] of itemRows) {
      await conn.query('INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)', [r.insertId, pid, cant, pre]);
    }
    await conn.commit();
    res.json({ id: r.insertId, total });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally {
    conn.release();
  }
});

router.patch('/:id/ticket', async (req, res) => {
  await pool.query('UPDATE pedidos SET ticket_enviado = 1 WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
