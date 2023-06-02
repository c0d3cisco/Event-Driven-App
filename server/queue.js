'use stick';

class Queue {
  constructor(){
    this.data = {}; // initializing an empty object to just keys later to store
    this.size = 0;
  }

  store(key,value){
    this.data[key] = value;
    console.log(`${value.queueId} was added to the queue with a key of ${key}`);
    this.size++;
    return key;
  }

  read(key){
    return this.data[key];
  }

  remove(key){
    console.log(`${key} was removed`);
    let value = this.data[key];
    delete this.data[key]; // delete is only the key property
    this.size--;
    return value;
  }
}

module.exports = Queue;