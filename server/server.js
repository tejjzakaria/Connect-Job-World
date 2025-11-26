import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import submissionRoutes from './routes/submissions.js';
import documentRoutes from './routes/documents.js';
import paymentRoutes from './routes/payments.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import activityLogRoutes from './routes/activityLogs.js';

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  const dbName = mongoose.connection.name || 'Not connected';
  const dbHost = mongoose.connection.host || 'Unknown';

  res.json({
    status: 'OK',
    message: 'Server is running',
    database: {
      name: dbName,
      host: dbHost,
      connected: mongoose.connection.readyState === 1
    }
  });
});

// Serve static files in production (if frontend is built)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');

  // Serve static assets
  app.use(express.static(distPath));

  // SPA Fallback: Serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      // API route not found
      res.status(404).json({ success: false, message: 'API route not found' });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Start server only if not running in serverless environment (Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
