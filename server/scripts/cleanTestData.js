import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from '../models/Client.js';
import Submission from '../models/Submission.js';

// Load environment variables
dotenv.config();

const cleanDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get current counts
    const clientCount = await Client.countDocuments();
    const submissionCount = await Submission.countDocuments();

    console.log('📊 Current Database Statistics:');
    console.log(`   Clients: ${clientCount}`);
    console.log(`   Submissions: ${submissionCount}\n`);

    // Ask for confirmation
    console.log('⚠️  WARNING: This will delete ALL clients and submissions!');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🗑️  Deleting all data...');
    const startDelete = Date.now();

    await Promise.all([
      Client.deleteMany({}),
      Submission.deleteMany({})
    ]);

    const deleteTime = Date.now() - startDelete;

    console.log(`✅ Deleted ${clientCount + submissionCount} records in ${deleteTime}ms\n`);

    // Verify
    const remainingClients = await Client.countDocuments();
    const remainingSubmissions = await Submission.countDocuments();

    console.log('📈 Final Database Statistics:');
    console.log(`   Clients: ${remainingClients}`);
    console.log(`   Submissions: ${remainingSubmissions}\n`);

    console.log('🎉 Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
};

console.log('🧹 Database Cleanup Tool');
console.log('========================\n');

cleanDatabase();
