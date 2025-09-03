import express from 'express';
import { checkAuth, checkIsAdmin } from '../middlewares/auth.middleware.js';
import {
  handleUploadImage,
  handleFetchImages,
  handleDeleteImage,
} from '../controllers/image.controller.js';
import { uploadImage } from '../middlewares/multer.middleware.js';

const router = express.Router();
router.post(
  '/upload',
  checkAuth,
  checkIsAdmin,
  uploadImage('image'),
  handleUploadImage
);
router.get('/all-images', checkAuth, handleFetchImages);
router.delete('/delete', checkAuth, checkIsAdmin, handleDeleteImage);

export default router;
