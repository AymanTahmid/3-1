// api/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import your routes (ESM style)
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import adminRoute from './routes/admin.route.js';

dotenv.config();

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://rownokshah:rownokshah@mern-estate.v5lav.mongodb.net/?retryWrites=true&w=majority&appName=mern-estate")
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

// In ESM, __dirname is not defined by default.
// Use the following approach to emulate __dirname:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Mount your routes
app.use('/api/admin', adminRoute);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Serve static files (adjust path if your folder structure differs)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!!!!`);
});
