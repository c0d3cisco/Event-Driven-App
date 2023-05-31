'use strict';

const eventEmitter = require('../eventEmitter.js');


module.exports = (payload) =>{
    console.log(`Thank you for your order, ${payload.name}`);
    eventEmitter.emit('pickup', ['pickup', payload]);
};