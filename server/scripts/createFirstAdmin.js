import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import readline from 'readline';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createFirstAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI_STAGING);
    console.log('✅ Connected to MongoDB');

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ An admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);

      const confirm = await question('\nDo you want to create another admin? (yes/no): ');
      if (confirm.toLowerCase() !== 'yes') {
        console.log('❌ Aborted.');
        process.exit(0);
      }
    }

    console.log('\n📝 Create First Admin User\n');

    // Get admin details
    const name = await question('Admin Name: ');
    const email = await question('Admin Email: ');
    const password = await question('Admin Password: ');

    // Validate inputs
    if (!name || !email || !password) {
      console.log('❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Check if user with email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('❌ User with this email already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n🔐 You can now login with these credentials');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

createFirstAdmin();
