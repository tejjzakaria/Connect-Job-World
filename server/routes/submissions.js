import express from 'express';
import Submission from '../models/Submission.js';
import Client from '../models/Client.js';
import { protect, authorize } from '../middleware/auth.js';
import { createNotification } from '../utils/notifications.js';
import whatsappService from '../services/whatsapp.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// @desc    Create new submission (Public - from contact form)
// @route   POST /api/submissions
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received submission request:', req.body);
    const { name, email, phone, service, message, source } = req.body;

    console.log('🔄 Attempting to create submission with service:', service);
    const submission = await Submission.create({
      name,
      email,
      phone,
      service,
      message,
      source: source || 'نموذج الموقع',
    });
    console.log('✅ Submission created successfully:', submission._id);

    // Create notification for new submission
    await createNotification({
      type: 'new_submission',
      title: 'طلب جديد',
      message: `طلب جديد من ${name} للخدمة: ${service}`,
      link: `/admin/submissions`,
      data: {
        submissionId: submission._id,
        name,
        service,
      },
    });

    // Send WhatsApp notification to client
    await whatsappService.notifyNewSubmission(submission);

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('❌ Submission creation error:', error);
    console.error('Error details:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Track submission status (Public - for clients to check their application)
// @route   POST /api/submissions/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const { phone, email } = req.body;

    if (!phone && !email) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني'
      });
    }

    // Build query to find submission by phone or email
    const query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;

    // Find the most recent submission matching the criteria
    const submission = await Submission.findOne(query)
      .sort({ createdAt: -1 })
      .select('name phone email service status workflowStatus timestamp createdAt message');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على طلب بهذه المعلومات'
      });
    }

    // Get document count if exists
    const Document = (await import('../models/Document.js')).default;
    const documentCount = await Document.countDocuments({ submission: submission._id });
    const verifiedDocuments = await Document.countDocuments({
      submission: submission._id,
      status: 'verified'
    });

    res.json({
      success: true,
      data: {
        ...submission.toObject(),
        documentStats: {
          total: documentCount,
          verified: verifiedDocuments
        }
      }
    });
  } catch (error) {
    console.error('Error tracking submission:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء البحث عن الطلب'
    });
  }
});

// Protected routes
router.use(protect);

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private (Admin, Agent)
router.get('/', authorize('admin', 'agent'), async (req, res) => {
  try {
    const { search, service, status, source, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Service filter
    if (service && service !== 'all') {
      query.service = service;
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Source filter
    if (source && source !== 'all') {
      query.source = source;
    }

    // Execute query with pagination
    const submissions = await Submission.find(query)
      .populate('reviewedBy', 'name email')
      .populate('validatedBy', 'name email')
      .populate('callConfirmedBy', 'name email')
      .populate('clientId', 'name')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const count = await Submission.countDocuments(query);

    res.json({
      success: true,
      data: submissions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private (Admin, Agent)
router.get('/:id', authorize('admin', 'agent'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('reviewedBy', 'name email')
      .populate('validatedBy', 'name email')
      .populate('callConfirmedBy', 'name email')
      .populate('clientId');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'submission_viewed',
      entityType: 'Submission',
      entityId: submission._id,
      details: { name: submission.name, service: submission.service },
      req,
    });

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update submission status
// @route   PUT /api/submissions/:id
// @access  Private (Admin, Agent)
router.put('/:id', authorize('admin', 'agent'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const { status } = req.body;

    submission.status = status || submission.status;
    submission.reviewedBy = req.user.id;
    submission.reviewedAt = Date.now();

    const updatedSubmission = await submission.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'submission_updated',
      entityType: 'Submission',
      entityId: updatedSubmission._id,
      details: { status, name: updatedSubmission.name },
      req,
    });

    res.json({
      success: true,
      data: updatedSubmission,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Log activity before deletion
    await logActivity({
      userId: req.user.id,
      action: 'submission_deleted',
      entityType: 'Submission',
      entityId: submission._id,
      details: { name: submission.name, email: submission.email },
      req,
    });

    await submission.deleteOne();

    res.json({
      success: true,
      message: 'Submission removed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Validate submission
// @route   POST /api/submissions/:id/validate
// @access  Private (Admin, Agent)
router.post('/:id/validate', authorize('admin', 'agent'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    submission.workflowStatus = 'validated';
    submission.validatedBy = req.user._id;
    submission.validatedAt = new Date();
    submission.status = 'viewed';
    await submission.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'submission_validated',
      entityType: 'Submission',
      entityId: submission._id,
      details: { name: submission.name, service: submission.service },
      req,
    });

    // Send WhatsApp notification
    await whatsappService.notifyStatusUpdate(submission, 'validated');

    res.json({
      success: true,
      message: 'تم التحقق من البيانات بنجاح',
      data: submission,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Confirm call
// @route   POST /api/submissions/:id/confirm-call
// @access  Private (Admin, Agent)
router.post('/:id/confirm-call', authorize('admin', 'agent'), async (req, res) => {
  try {
    const { callNotes } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
    }

    submission.workflowStatus = 'call_confirmed';
    submission.callConfirmedBy = req.user._id;
    submission.callConfirmedAt = new Date();
    submission.callNotes = callNotes;
    submission.status = 'contacted';
    await submission.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'submission_call_confirmed',
      entityType: 'Submission',
      entityId: submission._id,
      details: { name: submission.name, callNotes },
      req,
    });

    // Send WhatsApp notification
    await whatsappService.notifyStatusUpdate(submission, 'call_confirmed', callNotes);

    res.json({
      success: true,
      message: 'تم تأكيد المكالمة بنجاح',
      data: submission,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Convert submission to client
// @route   POST /api/submissions/:id/convert
// @access  Private (Admin only)
router.post('/:id/convert', authorize('admin'), async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.convertedToClient) {
      return res.status(400).json({ message: 'Submission already converted to client' });
    }

    // Check if documents are verified
    if (submission.workflowStatus !== 'documents_verified') {
      return res.status(400).json({
        success: false,
        message: 'يجب التحقق من جميع المستندات قبل التحويل إلى عميل'
      });
    }

    // Create client from submission
    const client = await Client.create({
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      service: submission.service,
      message: submission.message,
      status: 'new',
    });

    // Update submission
    submission.convertedToClient = true;
    submission.clientId = client._id;
    submission.status = 'completed';
    submission.workflowStatus = 'converted_to_client';
    await submission.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'submission_converted',
      entityType: 'Submission',
      entityId: submission._id,
      details: { name: submission.name, clientId: client._id },
      req,
    });

    // Create notification for client conversion
    await createNotification({
      type: 'converted_to_client',
      title: 'تم التحويل إلى عميل',
      message: `تم تحويل طلب ${submission.name} إلى عميل بنجاح`,
      link: `/admin/clients/${client._id}`,
      data: {
        submissionId: submission._id,
        clientId: client._id,
        name: submission.name,
      },
    });

    // Send WhatsApp welcome notification to new client
    await whatsappService.notifyWelcomeClient(client);

    res.status(201).json({
      success: true,
      data: {
        submission,
        client,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get submission statistics
// @route   GET /api/submissions/stats/overview
// @access  Private (Admin, Agent, Viewer)
router.get('/stats/overview', authorize('admin', 'agent', 'viewer'), async (req, res) => {
  try {
    const total = await Submission.countDocuments();
    const byStatus = await Submission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const bySource = await Submission.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);
    const byService = await Submission.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        bySource,
        byService,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
