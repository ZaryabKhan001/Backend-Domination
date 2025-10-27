import { cloudinary } from '../config/cloudinary.config.js';

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
