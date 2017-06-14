const io = require('socket.io');

const socketIO = io.listen(6000);

let totalPlayers = 0;

socketIO.on('connection', (socket) => {

  console.log('APP:Socket:', 'Connection');

  socket.on('disconnect', () => {
    console.log('APP:Socket:', 'Disconnect');
    totalPlayers--;
    socketIO.emit('playerDisconnected', totalPlayers);
  });

  totalPlayers++;

  socketIO.emit('playerConnected', totalPlayers);
});
