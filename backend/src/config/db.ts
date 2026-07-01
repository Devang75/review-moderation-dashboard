import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    const connInstance = await mongoose.connect(mongoUri);
    console.log(`\n🟢 MongoDB Connected! DB Host: ${connInstance.connection.host}`);
  } catch (error) {
    console.error('🔴 MongoDB Connection Error: ', error);
    process.exit(1);
  }
};

export default connectDB;
