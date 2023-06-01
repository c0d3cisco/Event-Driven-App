'use strict';

const eventEmitter = require('../../eventEmitter.js');
const { handleDeliver, handlePickup } = require('./handler.js');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

// eventEmitter.on('pickup', (payload) => {
// socket.on('trigger', (payload) => {

//   // handlePickup(payload[1]);
  
//   setTimeout(() => {
//     console.log('Notified of order!!', payload);
//     // handleDeliver(payload[1]);
//   }, 10);

// });
socket.on('pickup', (payload) => {

  socket.emit('join-room', payload.vendor);
  console.log('DRIVER GOT MESSAGE');


  setTimeout(() => {
    socket.emit('in-transit', 'in-transit', payload);
  }, 1500);
  setTimeout(() => {
    socket.emit('delivered', 'delivered', payload);
  }, 3500);
});
socket.on('trigger', (payload) => console.log('DRIVER: its working -', payload));
socket.on('listen', (arg) => {
  console.log(arg); // world
});