'use strict';
// VENDOR //
const handleOrder = require('./handler.js');
const Chance = require('chance');

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/caps');

// LISTEN TO SUCCESSFUL CONNECTION
socket.on('connect', () => console.log('Vendor Link with Server: SUCCESSFUL'));

// LISTEN TO IN-TRANSIT
socket.on('in-transit', (payload) => {
    console.log(payload);
});

// LISTEN TO 
socket.on('RECEIVED', (messageText) => console.log(`The message ${messageText} was successfully delivered.`))

socket.on('delivered', (payload) => {
    console.log(`${payload.name}, your order was delivered`);
    socket.emit('leave-room', payload.vendor);
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
//     handleOrder(socket, payload);
// }, 1000);

process.stdin.on('data', data => {
    if(data.toString().slice(0, -1) === 'send'){
        let chance = new Chance();
        let payload = {
            vendor: chance.company(),
            guid: chance.guid(),
            name:chance.name(),
            address: chance.address(),
            queueId: 'message',
        };
        let payload2 = {
            text: `hello, ${payload.name}`,
            messageId: payload.guid,
            queueId: 'message',
        }
        // socket.emit('MESSAGE', payload2);
        handleOrder(socket, payload);
    }
});

// process.stdin.on('data', data => {
//     if(data.toString().slice(0, -1) === 'send'){
//         console.log(messageQueue.data);
//     }
// });




// * simulate multiple orders
// setInterval(() => {
//     let chance = new Chance();
//     let payload = {
//         vendor: chance.company(),
//         guid: chance.guid(),
//         name:chance.name(),
//         address: chance.address(),
//     };
//     handleOrder(socket, payload);
// }, 5000);


