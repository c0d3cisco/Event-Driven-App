'use strict';

const handler = require('./handler.js');
const Chance = require('chance');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

socket.on('connect', () => console.log('Vendor Link with Server: SUCCESSFUL'));

socket.on('in-transit', (payload) => {
    console.log(payload);
});

socket.on('delivered', (payload) => {
    console.log(`${payload.name}, your order was delivered`);
    socket.emit('leave-room', payload);
});

// * used to send single order
// setTimeout(() => {
//     let chance = new Chance();
//     let payload = {
//         vendor: chance.company(),
//         guid: chance.guid(),
//         name:chance.name(),
//         address: chance.address(),
//     };
//     handler(socket, payload);
// }, 1000);


// * simulate multiple orders
setInterval(() => {
    let chance = new Chance();
    let payload = {
        vendor: chance.company(),
        guid: chance.guid(),
        name:chance.name(),
        address: chance.address(),
    };
    handler(socket, payload);
}, 5000);


