import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ;
const CLIENT_URL = process.env.CLIENT_URL ;
console.log("Front End Running On"+CLIENT_URL)
// Connect to MongoDB
connectDB();

// CORS Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Other Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
