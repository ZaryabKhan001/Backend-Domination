import express from 'express';
import { handleUploadMedia, handleGenerateSignature } from '../controllers/media.controller.js';
import { uploadSingleFile } from '../middlewares/multer.middleware.js';
import { checkAuthentication } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(checkAuthentication);

router.post('/upload', uploadSingleFile('file'), handleUploadMedia);
router.get('/get-signature', handleGenerateSignature);

export default router;
