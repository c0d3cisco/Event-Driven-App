'use strict';

const { handleDeliver, handlePickup } = require('./handler.js');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

socket.on('pickup', (payload) => {

  socket.emit('join-room', payload.vendor);
  console.log('DRIVER GOT MESSAGE');


  setTimeout(() => {
    handlePickup(payload, socket);
  }, 1500);
  setTimeout(() => {
    handleDeliver(payload, socket);
  }, 3500);
});
socket.on('in-transit', (payload) => {
  console.log(`${payload.vendor}, the order is in transit to ${payload.name} INCORRECTLY`);
});
socket.on('delivered', (payload) => {
  console.log(`${payload.name}, your order was delivered INCORRECTLY`);
});
