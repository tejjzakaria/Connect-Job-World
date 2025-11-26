import express from 'express';
import PaymentLink from '../models/PaymentLink.js';
import Submission from '../models/Submission.js';
import upload, { isS3Configured } from '../config/multer.js';
import { protect, authorize } from '../middleware/auth.js';
import { createNotification } from '../utils/notifications.js';
import whatsappService from '../services/whatsapp.js';
import { logActivity } from '../utils/activityLogger.js';
import { uploadToS3, getPresignedUrl, deleteFromS3 } from '../services/s3.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Generate payment link for a submission
// @route   POST /api/payments/generate-link
// @access  Private (Admin, Agent)
router.post('/generate-link', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { submissionId, amount, currency = 'MAD', expiresInDays = 7, notes, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'المبلغ مطلوب ويجب أن يكون أكبر من صفر' });
    }

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    // Create payment link
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const paymentLinkData = {
      submission: submissionId,
      amount,
      currency,
      expiresAt,
      generatedBy: req.user._id,
      notes
    };

    // Add custom bank details if provided
    if (bankDetails) {
      paymentLinkData.bankDetails = bankDetails;
    }

    const paymentLink = await PaymentLink.create(paymentLinkData);

    // Update submission workflow status
    await Submission.findByIdAndUpdate(submissionId, {
      workflowStatus: 'payment_requested'
    });

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'payment_link_generated',
      entityType: 'PaymentLink',
      entityId: paymentLink._id,
      details: { submissionId, submissionName: submission.name, amount, currency, expiresInDays },
      req,
    });

    // Send WhatsApp notification to client about payment request
    const paymentUrl = `${process.env.FRONTEND_URL || 'http://localhost:8083'}/payment/${paymentLink.token}`;
    await whatsappService.sendMessage(
      submission.phone,
      `${submission.name} العزيز،\n\nيرجى إتمام عملية الدفع لاستكمال طلبك.\n\nالمبلغ المطلوب: ${amount} ${currency}\n\nرابط الدفع:\n${paymentUrl}\n\n${notes ? 'ملاحظات: ' + notes + '\n\n' : ''}صلاحية الرابط: ${expiresInDays} أيام\n\nConnect Job World 🌍`
    );

    res.status(201).json({
      success: true,
      data: paymentLink,
      paymentUrl
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all payment links for a submission
// @route   GET /api/payments/links/:submissionId
// @access  Private (Admin, Agent)
router.get('/links/:submissionId', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const links = await PaymentLink.find({ submission: req.params.submissionId })
      .populate('generatedBy', 'name email')
      .populate('confirmedBy', 'name email')
      .populate('rejectedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: links });
  } catch (error) {
    console.error('Error fetching payment links:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Validate payment link (PUBLIC)
// @route   GET /api/payments/validate-link/:token
// @access  Public
router.get('/validate-link/:token', async (req, res) => {
  try {
    const paymentLink = await PaymentLink.findOne({ token: req.params.token })
      .populate('submission', 'name phone email service');

    if (!paymentLink) {
      return res.status(404).json({ success: false, message: 'الرابط غير صالح' });
    }

    if (!paymentLink.isActive) {
      return res.status(400).json({ success: false, message: 'تم إلغاء تفعيل هذا الرابط' });
    }

    if (paymentLink.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'انتهت صلاحية هذا الرابط' });
    }

    if (paymentLink.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'تم تأكيد هذا الدفع بالفعل' });
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        submission: paymentLink.submission,
        amount: paymentLink.amount,
        currency: paymentLink.currency,
        bankDetails: paymentLink.bankDetails,
        status: paymentLink.status,
        expiresAt: paymentLink.expiresAt,
        notes: paymentLink.notes,
        hasReceipt: !!paymentLink.receiptFile?.fileName
      }
    });
  } catch (error) {
    console.error('Error validating link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload payment receipt via secure link (PUBLIC)
// @route   POST /api/payments/upload-receipt/:token
// @access  Public
router.post('/upload-receipt/:token', upload.single('receipt'), async (req, res) => {
  try {
    const { token } = req.params;

    // Find and validate the payment link
    const paymentLink = await PaymentLink.findOne({ token })
      .populate('submission', 'name');

    if (!paymentLink) {
      // Delete uploaded file if link is invalid (only for local storage)
      if (!isS3Configured && req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: 'الرابط غير صالح' });
    }

    if (!paymentLink.isActive || paymentLink.expiresAt < new Date()) {
      // Delete uploaded file if link is invalid (only for local storage)
      if (!isS3Configured && req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'الرابط غير صالح أو منتهي الصلاحية' });
    }

    if (paymentLink.status === 'confirmed') {
      if (!isS3Configured && req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ success: false, message: 'تم تأكيد هذا الدفع بالفعل' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'يرجى رفع إيصال الدفع' });
    }

    // Get user name for filename
    const userName = paymentLink.submission?.name?.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Unknown';
    const fileExtension = path.extname(req.file.originalname);
    const timestamp = Date.now();
    const newFileName = `${userName}_payment_receipt_${timestamp}${fileExtension}`;

    let filePath, s3Key, s3Url;

    if (isS3Configured) {
      // Upload to S3
      try {
        const submissionId = paymentLink.submission._id.toString();
        s3Key = `payments/${submissionId}/${newFileName}`;

        const s3Result = await uploadToS3(req.file.buffer, s3Key, req.file.mimetype);
        s3Url = s3Result.url;
        filePath = s3Key;

        console.log(`✅ Uploaded receipt to S3: ${s3Key}`);
      } catch (s3Error) {
        console.error('S3 upload error:', s3Error);
        throw new Error(`Failed to upload receipt to S3: ${s3Error.message}`);
      }
    } else {
      // Local file storage
      const uploadsDir = path.join(__dirname, '../../uploads/payments');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const newFilePath = path.join(uploadsDir, newFileName);

      try {
        fs.renameSync(req.file.path, newFilePath);
        filePath = newFilePath;
      } catch (renameError) {
        console.error('Error renaming file:', renameError);
        filePath = req.file.path;
      }
    }

    // Update payment link with receipt info
    paymentLink.receiptFile = {
      fileName: newFileName,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      filePath: filePath,
      s3Key: s3Key || null,
      s3Url: s3Url || null,
      storageType: isS3Configured ? 's3' : 'local',
      uploadedAt: new Date()
    };
    paymentLink.status = 'receipt_uploaded';
    await paymentLink.save();

    // Update submission workflow status
    await Submission.findByIdAndUpdate(paymentLink.submission._id, {
      workflowStatus: 'payment_uploaded'
    });

    // Create notification for admin
    await createNotification({
      type: 'payment_receipt_uploaded',
      title: 'تم رفع إيصال دفع جديد',
      message: `تم رفع إيصال دفع من ${paymentLink.submission.name}`,
      link: `/admin/submissions/${paymentLink.submission._id}`,
      data: {
        submissionId: paymentLink.submission._id,
        name: paymentLink.submission.name,
        amount: paymentLink.amount,
        currency: paymentLink.currency
      },
    });

    res.status(201).json({
      success: true,
      message: 'تم رفع إيصال الدفع بنجاح',
      data: {
        fileName: newFileName,
        status: 'receipt_uploaded'
      }
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    // Clean up uploaded file on error (only for local storage)
    if (!isS3Configured && req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.error('Error deleting file:', e);
      }
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Preview payment receipt
// @route   GET /api/payments/:id/preview-receipt
// @access  Private (Admin, Agent)
router.get('/:id/preview-receipt', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const paymentLink = await PaymentLink.findById(req.params.id);

    if (!paymentLink) {
      return res.status(404).json({ success: false, message: 'رابط الدفع غير موجود' });
    }

    if (!paymentLink.receiptFile?.fileName) {
      return res.status(404).json({ success: false, message: 'لم يتم رفع إيصال بعد' });
    }

    const receipt = paymentLink.receiptFile;

    // Handle S3 files
    if (receipt.storageType === 's3' || receipt.s3Key) {
      try {
        const presignedUrl = await getPresignedUrl(receipt.s3Key || receipt.filePath, 3600);
        return res.json({
          success: true,
          storageType: 's3',
          url: presignedUrl,
          fileName: receipt.fileName,
          fileType: receipt.fileType
        });
      } catch (s3Error) {
        console.error('Error generating presigned URL:', s3Error);
        return res.status(500).json({ success: false, message: 'فشل في إنشاء رابط الملف' });
      }
    }

    // Handle local files
    if (!fs.existsSync(receipt.filePath)) {
      return res.status(404).json({ success: false, message: 'الملف غير موجود على الخادم' });
    }

    res.setHeader('Content-Type', receipt.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(receipt.fileName)}"`);
    res.sendFile(path.resolve(receipt.filePath));
  } catch (error) {
    console.error('Error previewing receipt:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Confirm or reject payment
// @route   PATCH /api/payments/:id/verify
// @access  Private (Admin, Agent)
router.patch('/:id/verify', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صالحة. يجب أن تكون: confirmed أو rejected'
      });
    }

    const paymentLink = await PaymentLink.findById(req.params.id)
      .populate('submission', 'name phone');

    if (!paymentLink) {
      return res.status(404).json({ success: false, message: 'رابط الدفع غير موجود' });
    }

    if (paymentLink.status === 'confirmed') {
      return res.status(400).json({ success: false, message: 'تم تأكيد هذا الدفع بالفعل' });
    }

    // Update payment link
    paymentLink.status = status;
    if (status === 'confirmed') {
      paymentLink.confirmedBy = req.user._id;
      paymentLink.confirmedAt = new Date();
    } else {
      paymentLink.rejectedBy = req.user._id;
      paymentLink.rejectedAt = new Date();
      paymentLink.rejectionReason = rejectionReason;
    }
    await paymentLink.save();

    // Update submission workflow status
    if (status === 'confirmed') {
      await Submission.findByIdAndUpdate(paymentLink.submission._id, {
        workflowStatus: 'payment_confirmed'
      });
    }

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: status === 'confirmed' ? 'payment_confirmed' : 'payment_rejected',
      entityType: 'PaymentLink',
      entityId: paymentLink._id,
      details: {
        submissionId: paymentLink.submission._id,
        submissionName: paymentLink.submission.name,
        amount: paymentLink.amount,
        currency: paymentLink.currency,
        status,
        rejectionReason
      },
      req,
    });

    // Send WhatsApp notification
    if (status === 'confirmed') {
      await whatsappService.sendMessage(
        paymentLink.submission.phone,
        `${paymentLink.submission.name} العزيز،\n\nتم تأكيد استلام الدفع الخاص بك بنجاح.\n\nالمبلغ: ${paymentLink.amount} ${paymentLink.currency}\n\nشكراً لك!\n\nConnect Job World 🌍`
      );
    } else {
      await whatsappService.sendMessage(
        paymentLink.submission.phone,
        `${paymentLink.submission.name} العزيز،\n\nنعتذر، لم نتمكن من التحقق من إيصال الدفع الخاص بك.\n\n${rejectionReason ? 'السبب: ' + rejectionReason + '\n\n' : ''}يرجى التواصل معنا أو إعادة رفع الإيصال.\n\nConnect Job World 🌍`
      );
    }

    res.json({
      success: true,
      message: status === 'confirmed' ? 'تم تأكيد الدفع بنجاح' : 'تم رفض الدفع',
      data: paymentLink
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Deactivate payment link
// @route   PATCH /api/payments/links/:id/deactivate
// @access  Private (Admin, Agent)
router.patch('/links/:id/deactivate', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const paymentLink = await PaymentLink.findById(req.params.id);

    if (!paymentLink) {
      return res.status(404).json({ success: false, message: 'الرابط غير موجود' });
    }

    paymentLink.isActive = false;
    await paymentLink.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'payment_link_deactivated',
      entityType: 'PaymentLink',
      entityId: paymentLink._id,
      details: { submissionId: paymentLink.submission },
      req,
    });

    res.json({ success: true, message: 'تم إلغاء تفعيل الرابط', data: paymentLink });
  } catch (error) {
    console.error('Error deactivating link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
