import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/auth.js';
import childRoutes from './Routes/child.js';
import gameSessionRoutes from './Routes/gameSession.js'; // ✅ NEW LINE

dotenv.config();

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childRoutes);
app.use('/api/sessions', gameSessionRoutes); // ✅ NEW LINE

// Server
app.listen(3000, () => console.log('Server running on port 5000'));
