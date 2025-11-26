import mongoose from 'mongoose';
import crypto from 'crypto';

const paymentLinkSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
    },
    currency: {
      type: String,
      default: 'MAD', // Moroccan Dirham
    },
    bankDetails: {
      bankName: {
        type: String,
        default: 'Attijariwafa Bank',
      },
      accountName: {
        type: String,
        default: 'Connect Job World',
      },
      accountNumber: {
        type: String,
        default: '007 810 0002 5810 0000 1234 56',
      },
      rib: {
        type: String,
        default: '007 810 0002581000001234 56',
      },
      swift: {
        type: String,
        default: 'BCMAMAMC',
      },
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
    status: {
      type: String,
      enum: ['pending', 'receipt_uploaded', 'confirmed', 'rejected'],
      default: 'pending',
    },
    receiptFile: {
      fileName: String,
      originalName: String,
      fileType: String,
      fileSize: Number,
      filePath: String,
      s3Key: String,
      s3Url: String,
      storageType: {
        type: String,
        enum: ['local', 's3'],
      },
      uploadedAt: Date,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    confirmedAt: {
      type: Date,
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster lookups
paymentLinkSchema.index({ submission: 1 });
paymentLinkSchema.index({ expiresAt: 1 });
paymentLinkSchema.index({ status: 1 });

// Method to check if link is valid
paymentLinkSchema.methods.isValid = function () {
  return this.isActive && this.expiresAt > new Date() && this.status === 'pending';
};

const PaymentLink = mongoose.model('PaymentLink', paymentLinkSchema);

export default PaymentLink;
