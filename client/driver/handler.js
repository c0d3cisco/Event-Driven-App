'use strict';


const handlePickup = (payload, socket) => {
  console.log(`DRIVER: picked-up order from ${payload.vendor}, currently IN-TRANSIT`);
  let payloadToRemoveFromQueue = {
    queueId: 'pickupMessage',
    guid: payload.guid,
  };
  payload.queueId = `${payload.channel}_InTransit`;
  payload.time = new Date();
  socket.emit('in-transit', payloadToRemoveFromQueue, payload);
};

const handleDelivery = (payload, socket) => {
  console.log(`DRIVER: delivery to ${payload.name} complete`);
  payload.queueId = `${payload.channel}_Delivered`;
  payload.time = new Date();
  socket.emit('delivered', payload);
};

module.exports = { handleDelivery, handlePickup };

