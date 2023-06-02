'use strict';

// imports
require('dotenv').config({ path: '../.env'});
const { Server } = require('socket.io');
const { loggerHandler, handlerDequeue, handlerQueueLoading} = require('./handlers.js');
const Queue = require('./queue.js');
const PORT = process.env.PORT || 3002;

// combinations/initiations
const io = new Server();
let messageQueue = new Queue;
const caps = io.of('/caps');


//create connection point for endpoint
caps.on('connection', (socket) => {

  console.log('sockets connected to cap namespace', socket.id);

  socket.onAny((event,  payload) => {
    !payload ?
      loggerHandler(event, payload, socket)
      : null;
  });

  // socket that emits room will join room with specific room name
  socket.on('join-room', (room) =>{
    socket.join(room);
    console.log(socket.id);
    console.log('these are the rooms', socket.adapter.rooms);
  });


  socket.on('leave-room', (room) => {
    socket.leave(room);
    console.log(`${socket.id} left the room`);
  });

  socket.on('pickup', (payload) => handlerQueueLoading(payload, socket, messageQueue));
  socket.on('RECEIVED', (payload) => handlerQueueLoading(payload[1], socket, messageQueue));  
  socket.on('RECEIVED',(payload) => handlerDequeue(payload, socket, messageQueue));

  //TODO: step THREE. create an event called GET-MESSAGE, that the recipient can emit so that they can obtain any missed messaged 
  socket.on('GET-MESSAGES', (payload) => {
    console.log('attempting to get messages');
    let currentQueue = messageQueue.read(payload.queueId);
    console.log(currentQueue);
    if (currentQueue && currentQueue.data){
      Object.keys(currentQueue.data).forEach(messageId => {
        // sending saved messaged that were missed
        // maybe sending the correct room also
        socket.emit('MESSAGE', currentQueue.read(messageId));
      });
    }
  });

});

process.stdin.on('data', data => {
  if(data.toString().slice(0, -1) === 'queue'){
    // console.log(messageQueue.data.size);
    console.log(messageQueue.data);
  }
});


io.listen(PORT);
