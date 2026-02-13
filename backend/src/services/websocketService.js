let io = null;

function initWebsocket(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    socket.on('ping:dashboard', () => {
      socket.emit('pong:dashboard', { at: new Date().toISOString() });
    });
  });

  return io;
}

function emitEvent(event, payload) {
  if (io) io.emit(event, payload);
}

module.exports = { initWebsocket, emitEvent };
