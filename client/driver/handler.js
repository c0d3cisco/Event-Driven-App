'use strict';


const handlePickup = (payload, socket) => {
  console.log(`DRIVER: picked-up order from <${payload.vendor}, currently IN-TRANSIT`);
  socket.emit('in-transit', payload);
};

const handleDelivery = (payload, socket) => {
  console.log(`DRIVER: delivery to ${payload.name} complete`);
  socket.emit('delivered', payload);
  socket.emit('leave-room', payload.vendor);
};

module.exports = { handleDelivery, handlePickup };

