// Usage: reading a file, making HTTP request with callbacks

function fetchData(callback) {
  setTimeout(() => {
    const data = { userId: 1, name: 'Alice' };
    callback(null, data);  // first param error, second param data
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Received data:', data);
  }
});
