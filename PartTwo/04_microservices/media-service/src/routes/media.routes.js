import express from 'express';
import { handleUploadMedia } from '../controllers/media.controller.js';
import { uploadSingleFile } from '../middlewares/multer.middleware.js';
import { checkAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(checkAuthentication);

router.post('/upload', uploadSingleFile('file'), handleUploadMedia);

export default router;
