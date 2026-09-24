import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinebook';
  
  try {
    // Attempt Mongoose connection with a quick timeout so app doesn't hang if no external Mongo
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnectedToMongo = true;
    console.log(`[Database] MongoDB Connected successfully via Mongoose: ${mongoUri}`);
    return true;
  } catch (err) {
    isConnectedToMongo = false;
    console.log('[Database] Live MongoDB instance not found. Initializing built-in high performance MERN Document Store.');
    return false;
  }
}
