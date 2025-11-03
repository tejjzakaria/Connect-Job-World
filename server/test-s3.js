import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('\n🔍 Testing AWS S3 Configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Missing');
console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Missing');
console.log('  AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET || '❌ Missing');
console.log('  AWS_REGION:', process.env.AWS_REGION || '❌ Missing');
console.log('');

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error('❌ AWS credentials not found in environment variables');
  process.exit(1);
}

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3Connection() {
  try {
    // Test 1: List buckets (verify credentials work)
    console.log('📋 Test 1: Listing S3 buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);

    console.log('✅ Successfully connected to AWS S3!');
    console.log(`   Found ${listResponse.Buckets.length} bucket(s):`);
    listResponse.Buckets.forEach(bucket => {
      const isTarget = bucket.Name === process.env.AWS_S3_BUCKET;
      console.log(`   ${isTarget ? '👉' : '  '} ${bucket.Name}`);
    });
    console.log('');

    // Test 2: Upload a test file
    const bucketName = process.env.AWS_S3_BUCKET;
    const testKey = 'test/connection-test.txt';
    const testContent = `S3 Connection Test - ${new Date().toISOString()}`;

    console.log('📤 Test 2: Uploading test file...');
    console.log(`   Bucket: ${bucketName}`);
    console.log(`   Key: ${testKey}`);

    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
    });

    await s3Client.send(putCommand);
    console.log('✅ Test file uploaded successfully!');
    console.log('');

    console.log('🎉 All tests passed! S3 is configured correctly.');
    console.log('   You can now restart your server to use S3 for file uploads.');

  } catch (error) {
    console.error('❌ S3 Test Failed:', error.message);

    if (error.name === 'InvalidAccessKeyId') {
      console.error('\n💡 The AWS Access Key ID is invalid.');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.error('\n💡 The AWS Secret Access Key is incorrect.');
    } else if (error.name === 'NoSuchBucket') {
      console.error(`\n💡 The bucket "${process.env.AWS_S3_BUCKET}" does not exist or you don't have access to it.`);
    } else if (error.name === 'AccessDenied') {
      console.error('\n💡 Access denied. Check your IAM user permissions.');
    }

    console.error('\nError details:', error);
    process.exit(1);
  }
}

testS3Connection();
