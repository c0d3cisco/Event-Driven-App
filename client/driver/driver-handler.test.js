'use strict';

const eventEmitter = require('../../socket-client-for-test-only.test.js');
const { handleDeliver, handlePickup } = require('./handler.js');
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


describe('Driver delivery handler', () => {
  let chance = new Chance();
  let payload = {
    name: chance.name(),
    guid: chance.guid(),
    address: chance.address(),
  };

  test('log pickup message', () => {
    handlePickup(payload);
    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: picked-up<${payload.guid}>`);
  });

  test('emit in-transit event with correct params', () => {
    handlePickup(payload);
    expect(eventEmitter.emit).toHaveBeenCalledWith('in-transit', ['in-transit', payload]);
  });

  test('log delivery message', () => {
    handleDeliver(payload);
    expect(consoleSpy).toHaveBeenCalledWith(`DRIVER: delivered ${payload.guid}`);
  });

  test('emit delivered event with correct params', () => {
    handleDeliver(payload);
    expect(eventEmitter.emit).toHaveBeenCalledWith('delivered', ['delivered', payload]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
