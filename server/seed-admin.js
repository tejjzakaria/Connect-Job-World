import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@connectjobworld.com' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@connectjobworld.com');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@connectjobworld.com',
      password: 'Admin@123',
      role: 'admin',
      isActive: true,
    });

    console.log('Admin user created successfully!');
    console.log('----------------------------');
    console.log('Email: admin@connectjobworld.com');
    console.log('Password: Admin@123');
    console.log('----------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
