'use strict';

// let eventEmitter = require('../eventEmitter');
const handler = require('./handler.js');
const Chance = require('chance');

setInterval(() => {
    let chance = new Chance();
    let payload = {
        name:chance.name(),
        guid: chance.guid(),
        address: chance.address(),
    };
    handler(payload);
}, 3000);
