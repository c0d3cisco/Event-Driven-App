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
  }, 3500);
});

socket.on('in-transit', (payload) => {
  console.log(`${payload.vendor}, the order is in transit to ${payload.name} INCORRECTLY`);
});

socket.on('delivered', (payload) => {
  console.log(`${payload.name}, your order was delivered INCORRECTLY`);
});
