import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Log database name (without credentials) for debugging
    const dbUri = process.env.MONGODB_URI_STAGING;
    const dbName = dbUri?.split('/').pop()?.split('?')[0] || 'unknown';
    console.log(`🔄 Attempting to connect to MongoDB database: ${dbName}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI_STAGING);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
