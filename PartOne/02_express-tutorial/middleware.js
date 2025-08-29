const express = require('express');

const app = express();
const port = 3000;

const myFirstMiddleware = (req, res, next) => {
  console.log('Application middleware');
  next();
};

app.use(myFirstMiddleware);

app.get('/', (req, res) => {
  res.send('home page');
});

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
