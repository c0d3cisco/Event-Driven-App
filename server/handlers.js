'use strict';

const Queue = require('./queue.js');

function handlerQueueLoading (payload, messageQueue) {
  let currentQueue = messageQueue.read(`${payload.queueId}`);
  if(!currentQueue){
    let queueKey = messageQueue.store(payload.queueId, new Queue);
    currentQueue = messageQueue.read(queueKey);
  }
  currentQueue.store(payload.guid, payload);
}


function handlerDequeue(payload, messageQueue) {
  let currentQueue = messageQueue.read(payload.queueId);
  if(!currentQueue){
    throw new Error('whoops');
  }
  return currentQueue.remove(payload.guid);
}


function loggerHandler(event, payload, socket = null) {
  console.log('LOGGER FUNCTION', event);
  if(!socket) return;
  const date = new Date();
  const log = {
    event: event,
    time: date.toUTCString(),
    payload: payload,
  };
  console.log('EVENT', log);
}

module.exports = { loggerHandler, handlerDequeue, handlerQueueLoading};
