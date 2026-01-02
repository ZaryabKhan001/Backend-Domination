const EventEmitter = require('events');

const eventEmitter = new EventEmitter();

eventEmitter.on('orderPlaced', (orderId) => {
    console.log(`Order: ${orderId} Successfull`);
});

function placeOrder(orderId) {
    console.log("Order Placed.");
    eventEmitter.emit('orderPlaced', orderId);
};

placeOrder(123);