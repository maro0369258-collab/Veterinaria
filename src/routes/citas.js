const router = require('express').Router();
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const isAdmin = req.user.rol === 'admin';
  const [rows] = await pool.query(
    `SELECT c.*, u.nombre AS cliente_nombre, m.nombre AS mascota_nombre
     FROM citas c
     JOIN usuarios u ON u.id = c.cliente_id
     JOIN mascotas m ON m.id = c.mascota_id
     ${isAdmin ? '' : 'WHERE c.cliente_id = ?'}
     ORDER BY c.fecha DESC, c.hora DESC`,
    isAdmin ? [] : [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { cliente_id, mascota_id, fecha, hora, motivo } = req.body;
  const cliente = req.user.rol === 'admin' ? cliente_id : req.user.id;
  const [r] = await pool.query(
    'INSERT INTO citas (cliente_id, mascota_id, fecha, hora, motivo) VALUES (?, ?, ?, ?, ?)',
    [cliente, mascota_id, fecha, hora, motivo]
  );
  res.json({ id: r.insertId });
});

router.patch('/:id', async (req, res) => {
  await pool.query('UPDATE citas SET estado = ? WHERE id = ?', [req.body.estado, req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
