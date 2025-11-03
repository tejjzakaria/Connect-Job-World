import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'connectjobworld-documents';

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} key - S3 object key (file path in bucket)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<{success: boolean, key: string, url: string}>}
 */
export const uploadToS3 = async (fileBuffer, key, contentType) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // ServerSideEncryption: 'AES256', // Enable server-side encryption
    });

    await s3Client.send(command);

    // Generate the S3 URL (note: this won't be publicly accessible due to bucket policy)
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;

    console.log(`✅ File uploaded to S3: ${key}`);

    return {
      success: true,
      key,
      url,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

/**
 * Generate a presigned URL for secure file access
 * @param {string} key - S3 object key
 * @param {number} expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns {Promise<string>} Presigned URL
 */
export const getPresignedUrl = async (key, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};

/**
 * Delete a file from S3
 * @param {string} key - S3 object key
 * @returns {Promise<{success: boolean}>}
 */
export const deleteFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`🗑️  File deleted from S3: ${key}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error(`S3 deletion failed: ${error.message}`);
  }
};

/**
 * Check if S3 is properly configured
 * @returns {boolean}
 */
export const isS3Configured = () => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET
  );
};

export default {
  uploadToS3,
  getPresignedUrl,
  deleteFromS3,
  isS3Configured,
};
