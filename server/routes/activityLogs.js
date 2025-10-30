import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getActivityLogs } from '../utils/activityLogger.js';

const router = express.Router();

// Apply protection and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const {
      userId,
      action,
      entityType,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getActivityLogs({
      userId,
      action,
      entityType,
      startDate,
      endDate,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: result.logs,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get activity logs for a specific user
// @route   GET /api/activity-logs/user/:userId
// @access  Private (Admin only)
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const result = await getActivityLogs({
      userId: req.params.userId,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: result.logs,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get activity logs for a specific entity
// @route   GET /api/activity-logs/entity/:entityType/:entityId
// @access  Private (Admin only)
router.get('/entity/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await getActivityLogs({
      entityType,
      entityId,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json({
      success: true,
      data: result.logs,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      total: result.total,
    });
  } catch (error) {
    console.error('Error fetching entity activity logs:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Get activity statistics
// @route   GET /api/activity-logs/stats
// @access  Private (Admin only)
router.get('/stats/overview', async (req, res) => {
  try {
    const ActivityLog = (await import('../models/ActivityLog.js')).default;

    // Get total activities
    const total = await ActivityLog.countDocuments();

    // Get activities by action
    const byAction = await ActivityLog.aggregate([
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get activities by user (top 10 most active users)
    const byUser = await ActivityLog.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $unwind: '$userInfo',
      },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$userInfo.name',
          email: '$userInfo.email',
        },
      },
    ]);

    // Get activities in last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const last24Hours = await ActivityLog.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    // Get activities in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const last7Days = await ActivityLog.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      success: true,
      data: {
        total,
        last24Hours,
        last7Days,
        byAction,
        byUser,
      },
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
