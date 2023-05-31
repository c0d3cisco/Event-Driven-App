'use strict';

let eventEmitter = require('./eventEmitter');

// TODO: log event from vendor
// TODO: log event from pick-up by deliver
// TODO: log event from delivery by driver

require('./vendor');
require('./driver');



eventEmitter.on('pickup', logger);
eventEmitter.on('in-transit', logger);
eventEmitter.on('delivered', logger);

function logger(payload) {
  const date = new Date();
  const log = {
    event: payload[0],
    time: date.toUTCString(),
    payload: payload[1],
  };
  console.log('EVENT', log);

  switch (payload[0]) {
  case 'pickup':
    console.log('ORDER IS PICKED UP!');
    break;
  case 'in-transit':
    console.log('ORDER IN TRANSIT');
    break;
  case 'delivered':
    console.log('DELIVERED');
    break;
  default:
    console.log('EXTRA EXTRA EXTRA EXTRA EXTRA');
    break;
  }

}

module.exports = { logger };