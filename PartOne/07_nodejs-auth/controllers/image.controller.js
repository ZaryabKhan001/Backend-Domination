import Image from '../models/image.model.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import fs from 'fs';

export const handleUploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File path is required',
      });
    }

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: user not found',
      });
    }
    console.log('file', file);
    const uploadResult = await uploadToCloudinary(file.path);

    if (!uploadResult) {
      return res.status(404).json({
        success: false,
        message: 'Error while uploading on cloudinary',
      });
    }

    const newlyUploadImage = await Image.create({
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      uploadedBy: req.user.userId,
    });

    fs.unlinkSync(file.path);

    return res.status(200).json({
      success: true,
      message: 'Image Upload Successfully',
      data: newlyUploadImage,
    });
  } catch (error) {
    console.log('Image Upload Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Image Upload Failed',
    });
  }
};

export const handleFetchImages = async (req, res) => {
  try {
    const images = await Image.find({});

    if (!images) {
      return res.status(404).json({
        success: false,
        message: 'Error in fetching images',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Images Fetched Successfully',
      data: images,
    });
  } catch (error) {
    console.log('Images Fetching Failed', error);
    return res.status(500).json({
      success: false,
      message: 'Images Fetching Failed',
    });
  }
};

export const handleDeleteImage = async (req, res) => {
  try {
  } catch (error) {}
};
