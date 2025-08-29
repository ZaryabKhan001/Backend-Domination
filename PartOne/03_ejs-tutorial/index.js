const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// set the view engine as ejs
app.set('view engine', 'ejs');

// set the directory for the views
app.set('views', path.join(__dirname, 'views'));

const products = [
  {
    id: 1,
    name: 'product 1',
  },
  {
    id: 2,
    name: 'product 2',
  },
];

app.get('/', (req, res) => {
  res.render('home', {title: 'Home Page', products: products});
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page" });
});

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
