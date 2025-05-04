import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';
dotenv.config();

const app = express();

// Connect to MongoDB (using Atlas URI or local URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
// Import routes (direct import without async)
import childRoutes from './Routes/child.js';

// Use routes
app.use('/api/children', childRoutes);

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
