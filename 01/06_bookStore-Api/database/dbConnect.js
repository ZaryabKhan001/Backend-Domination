import mongoose from 'mongoose';

export const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    if (connect.connection) {
      console.log('DB Connected Successfully');
    }
  } catch (error) {
    console.log('DB Connection Failed', error);
    process.exit(1);
  }
};
