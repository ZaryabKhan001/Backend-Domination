const EventEmitter = require('events');

class CustomEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.greeting = 'Hello';
  }
  greet(name) {
    this.emit('greeting', `${this.greeting} ${name}`);
  }
}

const customEmitterInstance = new CustomEventEmitter();

customEmitterInstance.on('greeting', (input) => {
  console.log(`Greeting event`, input);
});

customEmitterInstance.greet('Zaryab Zubair');
