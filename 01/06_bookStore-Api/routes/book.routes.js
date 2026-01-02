import express from 'express';
import {
  addNewBook,
  deleteBook,
  getAllBooks,
  getBook,
  updateBook,
} from '../controllers/book.controller.js';

const router = express.Router();

router.get('/all', getAllBooks);
router.get('/:id', getBook);
router.post('/create', addNewBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;