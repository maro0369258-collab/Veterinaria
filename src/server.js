require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/', (_req, res) => res.json({ name: 'Veterinaria Adler API', ok: true }));

app.use('/api/auth',      require('./routes/auth'));
app.use('/api/usuarios',  require('./routes/usuarios'));
app.use('/api/mascotas',  require('./routes/mascotas'));
app.use('/api/citas',     require('./routes/citas'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos',   require('./routes/pedidos'));
app.use('/api/ganado',    require('./routes/ganado'));
app.use('/api/resumen',   require('./routes/resumen'));
app.use('/api/payments',  require('./routes/payments'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const http = require('http');
const { Server: IOServer } = require('socket.io');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 4000;

function startServer(port, attemptsLeft = 10) {
  const server = http.createServer(app);

  // Attach Socket.IO to the HTTP server
  const io = new IOServer(server, {
    cors: { origin: process.env.CORS_ORIGIN || '*' }
  });
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);
    // allow clients to join rooms, e.g., 'admin' or 'veterinario'
    socket.on('join', (room) => { socket.join(room); });
    socket.on('leave', (room) => { socket.leave(room); });
    socket.on('disconnect', () => { /* disconnected */ });
  });

  server.listen(port);

  server.on('listening', () => {
    console.log(`API en http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Puerto ${port} en uso.`);
      if (attemptsLeft > 0) {
        const nextPort = port + 1;
        console.log(`Intentando en el puerto ${nextPort} (${attemptsLeft - 1} intentos restantes)...`);
        setTimeout(() => startServer(nextPort, attemptsLeft - 1), 300);
        return;
      }
      console.error('No se pudo iniciar el servidor: todos los puertos intentados están en uso.');
      process.exit(1);
    }

    console.error('Error del servidor:', err);
    process.exit(1);
  });
}

startServer(DEFAULT_PORT);
