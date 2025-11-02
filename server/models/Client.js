import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
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
        // New service keys (language-independent)
        'us_lottery',
        'canada_immigration',
        'work_visa',
        'study_abroad',
        'family_reunion',
        'soccer_talent',
        // Old Arabic values for backward compatibility
        'القرعة الأمريكية',
        'الهجرة إلى كندا',
        'تأشيرة عمل',
        'الدراسة في الخارج',
        'لم شمل العائلة',
        'مواهب كرة القدم',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: [
        // New status keys (language-independent)
        'new',
        'in_review',
        'completed',
        'rejected',
        // Old Arabic values for backward compatibility
        'جديد',
        'قيد المراجعة',
        'مكتمل',
        'مرفوض'
      ],
      default: 'new',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: [
      {
        content: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
clientSchema.index({ name: 'text', email: 'text', phone: 'text' });
clientSchema.index({ service: 1, status: 1 });
clientSchema.index({ date: -1 });

const Client = mongoose.model('Client', clientSchema);

export default Client;
