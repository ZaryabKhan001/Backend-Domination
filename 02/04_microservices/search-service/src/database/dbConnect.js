import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';
export const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    if (connect.connection) {
      logger.info('DB Connected Successfully');
    }
  } catch (error) {
    logger.error('DB Connection Failed', error);
    process.exit(1);
  }
};
