// callbackHell.js

function fetchData(callback) {
  setTimeout(() => {
    callback(null, { userId: 1, name: 'Alice' });
  }, 1000);
}

function processData(data, callback) {
  setTimeout(() => {
    callback(null, { ...data, processed: true });
  }, 1000);
}

function saveData(data, callback) {
  setTimeout(() => {
    callback(null, 'Save successful');
  }, 1000);
}

// Usage (Callback Hell)
fetchData((error, data) => {
  if (error) return console.error(error);

  processData(data, (error, processedData) => {
    if (error) return console.error(error);

    saveData(processedData, (error, result) => {
      if (error) return console.error(error);

      console.log('Callback Hell - Data saved:', result);
    });
  });
});
