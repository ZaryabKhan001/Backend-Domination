// module.exports => export
// require => import 
const {add, substract, multiply, divide} = require("./first-module");

try {
    console.log(add(5, 3));
    console.log(substract(5, 3));
    console.log(multiply(5, 3));
    console.log(divide(5, 0));
} catch (error) {
    console.log('Error:',error.message);
}