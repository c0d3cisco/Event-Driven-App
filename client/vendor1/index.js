'use strict';
// VENDOR //
const handleOrder = require('./handler.js');
const Chance = require('chance');
const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

// VENDOR 
const channel = 'channel-01';

// verify connection
socket.on('connect', () => console.log('Vendor Link with Server: SUCCESSFUL'));

// join vendor specific room
socket.emit('join-room', channel);

//sends payload, uses handler
process.stdin.on('data', data => {
  if(data.toString().slice(0, -1) === 'send'){
    let chance = new Chance();
    let time = new Date();
    let payload = {
      channel,
      time,
      vendor: chance.company(),
      guid: chance.guid(),
      name:chance.name(),
      address: chance.address(),
      queueId: 'pickupMessage',
    };
    handleOrder(socket, payload);
  }
});

// listens for incoming transit message 
socket.on('in-transit', (payload, message) => {
  console.log(payload);
  socket.emit('thankyou', payload);
});

// listen for incoming transit message
socket.on('delivered', (payload, message) => {
  console.log(payload);
  socket.emit('thankyou', payload);
});

//FOR IN-TRANSIT MESSAGE 
socket.emit('GET-MESSAGES-VENDOR', {queueId: `${channel}_InTransit`});
socket.emit('GET-MESSAGES-VENDOR', {queueId: `${channel}_Delivered`});

// confirmation transit message was received
socket.on(`${channel}_InTransit`, (payload) => {
  console.log(payload);
  socket.emit('thankyou', payload);
});

// confirmation delivered message was received
socket.on(`${channel}_Delivered`, (payload) => {
  console.log(payload);
  socket.emit('thankyou', payload);
});
