const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', requireRole('admin'), async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, correo, rol, telefono, creado_en FROM usuarios ORDER BY id'
  );
  res.json(rows);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const { nombre, correo, password, telefono, rol } = req.body;
  if (!nombre || !correo || !password) return res.status(400).json({ error: 'Faltan campos' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const [r] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, hash, telefono || null, rol || 'user']
    );
    res.json({ id: r.insertId, nombre, correo, telefono, rol: rol || 'user' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya registrado' });
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
