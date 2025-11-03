import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    submission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission',
      required: true,
    },
    documentLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentLink',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    // S3-specific fields
    s3Key: {
      type: String,
      default: null,
    },
    s3Url: {
      type: String,
      default: null,
    },
    storageType: {
      type: String,
      enum: ['local', 's3'],
      default: 'local',
    },
    documentType: {
      type: String,
      enum: [
        'passport',
        'national_id',
        'birth_certificate',
        'diploma',
        'work_contract',
        'bank_statement',
        'proof_of_address',
        'marriage_certificate',
        'police_clearance',
        'medical_report',
        'other',
      ],
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'needs_replacement'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
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

// Indexes
documentSchema.index({ submission: 1 });
documentSchema.index({ documentLink: 1 });
documentSchema.index({ status: 1 });

const Document = mongoose.model('Document', documentSchema);

export default Document;
