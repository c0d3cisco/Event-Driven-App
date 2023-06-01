'use strict';


const handlePickup = (payload, socket) => {
  console.log(`DRIVER: picked-up<${payload.guid}>`);
  socket.emit('in-transit', 'in-transit', payload);
};

const handleDeliver = (payload, socket) => {
  console.log(`DRIVER: delivered ${payload.guid}`);
  socket.emit('delivered', 'delivered', payload);
};

module.exports = { handleDeliver, handlePickup };

