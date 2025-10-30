import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        // User actions
        'user_login',
        'user_logout',
        'user_created',
        'user_updated',
        'user_deleted',
        'user_activated',
        'user_deactivated',
        'password_changed',
        'profile_updated',

        // Client actions
        'client_created',
        'client_updated',
        'client_deleted',
        'client_viewed',
        'client_note_added',

        // Submission actions
        'submission_created',
        'submission_updated',
        'submission_deleted',
        'submission_viewed',
        'submission_validated',
        'submission_call_confirmed',
        'submission_converted',

        // Document actions
        'document_uploaded',
        'document_verified',
        'document_rejected',
        'document_deleted',
        'document_link_generated',
        'document_link_deactivated',
      ],
    },
    entityType: {
      type: String,
      enum: ['User', 'Client', 'Submission', 'Document', 'DocumentLink', 'System'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
