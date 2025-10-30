import mongoose from 'mongoose';
import crypto from 'crypto';

const documentLinkSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(32).toString('hex'),
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxUploads: {
      type: Number,
      default: 10, // Maximum number of documents that can be uploaded
    },
    uploadCount: {
      type: Number,
      default: 0,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notes: {
      type: String,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
documentLinkSchema.index({ token: 1 });
documentLinkSchema.index({ submission: 1 });
documentLinkSchema.index({ expiresAt: 1 });

// Method to check if link is valid
documentLinkSchema.methods.isValid = function () {
  return this.isActive && this.expiresAt > new Date() && this.uploadCount < this.maxUploads;
};

const DocumentLink = mongoose.model('DocumentLink', documentLinkSchema);

export default DocumentLink;
