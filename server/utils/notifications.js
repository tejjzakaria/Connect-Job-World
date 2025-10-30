import Notification from '../models/Notification.js';
import User from '../models/User.js';

/**
 * Create a notification for all admin users
 * @param {Object} options - Notification options
 * @param {string} options.type - Notification type
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {string} options.link - Optional link to navigate to
 * @param {Object} options.data - Optional additional data
 */
export const createNotification = async (options) => {
  try {
    const { type, title, message, link, data } = options;

    // Get all admin users
    const admins = await User.find({ role: 'admin' });

    // Create notifications for all admins
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      type,
      title,
      message,
      link,
      data,
    }));

    await Notification.insertMany(notifications);

    console.log(`Created ${notifications.length} notifications of type: ${type}`);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

/**
 * Create a notification for a specific user
 * @param {string} userId - User ID
 * @param {Object} options - Notification options
 */
export const createUserNotification = async (userId, options) => {
  try {
    const { type, title, message, link, data } = options;

    await Notification.create({
      recipient: userId,
      type,
      title,
      message,
      link,
      data,
    });

    console.log(`Created notification for user ${userId} of type: ${type}`);
  } catch (error) {
    console.error('Error creating user notification:', error);
  }
};
