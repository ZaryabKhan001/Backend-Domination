// asyncAwait.js

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

// Usage with async/await
async function handleData() {
  try {
    const data = await fetchData();
    const processedData = await processData(data);
    const result = await saveData(processedData);
    console.log('Async/Await - Data saved:', result);
  } catch (error) {
    console.error('Async/Await - Error:', error);
  }
}

handleData();
