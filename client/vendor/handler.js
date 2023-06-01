'use strict';


module.exports = (socket, payload) =>{
    console.log(`Thank you for your order, ${payload.name}`);
    socket.emit('join-room', payload.vendor);
    socket.emit('pickup', 'pickup', payload);
};