import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export function getMongoUri(): string {
  // Read MONGO_URI or MONGODB_URI
  let uri = process.env.MONGO_URI || process.env.MONGODB_URI || '';
  
  // If user provided uri with template placeholder, substitute the verified database password
  if (uri.includes('<db_password>')) {
    uri = uri.replace('<db_password>', 'krish123');
  }

  // Fallback to cluster URI if empty
  if (!uri) {
    uri = 'mongodb+srv://krish:krish123@cluster0.j5itlwt.mongodb.net/cinebook?retryWrites=true&w=majority&appName=Cluster0';
  }

  // Ensure default database name is cinebook if not specified
  if (uri.startsWith('mongodb+srv://') && !uri.includes('.net/cinebook')) {
    if (uri.includes('.net/?')) {
      uri = uri.replace('.net/?', '.net/cinebook?');
    } else if (uri.endsWith('.net') || uri.endsWith('.net/')) {
      uri = uri.replace(/\.net\/?$/, '.net/cinebook?retryWrites=true&w=majority');
    }
  }

  return uri;
}

export async function connectDB(): Promise<boolean> {
  const mongoUri = getMongoUri();
  
  try {
    mongoose.set('strictQuery', true);
    console.log(`[Database] Connecting to MongoDB Atlas cluster...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnectedToMongo = true;
    console.log(`[Database] MongoDB Atlas Connected successfully via Mongoose! Database: ${mongoose.connection.name}`);
    return true;
  } catch (err: any) {
    isConnectedToMongo = false;
    console.error('[Database] MongoDB connection error:', err.message);
    return false;
  }
}
