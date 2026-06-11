// Crea schema + seed con hashes bcrypt válidos.
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const schema = fs.readFileSync(path.join(__dirname, '..', '..', 'sql', 'schema.sql'), 'utf8');
  await conn.query(schema);
  await conn.query(`USE ${process.env.DB_NAME || 'vet_adler'}`);

  const users = [
    { nombre: 'Admin Veterinaria',       correo: 'admin@vet.com',    pwd: 'admin123', tel: null,         rol: 'admin' },
    { nombre: 'Mauricio Almazán García', correo: 'user@vet.com',     pwd: 'user123',  tel: '5551234567', rol: 'user' },
    { nombre: 'Adler Ganadero',          correo: 'ganadero@vet.com', pwd: 'gan123',   tel: '5559876543', rol: 'ganadero' },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.pwd, 10);
    await conn.query(
      'INSERT INTO usuarios (nombre, correo, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [u.nombre, u.correo, hash, u.tel, u.rol]
    );
  }

  await conn.query(`
    INSERT INTO productos (nombre, categoria, stock, unidad, precio, stock_min) VALUES
    ('NexGard','Antiparasitario',25,'tableta',350,5),
    ('Vacuna Triple Felina','Vacuna',15,'dosis',280,5),
    ('Alimento Premium Perro 15kg','Alimento',8,'bulto',980,3);
  `);

  console.log('✔ Base de datos creada y poblada.');
  await conn.end();
})().catch((e) => { console.error(e); process.exit(1); });
