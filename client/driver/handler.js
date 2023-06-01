'use strict';

let eventEmitter = require('../../eventEmitter.js');

const handlePickup = (payload) => {
  console.log(`DRIVER: picked-up<${payload.guid}>`);
  eventEmitter.emit('in-transit', ['in-transit', payload]);
};

const handleDeliver = (payload) => {
  console.log(`DRIVER: delivered ${payload.guid}`);
  eventEmitter.emit('delivered', ['delivered', payload]);
};

module.exports = { handleDeliver, handlePickup };

