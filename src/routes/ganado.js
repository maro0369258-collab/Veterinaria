const router = require('express').Router();
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const isAdmin = req.user.rol === 'admin';
  const [rows] = await pool.query(
    `SELECT g.*, u.nombre AS ganadero_nombre
     FROM ganado g JOIN usuarios u ON u.id = g.ganadero_id
     ${isAdmin ? '' : 'WHERE g.ganadero_id = ?'}
     ORDER BY g.id DESC`,
    isAdmin ? [] : [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { arete, tipo, especie, corral, sexo, peso, ganadero_id } = req.body;
  const ganadero = req.user.rol === 'admin' ? (ganadero_id || req.user.id) : req.user.id;
  try {
    const [r] = await pool.query(
      'INSERT INTO ganado (arete, tipo, especie, corral, sexo, peso, ganadero_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [arete, tipo, especie, corral || null, sexo, peso || null, ganadero]
    );
    // Emit real-time update to ganaderos and admin
    try {
      const io = req.app.get('io');
      if (io) io.to('ganadero').emit('ganado:update', { id: r.insertId, arete, tipo, especie, corral, sexo, peso, ganadero_id: ganadero });
    } catch (e) {
      console.error('Socket emit ganado create error', e.message || e);
    }
    res.json({ id: r.insertId });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Arete duplicado' });
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM ganado WHERE id = ?', [req.params.id]);
  try {
    const io = req.app.get('io');
    if (io) io.to('ganadero').emit('ganado:update', { id: Number(req.params.id), deleted: true });
  } catch (e) {
    console.error('Socket emit ganado delete error', e.message || e);
  }
  res.json({ ok: true });
});

module.exports = router;
