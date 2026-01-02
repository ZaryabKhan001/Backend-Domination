import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'nodejs-auth',
    });
    if (result.secure_url) {
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }
    return null;
  } catch (error) {
    console.log('Error while uploading on cloudinary', error);
    throw new Error(error);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result?.result === 'ok') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(error);
  }
};
