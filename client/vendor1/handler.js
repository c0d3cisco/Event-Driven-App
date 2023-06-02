'use strict';

module.exports = (socket, payload) =>{
  // vendor sends message to customer
  console.log(`TO CUSTOMER: Thank you for your order, ${payload.name}!`);
  // vendor joins appropriate room to initiate delivery
  socket.emit('join-room', payload.channel);
  // vendor emits a pick up order signal with payload that contains 
  socket.emit('pickupNeeded', payload);
};