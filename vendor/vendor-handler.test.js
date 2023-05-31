'use strict';

const eventEmitter = require('../eventEmitter.js');
const handler = require('./handler.js');
const Chance = require('chance');


jest.mock('../eventEmitter.js', () => {
    return {
        on: jest.fn(),
        emit: jest.fn(),
    };
});

console.log = jest.fn();

describe('Vendor handler', () => {
    let chance = new Chance();
    let payload = {
        name: chance.name(),
        guid: chance.guid(),
        address: chance.address(),
    };
    test('log Thank you Message', () => {
        handler(payload);
        expect(console.log).toHaveBeenCalledWith(`Thank you for your order, ${payload.name}`);
    });
    test('test payload', ()=>{
        handler(payload);
        expect(eventEmitter.emit).toHaveBeenCalledWith('pickup',['pickup', payload]);
    });
});
