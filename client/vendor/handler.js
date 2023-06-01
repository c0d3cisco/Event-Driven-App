'use strict';


module.exports = (socket, payload) =>{
    // vendor sends message to customer
    console.log(`Thank you for your order, ${payload.name}`);
    // vendor emits a pick up order signal
    socket.emit('pickup', 'pickup', payload);
    // vendor joins appropriate room to initiate delivery
    socket.emit('join-room', payload.vendor);
};