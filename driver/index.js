'use strict';

const eventEmitter = require('../eventEmitter');
const { handleDeliver, handlePickup } = require('./handler.js');

eventEmitter.on('pickup', (payload) => {

  handlePickup(payload[1]);

  setTimeout(() => {
    handleDeliver(payload[1]);
  }, 2000);

});
