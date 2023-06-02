'use strict';

const {socket} = require('../../socket-client-for-test-only.test.js');
const handler = require('./handler.js');
const Chance = require('chance');


jest.mock('../socket-client-for-test-only.test.js', () => {
    return {
        on: jest.fn(),
        emit: jest.fn(),
    };
});

let consoleSpy;
beforeAll(()=> {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
});

afterAll(()=>{
    consoleSpy.mockRestore();
});



describe('Vendor handler', () => {
    let chance = new Chance();
    let payload = {
        name: chance.name(),
        guid: chance.guid(),
        address: chance.address(),
    };
    test('log Thank you Message', () => {
        handler(payload);
        expect(consoleSpy).toHaveBeenCalledWith(`Thank you for your order, ${payload.name}`);
    });
    test('test payload', ()=>{
        handler(payload);
        expect(socket.emit).toHaveBeenCalledWith('pickup',payload);
    });
});
