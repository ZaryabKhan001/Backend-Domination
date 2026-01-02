import mongoose from 'mongoose';
export const connectDB = async (uri) => {
    if (!uri) {
        throw new Error('MongoDB URI is required');
    }
    try {
        const connect = await mongoose.connect(uri);
        if (!connect.connection) {
        }
        console.error('MongoDB Connected Successfully');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
//# sourceMappingURL=database.js.map