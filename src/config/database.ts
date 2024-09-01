import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
    const mongoURI = process.env.MONGO_URI || '';
    if (!mongoURI) {
        console.error('MONGO_URI is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected');
    } catch (err: any) {
        console.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    }
};
