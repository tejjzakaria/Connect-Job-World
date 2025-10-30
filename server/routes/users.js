import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Get all users/employees
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const { search, role, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Role filter
    if (role && role !== 'all') {
      query.role = role;
    }

    // Status filter (active/inactive)
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new user/employee
// @route   POST /api/users
// @access  Private (Admin only)
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى ملء جميع الحقول المطلوبة',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل',
      });
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
      userId: req.user.id,
      action: 'user_created',
      entityType: 'User',
      entityId: user._id,
      details: { name: user.name, email: user.email, role: user.role },
      req,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      message: 'تم إنشاء الموظف بنجاح',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin, or self)
router.get('/:id', async (req, res) => {
  try {
    // Check if user is viewing their own profile or is admin
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بعرض هذا الموظف',
      });
    }

    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود',
      });
    }

    const { name, email, role, isActive } = req.body;

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل',
        });
      }
      user.email = email;
    }
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    const updatedUser = await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'user_updated',
      entityType: 'User',
      entityId: updatedUser._id,
      details: { name, email, role, isActive },
      req,
    });

    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
      message: 'تم تحديث الموظف بنجاح',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Deactivate user
// @route   PATCH /api/users/:id/deactivate
// @access  Private (Admin only)
router.patch('/:id/deactivate', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك إلغاء تفعيل حسابك الخاص',
      });
    }

    user.isActive = false;
    await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'user_deactivated',
      entityType: 'User',
      entityId: user._id,
      details: { name: user.name, email: user.email },
      req,
    });

    res.json({
      success: true,
      message: 'تم إلغاء تفعيل الموظف بنجاح',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Activate user
// @route   PATCH /api/users/:id/activate
// @access  Private (Admin only)
router.patch('/:id/activate', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود',
      });
    }

    user.isActive = true;
    await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'user_activated',
      entityType: 'User',
      entityId: user._id,
      details: { name: user.name, email: user.email },
      req,
    });

    res.json({
      success: true,
      message: 'تم تفعيل الموظف بنجاح',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete user (permanent)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'الموظف غير موجود',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكنك حذف حسابك الخاص',
      });
    }

    // Log activity before deletion
    await logActivity({
      userId: req.user.id,
      action: 'user_deleted',
      entityType: 'User',
      entityId: user._id,
      details: { name: user.name, email: user.email },
      req,
    });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الموظف بنجاح',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user profile
// @route   GET /api/users/me/profile
// @access  Private (All authenticated users)
router.get('/me/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update own profile
// @route   PUT /api/users/me/profile
// @access  Private (All authenticated users)
router.put('/me/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    const { name, email } = req.body;

    // Update name
    if (name) user.name = name;

    // Update email (check if not taken)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'البريد الإلكتروني مستخدم بالفعل',
        });
      }
      user.email = email;
    }

    const updatedUser = await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'profile_updated',
      entityType: 'User',
      entityId: updatedUser._id,
      details: { name, email },
      req,
    });

    res.json({
      success: true,
      data: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      message: 'تم تحديث الملف الشخصي بنجاح',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Change own password
// @route   PUT /api/users/me/password
// @access  Private (All authenticated users)
router.put('/me/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة المرور الحالية والجديدة',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل',
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود',
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة',
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'password_changed',
      entityType: 'User',
      entityId: user._id,
      req,
    });

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Get user statistics (for dashboard)
// @route   GET /api/users/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', authorize('admin'), async (req, res) => {
  try {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ isActive: true });
    const inactive = await User.countDocuments({ isActive: false });

    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      data: {
        total,
        active,
        inactive,
        byRole,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
