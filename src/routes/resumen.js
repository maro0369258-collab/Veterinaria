const router = require('express').Router();
const pool = require('../db/pool');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (_req, res) => {
  const [[u]]  = await pool.query('SELECT COUNT(*) AS n FROM usuarios');
  const [[m]]  = await pool.query('SELECT COUNT(*) AS n FROM mascotas');
  const [[c]]  = await pool.query('SELECT COUNT(*) AS n FROM citas WHERE estado IN ("pendiente","confirmada")');
  const [[pp]] = await pool.query('SELECT COUNT(*) AS n FROM pedidos WHERE estado = "pendiente"');
  const [[pr]] = await pool.query('SELECT COUNT(*) AS n FROM productos');
  const [alertas] = await pool.query('SELECT id, nombre, stock, stock_min FROM productos WHERE stock <= stock_min');
  res.json({
    usuarios: u.n, mascotas: m.n, citas: c.n,
    pedidos_pendientes: pp.n, productos: pr.n,
    alertas_inventario: alertas,
  });
});

module.exports = router;
