const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

let books = [
  {
    id: '1',
    title: 'Book 1',
  },
  {
    id: '2',
    title: 'Book 2',
  },
];

// intro api
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'welcome to our bookstore api',
  });
});

// get all books api
app.get('/books', (req, res) => {
  return res.status(200).json(books);
});

// get specific books api
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find((book) => book.id === bookId);
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: 'Book not found' });
});
// add book api
app.post('/books/add', (req, res) => {
  const { id, title } = req.body;

  const book = books.push({ id, title });

  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: 'Error in adding book' });
});

// update specific book api
app.put('/books/:id', (req, res) => {
  const id = req.params.id;
  const { title } = req.body;
  const book = books.find((book) => book.id === id);
  if (book) {
    book.title = title;
    return res.status(200).json({ message: 'book updated successfully' });
  }
  return res.status(404).json({ message: 'Book not found' });
});

// delete specific books api
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find((book) => book.id === bookId);
  if (book) {
    books = books.filter((book) => book.id != bookId);
    return res.status(200).json({ message: 'book deleted successfully' });
  }
  return res.status(404).json({ message: 'Book not found' });
});

app.listen(port, () => {
  console.log(`App is listening on Port: ${port}`);
});
