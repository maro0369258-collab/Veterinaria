const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

function sign(user) {
  return jwt.sign(
    { id: user.id, rol: user.rol, nombre: user.nombre, correo: user.correo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { nombre, correo, password, telefono } = req.body;
  if (!nombre || !correo || !password)
    return res.status(400).json({ error: 'Faltan campos' });
  const hash = await bcrypt.hash(password, 10);
  try {
    // Always create regular users via public registration endpoint
    const rol = 'user';
    const [r] = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, correo, hash, telefono || null, rol]
    );
    const user = { id: r.insertId, nombre, correo, rol };
    res.json({ token: sign(user), user });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya registrado' });
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
    const safe = { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, telefono: user.telefono };
    res.json({ token: sign(safe), user: safe });
  } catch (e) {
    console.error('Auth login error', e);
    return res.status(503).json({ error: 'Servicio temporalmente indisponible (DB)' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, correo, rol, telefono FROM usuarios WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (e) {
    console.error('Auth me error', e);
    return res.status(503).json({ error: 'Servicio temporalmente indisponible (DB)' });
  }
});

module.exports = router;
