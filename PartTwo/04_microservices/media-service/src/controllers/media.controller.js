import { logger } from '../utils/logger.js';
import Media from '../models/media.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const handleUploadMedia = async (req, res) => {
  logger.info('Upload Media Endpoint hit');
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Upload Media Failed! File is missing.',
      });
    }

    const { originalname, mimetype, buffer } = req.file;
    const userId = req.user.userId;

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
    return res.status(520).json({
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

export const handleDeleteMedia = async (req, res) => {};
