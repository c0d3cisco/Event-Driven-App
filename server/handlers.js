'use strict';

const Queue = require('./queue.js');
// let messageQueue = new Queue;

function handlerQueueLoading (payload, socket, messageQueue) {
    
  console.log('MESSAGE RECEIVED', payload);
  //TODO: step ONE. store all messages in queue
  let currentQueue = messageQueue.read(payload.queueId);
  if(!currentQueue){
    
    let queueKey = messageQueue.store(payload.queueId, new Queue);
    currentQueue = messageQueue.read(queueKey);
  }
  
  currentQueue.store(payload.guid, payload);
  socket.broadcast.emit('MESSAGE', payload);
}


function handlerDequeue(payload, socket, messageQueue) {
  payload = payload[0];
  console.log('SERVER: Received event', payload);
  let currentQueue = messageQueue.read(payload.queueId);
  if(!currentQueue){
    throw new Error('whoops');
  }
  let message = currentQueue.remove(payload.messageId);
  
  socket.broadcast.emit('RECEIVED', message.text);
}


function loggerHandler(event, payload, socket = null) {
  console.log('LOGGER FUNCTION', event);
  if(!socket) return;
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
    console.log('PICKUP REQUESTED');
    break;
  case 'in-transit':
    socket.to(payload.vendor).emit('in-transit', `${payload.vendor}, the order is in transit to ${payload.name}`);
    console.log('ORDER IN TRANSIT');
    break;
  case 'delivered':
    socket.to(payload.vendor).emit('delivered', payload);
    console.log('DELIVERED');
    break;
  default:
    console.log('There was an error in the logging system!');
    break;
  }
}

module.exports = { loggerHandler, handlerDequeue, handlerQueueLoading};
