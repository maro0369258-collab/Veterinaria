const router = require('express').Router();
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  const isAdmin = req.user.rol === 'admin';
  const [rows] = await pool.query(
    `SELECT m.*, u.nombre AS dueno_nombre
     FROM mascotas m JOIN usuarios u ON u.id = m.dueno_id
     ${isAdmin ? '' : 'WHERE m.dueno_id = ?'}
     ORDER BY m.id DESC`,
    isAdmin ? [] : [req.user.id]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  try {
    const { nombre, especie, raza, edad, dueno_id } = req.body;
    const dueno = req.user.rol === 'admin' ? (dueno_id || req.user.id) : req.user.id;
    const edadParsed = edad ? parseInt(String(edad), 10) : null;
    const edadFinal = Number.isFinite(edadParsed) ? edadParsed : null;
    const [r] = await pool.query(
      'INSERT INTO mascotas (nombre, especie, raza, edad, dueno_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, especie, raza || null, edadFinal, dueno]
    );
    res.json({ id: r.insertId });
  } catch (err) {
    console.error('mascotas POST error', err);
    res.status(500).json({ error: 'Error al guardar mascota' });
  }
});

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM mascotas WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
