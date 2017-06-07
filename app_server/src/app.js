const io = require('socket.io');

const socketIO = io.listen(6000);

socketIO.on('connection', function(socket) {

  console.log('APP:Socket:', 'Connection');

});
