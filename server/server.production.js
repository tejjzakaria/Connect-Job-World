import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import submissionRoutes from './routes/submissions.js';
import documentRoutes from './routes/documents.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';
import activityLogRoutes from './routes/activityLogs.js';

// Security middleware
import {
  createRateLimiter,
  authRateLimiter,
  securityHeaders,
  sanitizeData,
  preventParamPollution,
  configureTrustProxy,
  getCorsOptions,
  requestLogger,
} from './middleware/security.js';

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Initialize Express app
const app = express();

// Trust proxy (required for rate limiting behind reverse proxy)
configureTrustProxy(app);

// Security Headers (Helmet)
app.use(securityHeaders);

// CORS Configuration
app.use(cors(getCorsOptions()));

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Middleware
app.use(sanitizeData); // NoSQL injection protection
app.use(preventParamPollution); // HTTP parameter pollution protection

// Request Logging
if (process.env.LOG_REQUESTS !== 'false') {
  app.use(requestLogger);
}

// General Rate Limiting
const generalRateLimit = createRateLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
);
app.use('/api/', generalRateLimit);

// API Routes
app.use('/api/auth', authRateLimiter, authRoutes); // Stricter rate limit for auth
app.use('/api/clients', clientRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await import('mongoose').then((mongoose) =>
      mongoose.default.connection.readyState === 1 ? 'connected' : 'disconnected'
    );

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Service unavailable',
    });
  }
});

// Serve static files in production (if frontend is built and served from same server)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      res.status(404).json({ success: false, message: 'API route not found' });
    }
  });
}

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production
  const errorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'حدث خطأ في الخادم'
      : err.message,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
    errorResponse.path = req.path;
  }

  res.status(err.statusCode || 500).json(errorResponse);
});

// Connect to Database and Start Server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
      console.log(`📡 Listening on port ${PORT}`);
      console.log(`🌍 API URL: ${process.env.API_URL || `http://localhost:${PORT}/api`}`);
      console.log('=================================');

      // Send ready signal to PM2
      if (process.send) {
        process.send('ready');
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('HTTP server closed');

        try {
          const mongoose = await import('mongoose');
          await mongoose.default.connection.close();
          console.log('MongoDB connection closed');
          process.exit(0);
        } catch (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
