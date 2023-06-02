'use strict';

const { handleDelivery, handlePickup } = require('./handler.js');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

socket.on('connect', () => console.log('Driver Link with Server: SUCCESSFUL'));

socket.on('pickupAssigned', (payload) => {
  console.log('PICKUP NOTIFICATION');

  socket.emit('join-room', payload.channel);

  setTimeout(() => {
    handlePickup(payload, socket);
  }, 2500);

  setTimeout(() => {
    handleDelivery(payload, socket);
  }, 5000);
});

socket.on('in-transit', (payload) => {
  console.log(`${payload.vendor}, the order is in transit to ${payload.name} INCORRECTLY`);
});

socket.on('delivered', (payload) => {
  console.log(`${payload.name}, your order was delivered INCORRECTLY`);
});

socket.emit('GET-MESSAGES-DRIVER', {queueId: 'pickupMessage'});
