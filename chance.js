'use strict';

const Chance = require('chance');

const chance = new Chance();

const payload = {
  name:chance.name(),
  guid: chance.guid(),
  address: chance.address(),
};

console.log(payload);