
// This is the main backend server file.
// To run this, you would need Node.js installed.
// From the 'backend' directory, run `npm install` to install dependencies,
// then `npm start` to run the server.

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import messageRoutes from './routes/messages.js';

const app = express();
const PORT = 8000;

// Connect to MongoDB
connectDB();

// Middleware
// The frontend will be on a different origin, so CORS is needed.
app.use(cors({
  origin: (origin, callback) => {
    // For local development, allow requests from any localhost or 127.0.0.1 origin.
    const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/
    ];
    if (!origin || allowedOrigins.some(regex => regex.test(origin))) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This allows cookies to be sent
}));
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies for authentication

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
