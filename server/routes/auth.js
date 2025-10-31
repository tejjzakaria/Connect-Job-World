import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// @desc    Register a new user (admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'viewer',
    });

    // Log activity
    await logActivity({
      userId: user._id,
      action: 'user_created',
      entityType: 'User',
      entityId: user._id,
      details: { name: user.name, email: user.email, role: user.role },
      req,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Login attempt from IP: ${req.ip}, Email: ${email}`);

    // Validate input
    if (!email || !password) {
      console.warn(`⚠️ Missing credentials from IP: ${req.ip}`);
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.warn(`⚠️ User not found: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`⚠️ Invalid password for: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      console.warn(`⚠️ Inactive account attempted login: ${email} from IP: ${req.ip}`);
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      action: 'user_login',
      entityType: 'User',
      entityId: user._id,
      details: { email: user.email },
      req,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    console.log(`✅ Successful login: ${email} from IP: ${req.ip}`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(`❌ Login error for ${req.body.email} from IP: ${req.ip}`, error);
    res.status(500).json({
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
  // Log activity
  await logActivity({
    userId: req.user.id,
    action: 'user_logout',
    entityType: 'User',
    entityId: req.user.id,
    req,
  });

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
