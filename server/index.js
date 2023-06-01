'use strict';

let eventEmitter = require('../eventEmitter');

require('dotenv').config({ path: '../.env'});
const PORT = process.env.PORT || 3002;

const { Server } = require('socket.io');
const io = new Server();


const caps = io.of('/caps');

caps.on('connection', (socket) => {

  console.log('sockets connected to cap namespace', socket.id);

  socket.on('join-room', (room) =>{
    socket.join(room);
    console.log(socket.id);
    console.log('these are the rooms', socket.adapter.rooms);
  });

  socket.on('pickup', (event, payload) => logger(event, payload, socket));
  socket.on('in-transit', (event, payload) => logger(event, payload, socket));
  socket.on('delivered', (event, payload) => logger(event, payload, socket));

});

io.listen(PORT);


function logger(event, payload, socket) {
  const date = new Date();
  const log = {
    event: event,
    time: date.toUTCString(),
    payload: payload,
  };
  console.log('EVENT', log);

  switch (event) {
  case 'pickup':
    socket.broadcast.emit('pickup', payload);
    console.log('ORDER IS PICKED UP!');
    break;
  case 'in-transit':
    socket.to(payload.vendor).emit('in-transit', payload);
    console.log('ORDER IN TRANSIT');
    break;
  case 'delivered':
    socket.to(payload.vendor).emit('delivered', payload);
    socket.leave(payload.vendor);
    console.log('DELIVERED');
    break;
  default:
    console.log('There was an error in the logging system!');
    break;
  }
}

module.exports = { logger };