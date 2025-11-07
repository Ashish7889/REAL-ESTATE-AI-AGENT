import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// Routes
import listingsRouter from './routes/listings.js';
import bookingsRouter from './routes/bookings.js';
import paymentsRouter from './routes/payments.js';
import agentRouter from './routes/agent.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connections
let redisClient = null;
try {
  redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  redisClient.connect().then(() => console.log('✅ Redis connected'));
} catch (error) {
  console.warn('⚠️ Redis not available, using in-memory cache');
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/riverwood')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Make redis available to routes
app.locals.redis = redisClient;

// Routes
app.use('/api/listings', listingsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/agent', agentRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1,
      redis: redisClient?.isReady || false
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Riverwood Backend running on http://localhost:${PORT}`);
});

