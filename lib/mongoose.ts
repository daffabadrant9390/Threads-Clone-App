import mongoose from 'mongoose';

let isDBConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
  if (isDBConnected) return console.log('Already connected to MongoDB');

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isDBConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(error);
  }
};
