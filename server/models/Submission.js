import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service is required'],
      enum: [
        'القرعة الأمريكية',
        'الهجرة إلى كندا',
        'تأشيرة عمل',
        'الدراسة في الخارج',
        'لم شمل العائلة',
        'مواهب كرة القدم',
      ],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['جديد', 'تمت المعاينة', 'تم التواصل', 'مكتمل'],
      default: 'جديد',
    },
    source: {
      type: String,
      enum: ['نموذج الموقع', 'واتساب', 'مكالمة هاتفية', 'بريد إلكتروني'],
      default: 'نموذج الموقع',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    convertedToClient: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    // Workflow fields
    workflowStatus: {
      type: String,
      enum: ['pending_validation', 'validated', 'call_confirmed', 'documents_requested', 'documents_uploaded', 'documents_verified', 'converted_to_client'],
      default: 'pending_validation',
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    validatedAt: {
      type: Date,
    },
    callConfirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    callConfirmedAt: {
      type: Date,
    },
    callNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
submissionSchema.index({ name: 'text', email: 'text', phone: 'text', message: 'text' });
submissionSchema.index({ service: 1, status: 1, source: 1 });
submissionSchema.index({ timestamp: -1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;
