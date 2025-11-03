import express from 'express';
import DocumentLink from '../models/DocumentLink.js';
import Document from '../models/Document.js';
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

// @desc    Generate document upload link for a submission
// @route   POST /api/documents/generate-link
// @access  Private (Admin, Agent)
router.post('/generate-link', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { submissionId, expiresInDays = 7, maxUploads = 10, notes } = req.body;

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    // Create document link
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    const documentLink = await DocumentLink.create({
      submission: submissionId,
      expiresAt,
      maxUploads,
      generatedBy: req.user._id,
      notes
    });

    // Update submission workflow status
    await Submission.findByIdAndUpdate(submissionId, {
      workflowStatus: 'documents_requested'
    });

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'document_link_generated',
      entityType: 'DocumentLink',
      entityId: documentLink._id,
      details: { submissionId, submissionName: submission.name, expiresInDays, maxUploads },
      req,
    });

    // Send WhatsApp notification to client about document request
    const uploadUrl = `${process.env.FRONTEND_URL || 'http://localhost:8083'}/upload/${documentLink.token}`;
    await whatsappService.sendMessage(
      submission.phone,
      `${submission.name} العزيز،\n\nيرجى تحميل المستندات المطلوبة لاستكمال طلبك.\n\nرابط التحميل:\n${uploadUrl}\n\n${notes ? 'ملاحظات: ' + notes + '\n\n' : ''}صلاحية الرابط: ${expiresInDays} أيام\nالحد الأقصى للتحميلات: ${maxUploads}\n\nConnect Job World 🌍`
    );

    res.status(201).json({
      success: true,
      data: documentLink,
      uploadUrl
    });
  } catch (error) {
    console.error('Error generating document link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all document links for a submission
// @route   GET /api/documents/links/:submissionId
// @access  Private (Admin, Agent)
router.get('/links/:submissionId', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const links = await DocumentLink.find({ submission: req.params.submissionId })
      .populate('generatedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: links });
  } catch (error) {
    console.error('Error fetching document links:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Validate document upload link (PUBLIC)
// @route   GET /api/documents/validate-link/:token
// @access  Public
router.get('/validate-link/:token', async (req, res) => {
  try {
    const documentLink = await DocumentLink.findOne({ token: req.params.token })
      .populate('submission', 'name phone email service');

    if (!documentLink) {
      return res.status(404).json({ success: false, message: 'الرابط غير صالح' });
    }

    if (!documentLink.isValid()) {
      let reason = 'الرابط غير صالح';
      if (!documentLink.isActive) {
        reason = 'تم إلغاء تفعيل هذا الرابط';
      } else if (documentLink.expiresAt < new Date()) {
        reason = 'انتهت صلاحية هذا الرابط';
      } else if (documentLink.uploadCount >= documentLink.maxUploads) {
        reason = 'تم الوصول إلى الحد الأقصى للتحميلات';
      }
      return res.status(400).json({ success: false, message: reason });
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        submission: documentLink.submission,
        uploadCount: documentLink.uploadCount,
        maxUploads: documentLink.maxUploads,
        expiresAt: documentLink.expiresAt
      }
    });
  } catch (error) {
    console.error('Error validating link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload document via secure link (PUBLIC)
// @route   POST /api/documents/upload/:token
// @access  Public
router.post('/upload/:token', upload.array('documents', 10), async (req, res) => {
  try {
    const { token } = req.params;
    const { documentTypes } = req.body; // Array of document types corresponding to each file

    // Find and validate the document link
    const documentLink = await DocumentLink.findOne({ token })
      .populate('submission', 'name');

    if (!documentLink) {
      // Delete uploaded files if link is invalid (only for local storage)
      if (!isS3Configured && req.files) {
        req.files.forEach(file => {
          if (file.path) fs.unlinkSync(file.path);
        });
      }
      return res.status(404).json({ success: false, message: 'الرابط غير صالح' });
    }

    if (!documentLink.isValid()) {
      // Delete uploaded files if link is invalid (only for local storage)
      if (!isS3Configured && req.files) {
        req.files.forEach(file => {
          if (file.path) fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({ success: false, message: 'الرابط غير صالح أو منتهي الصلاحية' });
    }

    // Check if upload count will exceed limit
    if (documentLink.uploadCount + req.files.length > documentLink.maxUploads) {
      // Delete uploaded files (only for local storage)
      if (!isS3Configured && req.files) {
        req.files.forEach(file => {
          if (file.path) fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({
        success: false,
        message: `لا يمكن رفع ${req.files.length} ملفات. المتبقي: ${documentLink.maxUploads - documentLink.uploadCount}`
      });
    }

    // Parse document types if it's a string
    let parsedDocumentTypes = [];
    if (typeof documentTypes === 'string') {
      try {
        parsedDocumentTypes = JSON.parse(documentTypes);
      } catch (e) {
        parsedDocumentTypes = [documentTypes];
      }
    } else if (Array.isArray(documentTypes)) {
      parsedDocumentTypes = documentTypes;
    }

    // Get user name for filename
    const userName = documentLink.submission?.name?.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'Unknown';

    // Create document records and upload files
    const documents = [];
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const docType = parsedDocumentTypes[i] || 'other';
      const fileExtension = path.extname(file.originalname);
      const timestamp = Date.now();

      // Create structured filename: UserName_DocumentType_Timestamp.ext
      const newFileName = `${userName}_${docType}_${timestamp}_${i}${fileExtension}`;

      let filePath, s3Key, s3Url;

      if (isS3Configured) {
        // Upload to S3
        try {
          // Use submission ID to organize files in S3
          const submissionId = documentLink.submission._id.toString();
          s3Key = `documents/${submissionId}/${newFileName}`;

          const s3Result = await uploadToS3(file.buffer, s3Key, file.mimetype);
          s3Url = s3Result.url;
          filePath = s3Key; // Store S3 key in filePath field for compatibility

          console.log(`✅ Uploaded to S3: ${s3Key}`);
        } catch (s3Error) {
          console.error('S3 upload error:', s3Error);
          throw new Error(`Failed to upload ${file.originalname} to S3: ${s3Error.message}`);
        }
      } else {
        // Local file storage
        const newFilePath = path.join(path.dirname(file.path), newFileName);

        // Rename the file from temp name to structured name
        try {
          fs.renameSync(file.path, newFilePath);
          filePath = newFilePath;
        } catch (renameError) {
          console.error('Error renaming file:', renameError);
          // If rename fails, keep the original temp name
          filePath = file.path;
        }
      }

      const document = await Document.create({
        submission: documentLink.submission._id,
        documentLink: documentLink._id,
        fileName: newFileName,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        filePath: filePath, // S3 key or local path
        s3Key: s3Key || null, // Store S3 key separately for clarity
        s3Url: s3Url || null,
        documentType: docType,
        status: 'pending',
        storageType: isS3Configured ? 's3' : 'local', // Track storage type
      });
      documents.push(document);
    }

    // Update document link
    documentLink.uploadCount += req.files.length;
    documentLink.lastUsedAt = new Date();
    await documentLink.save();

    // Update submission workflow status
    await Submission.findByIdAndUpdate(documentLink.submission._id, {
      workflowStatus: 'documents_uploaded'
    });

    // Create notification for document upload
    await createNotification({
      type: 'documents_uploaded',
      title: 'تم رفع مستندات جديدة',
      message: `تم رفع ${req.files.length} مستند جديد من ${documentLink.submission.name}`,
      link: `/admin/submissions/${documentLink.submission._id}`,
      data: {
        submissionId: documentLink.submission._id,
        documentCount: req.files.length,
        name: documentLink.submission.name,
      },
    });

    res.status(201).json({
      success: true,
      message: `تم رفع ${req.files.length} ملف بنجاح`,
      data: documents
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    // Clean up uploaded files on error (only for local storage)
    if (!isS3Configured && req.files) {
      req.files.forEach(file => {
        try {
          if (file.path) fs.unlinkSync(file.path);
        } catch (e) {
          console.error('Error deleting file:', e);
        }
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all documents for a submission
// @route   GET /api/documents/submission/:submissionId
// @access  Private (Admin, Agent)
router.get('/submission/:submissionId', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const documents = await Document.find({ submission: req.params.submissionId })
      .populate('documentLink', 'token createdAt')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single document by ID
// @route   GET /api/documents/:id
// @access  Private (Admin, Agent)
router.get('/:id', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('submission', 'name phone email')
      .populate('verifiedBy', 'name email');

    if (!document) {
      return res.status(404).json({ success: false, message: 'المستند غير موجود' });
    }

    res.json({ success: true, data: document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Preview document file (view in browser)
// @route   GET /api/documents/:id/preview
// @access  Private (Admin, Agent)
router.get('/:id/preview', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'المستند غير موجود' });
    }

    console.log('📄 Previewing document:', document.fileName);
    console.log('   Storage type:', document.storageType || 'undefined');
    console.log('   S3 Key:', document.s3Key || 'none');
    console.log('   File path:', document.filePath);

    // Handle S3 files
    if (document.storageType === 's3' || document.s3Key) {
      try {
        console.log('   → Generating presigned URL for S3...');
        const presignedUrl = await getPresignedUrl(document.s3Key || document.filePath, 3600); // 1 hour
        console.log('   ✅ Presigned URL generated');

        // For S3 files, return a JSON response with the presigned URL
        // This avoids CORS issues when the frontend tries to fetch
        return res.json({
          success: true,
          storageType: 's3',
          url: presignedUrl,
          fileName: document.fileName,
          fileType: document.fileType
        });
      } catch (s3Error) {
        console.error('   ❌ Error generating presigned URL:', s3Error.message);
        return res.status(500).json({ success: false, message: 'فشل في إنشاء رابط الملف' });
      }
    }

    // Handle local files
    console.log('   → Checking local file...');
    if (!fs.existsSync(document.filePath)) {
      console.error('   ❌ Local file not found at:', document.filePath);
      return res.status(404).json({ success: false, message: 'الملف غير موجود على الخادم' });
    }

    console.log('   ✅ Local file found, sending...');
    // Set content type based on file type
    res.setHeader('Content-Type', document.fileType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(document.fileName)}"`);

    // Send the file
    res.sendFile(path.resolve(document.filePath));
  } catch (error) {
    console.error('❌ Error previewing document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Download document file
// @route   GET /api/documents/:id/download
// @access  Private (Admin, Agent)
router.get('/:id/download', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'المستند غير موجود' });
    }

    console.log('📥 Downloading document:', document.fileName);

    // Handle S3 files
    if (document.storageType === 's3' || document.s3Key) {
      try {
        console.log('   → Generating presigned URL for S3 download...');
        const presignedUrl = await getPresignedUrl(document.s3Key || document.filePath, 3600); // 1 hour
        console.log('   ✅ Redirecting to S3...');
        // Redirect directly - browser will handle the download
        return res.redirect(presignedUrl);
      } catch (s3Error) {
        console.error('   ❌ Error generating presigned URL:', s3Error);
        return res.status(500).json({ success: false, message: 'فشل في إنشاء رابط الملف' });
      }
    }

    // Handle local files
    console.log('   → Serving local file...');
    if (!fs.existsSync(document.filePath)) {
      console.error('   ❌ Local file not found');
      return res.status(404).json({ success: false, message: 'الملف غير موجود على الخادم' });
    }

    console.log('   ✅ Sending file...');
    res.download(document.filePath, document.fileName);
  } catch (error) {
    console.error('❌ Error downloading document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify or reject document
// @route   PATCH /api/documents/:id/verify
// @access  Private (Admin, Agent)
router.patch('/:id/verify', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const { status, rejectionReason, notes } = req.body;

    if (!['verified', 'rejected', 'needs_replacement'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'حالة غير صالحة. يجب أن تكون: verified, rejected, أو needs_replacement'
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'المستند غير موجود' });
    }

    // Update document
    document.status = status;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();
    if (rejectionReason) document.rejectionReason = rejectionReason;
    if (notes) document.notes = notes;
    await document.save();

    // Get submission for WhatsApp notification
    const submission = await Submission.findById(document.submission);

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: status === 'verified' ? 'document_verified' : 'document_rejected',
      entityType: 'Document',
      entityId: document._id,
      details: {
        submissionId: document.submission,
        submissionName: submission?.name,
        fileName: document.fileName,
        status,
        rejectionReason
      },
      req,
    });

    // Send WhatsApp notification for single document verification
    if (status === 'verified') {
      await whatsappService.notifyDocumentVerified(submission, document.originalName);
    }

    // Check if all documents for this submission are verified
    const allDocuments = await Document.find({ submission: document.submission });
    const allVerified = allDocuments.every(doc => doc.status === 'verified');

    console.log(`📋 Document verification check for submission ${document.submission}:`);
    console.log(`   Total documents: ${allDocuments.length}`);
    console.log(`   All verified: ${allVerified}`);
    console.log(`   Document statuses:`, allDocuments.map(d => ({ file: d.fileName, status: d.status })));

    // Update submission workflow status if all documents are verified
    if (allVerified && allDocuments.length > 0) {
      console.log(`   ✅ Setting workflowStatus to 'documents_verified'`);
      await Submission.findByIdAndUpdate(
        document.submission,
        { workflowStatus: 'documents_verified' },
        { new: true }
      );

      // Create notification for all documents verified
      await createNotification({
        type: 'documents_verified',
        title: 'تم التحقق من جميع المستندات',
        message: `تم التحقق من جميع المستندات الخاصة ب ${submission.name}`,
        link: `/admin/submissions/${submission._id}`,
        data: {
          submissionId: submission._id,
          name: submission.name,
          documentCount: allDocuments.length,
        },
      });

      // Send WhatsApp notification for all documents verified
      await whatsappService.notifyStatusUpdate(submission, 'documents_verified');
    }

    res.json({
      success: true,
      message: status === 'verified' ? 'تم التحقق من المستند' : 'تم رفض المستند',
      data: document
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: 'المستند غير موجود' });
    }

    // Log activity before deletion
    await logActivity({
      userId: req.user.id,
      action: 'document_deleted',
      entityType: 'Document',
      entityId: document._id,
      details: {
        submissionId: document.submission,
        fileName: document.fileName,
        originalName: document.originalName
      },
      req,
    });

    // Delete file from storage
    if (document.storageType === 's3' || document.s3Key) {
      // Delete from S3
      try {
        await deleteFromS3(document.s3Key || document.filePath);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
        // Continue with document deletion even if S3 deletion fails
      }
    } else {
      // Delete from local filesystem
      if (fs.existsSync(document.filePath)) {
        fs.unlinkSync(document.filePath);
      }
    }

    // Delete document record
    await Document.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'تم حذف المستند' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Deactivate document link
// @route   PATCH /api/documents/links/:id/deactivate
// @access  Private (Admin, Agent)
router.patch('/links/:id/deactivate', protect, authorize('admin', 'agent'), async (req, res) => {
  try {
    const documentLink = await DocumentLink.findById(req.params.id);

    if (!documentLink) {
      return res.status(404).json({ success: false, message: 'الرابط غير موجود' });
    }

    documentLink.isActive = false;
    await documentLink.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'document_link_deactivated',
      entityType: 'DocumentLink',
      entityId: documentLink._id,
      details: { submissionId: documentLink.submission },
      req,
    });

    res.json({ success: true, message: 'تم إلغاء تفعيل الرابط', data: documentLink });
  } catch (error) {
    console.error('Error deactivating link:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
