import { cloudinary } from '../config/cloudinary.config.js';
import { logger } from './logger.js';

export const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'microservices-socialMedia' },
      (error, uploadResult) => {
        if (error) {
          return reject(error);
        }
        return resolve(uploadResult);
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    logger.info('Asset deleted from Cloudinary');
    return result;
  } catch (error) {
    logger.error('Asset deletion from Cloudinary failed', error?.message);
    throw error;
  }
};

export const generateSignature = async () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'microservices-socialMedia';

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      folder,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return { timestamp, signature, folder };
};
