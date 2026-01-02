import { logger } from '../utils/logger.js';
import Media from '../models/media.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const handleDeleteMedia = async (event) => {
  try {
    const { mediaIds, postId } = event;

    const allMediastoBeDeleted = await Media.find({ _id: { $in: mediaIds } });

    await Media.deleteMany({ _id: { $in: mediaIds } });
    logger.info(`All MediaIds deleted from DB. Associated with ${postId}`);

    await Promise.all(
      allMediastoBeDeleted.map((media) => deleteFromCloudinary(media.publicId))
    );

    logger.info(`All MediaIds deleted from Cloudinary. Associated with ${postId}`);
  } catch (error) {
    logger.error('Media Deletion Failed!', error?.message);
  }
};
