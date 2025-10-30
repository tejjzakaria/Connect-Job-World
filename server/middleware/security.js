import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

/**
 * Rate Limiter Configuration
 * Prevents brute force attacks and API abuse
 */
export const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs, // 15 minutes default
    max, // Limit each IP to max requests per windowMs
    message: {
      success: false,
      message: 'تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for health checks
    skip: (req) => req.path === '/api/health',
  });
};

/**
 * Strict rate limiter for auth routes
 * More restrictive to prevent brute force attacks on login
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: {
    success: false,
    message: 'تم تجاوز عدد محاولات تسجيل الدخول. يرجى المحاولة بعد 15 دقيقة',
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Helmet Security Headers
 * Adds various HTTP headers for security
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
});

/**
 * NoSQL Injection Protection
 * Sanitizes user input to prevent NoSQL injection attacks
 */
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious data on key: ${key}`);
  },
});

/**
 * HTTP Parameter Pollution Protection
 * Prevents parameter pollution attacks
 */
export const preventParamPollution = hpp({
  whitelist: ['service', 'status', 'source'], // Allow arrays for these parameters
});

/**
 * Trust Proxy Configuration
 * Required when behind a reverse proxy (nginx, load balancer, etc.)
 */
export const configureTrustProxy = (app) => {
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
  }
};

/**
 * CORS Configuration for Production
 */
export const getCorsOptions = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:5174'];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('غير مصرح بهذا المصدر من قبل CORS'));
      }
    },
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
};

/**
 * Request Logging Middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString(),
    };

    // Log only errors and slow requests in production
    if (res.statusCode >= 400 || duration > 1000) {
      console.error('Request Log:', JSON.stringify(logData));
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('Request Log:', JSON.stringify(logData));
    }
  });

  next();
};
