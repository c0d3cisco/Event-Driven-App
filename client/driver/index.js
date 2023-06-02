'use strict';

const { handleDelivery, handlePickup } = require('./handler.js');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

// listening pickup signal from CAP
socket.on('pickup', (payload) => {
  console.log('PICKUP NOTIFICATION');

  // join room of vendor
  socket.emit('join-room', payload.vendor);
  // handling post pickup. 1.5s delay to simulate driver getting to vendor
  setTimeout(() => {
    handlePickup(payload, socket);
  }, 1500);

  // handling deliver 2 seconds after pickup
  setTimeout(() => {
    handleDelivery(payload, socket);
  }, 7000);
});

socket.on('in-transit', (payload) => {
  console.log(`${payload.vendor}, the order is in transit to ${payload.name} INCORRECTLY`);
});

socket.on('delivered', (payload) => {
  console.log(`${payload.name}, your order was delivered INCORRECTLY`);
});

socket.on('MESSAGE', (payload) => {
  setTimeout(() => {
    console.log('Message received: ', payload);
    // this is the signal to remove it from the list in the server
    let payload1 = {
      text: payload.text,
      messageId: payload.messageId,
      queueId: 'message',
    };let payload2 = {
      text: payload.text,
      messageId: payload.messageId,
      queueId: 'inTransit',
    };
    socket.emit('RECEIVED', [payload1, payload2]);
  }, 1000);
});

socket.emit('GET-MESSAGES', {queueId: 'message'});
