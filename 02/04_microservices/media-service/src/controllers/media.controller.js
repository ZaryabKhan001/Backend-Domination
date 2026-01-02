import { logger } from '../utils/logger.js';
import Media from '../models/media.model.js';
import { uploadToCloudinary, generateSignature } from '../utils/cloudinary.js';
import { validateUploadRequestFromFrontend } from '../utils/validations.js';

export const handleUploadMedia = async (req, res) => {
  logger.info('Upload Media Endpoint hit');
  try {
    if (!req.file && !req.body?.secure_url) {
      return res.status(400).json({
        success: false,
        message: 'Upload Media Failed! File is missing.',
      });
    }

    // upload from backend
    if (!req.body?.secure_url) {
      const userId = req.user.userId;
      const { originalname, mimetype, buffer } = req.file;

      logger.info(`File Details: name=${originalname}, type=${mimetype}`);
      logger.info(`Uploading to Cloudinary started`);

      const result = await uploadToCloudinary(req.file);
      logger.info(`Uploading to Cloudinary Completed`);

      const newlyCreatedMedia = await Media.create({
        originalName: originalname,
        mimeType: mimetype,
        userId,
        publicId: result?.public_id,
        url: result?.secure_url,
      });
      logger.info('Media Uploaded Successfully');
      return res.status(200).json({
        success: true,
        message: 'Media Uploaded Successfully',
        publicId: result?.public_id,
        url: result?.secure_url,
        mediaId: newlyCreatedMedia._id,
      });
    }
    // url from frontend
    else {
      const userId = req.user.userId;
      const { error } = validateUploadRequestFromFrontend(req.body);

      if (error) {
        logger.warn(
          'Upload Media Failed! Validation Error: ' + error?.details[0]?.message
        );
        return res.status(400).json({
          success: false,
          message: error?.details[0]?.message || 'Validation Error',
        });
      }

      const {
        original_filename,
        public_id,
        secure_url,
        resource_type,
        format,
      } = req.body;
      const mimetype = `${resource_type}/${format}`;
      const originalName = `${original_filename}.${format}`;
      const newlyCreatedMedia = await Media.create({
        originalName,
        mimeType: mimetype,
        userId,
        publicId: public_id,
        url: secure_url,
      });
      logger.info('Media Uploaded Successfully');
      return res.status(200).json({
        success: true,
        message: 'Media Uploaded Successfully',
        post: newlyCreatedMedia,
      });
    }
  } catch (error) {
    logger.error('Upload Media Failed! Something went wrong', error);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Upload Media Failed! Something went wrong',
    });
  }
};

export const handleGetAllMedia = async (req, res) => {
  try {
    const allMedia = await Media.find({});
    return res.status(200).json({
      success: true,
      message: 'Fetched all Media Successfully',
      allMedia,
    });
  } catch (error) {
    logger.error('Getting all media Failed!', error);
    return res.status(500).json({
      success: false,
      message: 'Getting all media Failed!',
    });
  }
};

export const handleGenerateSignature = async (req, res) => {
  logger.info('Generate Signature Endpoint hit');
  try {
    const { timestamp, signature, folder } = await generateSignature();
    return res.status(200).json({
      success: true,
      message: 'Signature Created Successfully',
      signature: signature,
      timestamp: timestamp,
      folder: folder,
    });
  } catch (error) {
    logger.error('Signature Generation Failed!', error);
    return res.status(500).json({
      success: false,
      message: 'Signature Generation Failed!',
    });
  }
};
