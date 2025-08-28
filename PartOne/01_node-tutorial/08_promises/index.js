// promises.js

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ userId: 1, name: 'Alice' });
    }, 1000);
  });
}

function processData(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...data, processed: true });
    }, 1000);
  });
}

function saveData(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Save successful');
    }, 1000);
  });
}

// Usage with Promises
fetchData()
  .then(data => processData(data))
  .then(processedData => saveData(processedData))
  .then(result => {
    console.log('Promises - Data saved:', result);
  })
  .catch(error => {
    console.error('Promises - Error:', error);
  });
