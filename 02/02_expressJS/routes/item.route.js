import express from 'express';
import { asyncHandler } from '../middleware/error.middleware.js';
import { handleGetProducts, handleAddProduct } from '../controllers/item.controller.js';

const router = new express.Router();

router.get('/', asyncHandler(handleGetProducts));
router.get('/add', asyncHandler(handleAddProduct));

export default router;
