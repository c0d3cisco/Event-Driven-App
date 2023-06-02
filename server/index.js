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

  socket.on('pickupNeeded', (payload) => {
    handlerQueueLoading(payload, messageQueue);
    loggerHandler('pickup', payload, socket);
    socket.broadcast.emit('pickupAssigned',payload);
  });

  socket.on('in-transit', (payloadToRemoveFromQueue, payload) => {
    handlerDequeue(payloadToRemoveFromQueue, messageQueue); // handle dequeue pickup messages
    loggerHandler('in-transit', payload, socket);
    handlerQueueLoading(payload, messageQueue);
    socket.to(payload.channel).emit('in-transit', payload, `${payload.vendor}, the order is in transit to ${payload.name}`);
    // handlerQueueLoading(payload, socket, messageQueue); // handle queue for transfer messages
  }); 

  socket.on('delivered', (payload) => {
    // handlerDequeue(payload, messageQueue); // handle dequeue pickup messages
    loggerHandler('delivered', payload, socket);
    handlerQueueLoading(payload, messageQueue);
    socket.to(payload.channel).emit('delivered', payload, `${payload.vendor}, the order is in transit to ${payload.name}`);
    // handlerQueueLoading(payload, socket, messageQueue); // handle queue for transfer messages
  }); 

  socket.on('thankyou', (payload) => handlerDequeue(payload, messageQueue));

  // socket.on('delivery',(payload) => handlerDequeue(payload, messageQueue));

  //TODO: step THREE. create an event called GET-MESSAGE, that the recipient can emit so that they can obtain any missed messaged 
  socket.on('GET-MESSAGES-DRIVER', (payload) => {
    console.log('attempting to get messages');
    let currentQueue = messageQueue.read(payload.queueId);
    console.log(currentQueue);
    if(currentQueue?.data){
      Object.keys(currentQueue.data).forEach(messageId => {
        // sending saved messaged that were missed
        // maybe sending the correct room also
        socket.emit('pickupAssigned', currentQueue.read(messageId));
      });
    }
  });

  socket.on('GET-MESSAGES-VENDOR', (payload) => {
    console.log('attempting to get messages');
    let currentQueue = messageQueue.read(payload.queueId);
    console.log(currentQueue);
    if(currentQueue?.data){
      Object.keys(currentQueue.data).forEach(messageId => {
        console.log('hello')
        // sending saved messaged that were missed
        // maybe sending the correct room also
        socket.emit(payload.queueId, currentQueue.read(messageId));
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

process.stdin.on('data', data => {
  if(data.toString().slice(0, -1) === 'qall'){
    // console.log(messageQueue.data.size);
    console.log(messageQueue);
  }
});


io.listen(PORT);
