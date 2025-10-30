import ActivityLog from '../models/ActivityLog.js';

/**
 * Log an activity
 * @param {Object} options - Logging options
 * @param {string} options.userId - User ID who performed the action
 * @param {string} options.action - Action performed (from ActivityLog enum)
 * @param {string} options.entityType - Type of entity affected
 * @param {string} options.entityId - ID of the entity affected
 * @param {Object} options.details - Additional details about the action
 * @param {Object} options.req - Express request object (optional, for IP and user agent)
 */
export const logActivity = async ({
  userId,
  action,
  entityType = 'System',
  entityId = null,
  details = {},
  req = null,
}) => {
  try {
    const logData = {
      user: userId,
      action,
      entityType,
      entityId,
      details,
    };

    // Extract IP and user agent from request if provided
    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress;
      logData.userAgent = req.get('user-agent');
    }

    await ActivityLog.create(logData);
  } catch (error) {
    // Don't throw error to avoid breaking the main flow
    console.error('Error logging activity:', error.message);
  }
};

/**
 * Get activity logs with filters and pagination
 */
export const getActivityLogs = async ({
  userId = null,
  action = null,
  entityType = null,
  startDate = null,
  endDate = null,
  page = 1,
  limit = 20,
}) => {
  const query = {};

  if (userId) query.user = userId;
  if (action) query.action = action;
  if (entityType) query.entityType = entityType;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const logs = await ActivityLog.find(query)
    .populate('user', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

  const total = await ActivityLog.countDocuments(query);

  return {
    logs,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export default {
  logActivity,
  getActivityLogs,
};
