'use strict';

let eventEmitter = require('../eventEmitter');

require('dotenv').config({ path: '../.env'});
const PORT = process.env.PORT || 3002;

const { Server } = require('socket.io');
const io = new Server();


const caps = io.of('/caps');

caps.on('connection', (socket) => {

  console.log('sockets connected to cap namespace', socket.id);
  socket.emit('listen', 'LISTENER IS WORKING');
  
  socket.on('JOIN', (room) =>{
    console.log('these are the rooms', socket.adapter.rooms);
    console.log('room >>> ', room);
    socket.join(room);
    socket.to(room).emit('trigger', 'test');
    // console.log('---payload is the room name in this example--', room);
  });
  setInterval(() => {
    caps.to('Room NAME').emit( 'trigger', 'MESSAGE MESSAGE');
  }, 3000);
  
});

io.listen(PORT);
// require('../client/vendor');

// eventEmitter.on('pickup', logger);
// eventEmitter.on('in-transit', logger);
// eventEmitter.on('delivered', logger);

// require('../client/driver');


function logger(payload) {
  const date = new Date();
  const log = {
    event: payload[0],
    time: date.toUTCString(),
    payload: payload[1],
  };
  console.log('EVENT', log);

  switch (payload[0]) {
  case 'pickup':
    console.log('ORDER IS PICKED UP!');
    break;
  case 'in-transit':
    console.log('ORDER IN TRANSIT');
    break;
  case 'delivered':
    console.log('DELIVERED');
    break;
  default:
    console.log('There was an error in the logging system!');
    break;
  }
}

module.exports = { logger };