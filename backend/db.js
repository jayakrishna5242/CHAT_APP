
import mongoose from 'mongoose';

// Hardcoded MongoDB connection string as per the request
const MONGO_URI = 'mongodb+srv://jaya3104:WjA2MEE50CIQUEvW@cluster0.oaflm.mongodb.net/JAYAKRISHNA?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
