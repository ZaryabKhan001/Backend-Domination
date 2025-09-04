import express from 'express';
import {
  handleAddSampleProducts,
  handleGetProductStat,
  handleGetProductAnalysis,
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/add-sample', handleAddSampleProducts);
router.get('/stats', handleGetProductStat);
router.get('/analysis', handleGetProductAnalysis);

export default router;
