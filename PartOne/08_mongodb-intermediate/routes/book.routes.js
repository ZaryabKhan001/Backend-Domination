import express from 'express';
import {
  handleCreateAuthor,
  handleCreateBook,
  handleFetchBook,
} from '../controllers/book.controller.js';

const router = express.Router();

router.post('/author', handleCreateAuthor);
router.post('/book/:id', handleCreateBook);
router.get('/book/:id', handleFetchBook);

export default router;
