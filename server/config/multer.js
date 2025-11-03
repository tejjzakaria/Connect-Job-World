import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if S3 is configured
const isS3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET
);

// Detect if we're in a serverless environment (Vercel, AWS Lambda, etc.)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT;

// Determine storage strategy
let storage;
let uploadsDir;

if (isS3Configured) {
  // Use memory storage for S3 uploads (we'll handle the S3 upload in the route)
  console.log('☁️  Using AWS S3 for file storage');
  storage = multer.memoryStorage();
} else {
  // Use disk storage for local development
  // In serverless environments, only /tmp is writable
  // In local/traditional hosting, use the project's uploads directory
  uploadsDir = isServerless
    ? '/tmp/uploads'
    : path.join(__dirname, '../uploads');

  // Ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  console.log(`📁 Using local disk storage: ${uploadsDir}${isServerless ? ' (serverless mode)' : ' (local mode)'}`);

  if (isServerless) {
    console.log('⚠️  Note: Running in serverless environment. Files in /tmp are temporary. Consider configuring S3 for production.');
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // We'll set a better filename in the route after we have submission data
      // For now, use a temporary unique name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = path.extname(file.originalname);
      cb(null, `temp_${uniqueSuffix}${fileExtension}`);
    }
  });
}

// File filter - only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع الملف غير مدعوم. يرجى رفع ملفات PDF, صور, أو مستندات Word/Excel فقط'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Export upload middleware, uploadsDir, and S3 configuration status
export default upload;
export { uploadsDir, isS3Configured };
