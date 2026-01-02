console.log('Node Modules wrapper Demo');

console.log("__filename in wrapper explorer", __filename);
console.log("__dir in wrapper explorer", __dirname);

module.exports.greet = (name) => {
    console.log(`Hello ${name}`);
}