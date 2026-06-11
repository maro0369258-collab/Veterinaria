const router = require('express').Router();
const pool = require('../db/pool');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);

router.get('/', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM productos ORDER BY nombre');
  res.json(rows);
});

router.post('/', requireRole('admin'), async (req, res) => {
  const { nombre, categoria, stock, unidad, precio, stock_min } = req.body;
  const [r] = await pool.query(
    'INSERT INTO productos (nombre, categoria, stock, unidad, precio, stock_min) VALUES (?, ?, ?, ?, ?, ?)',
    [nombre, categoria || null, stock || 0, unidad || 'pza', precio || 0, stock_min || 1]
  );
  res.json({ id: r.insertId });
});

router.patch('/:id', requireRole('admin'), async (req, res) => {
  const fields = ['nombre','categoria','stock','unidad','precio','stock_min'];
  const sets = [], vals = [];
  for (const f of fields) if (f in req.body) { sets.push(`${f} = ?`); vals.push(req.body[f]); }
  if (!sets.length) return res.json({ ok: true });
  vals.push(req.params.id);
  await pool.query(`UPDATE productos SET ${sets.join(', ')} WHERE id = ?`, vals);
  res.json({ ok: true });
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
