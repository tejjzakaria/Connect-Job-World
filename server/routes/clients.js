import express from 'express';
import Client from '../models/Client.js';
import { protect, authorize } from '../middleware/auth.js';
import { logActivity } from '../utils/activityLogger.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin, Agent - agents see only assigned clients)
router.get('/', authorize('admin', 'agent'), async (req, res) => {
  try {
    const { search, service, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    // Role-based filtering: agents only see their assigned clients
    if (req.user.role === 'agent') {
      query.assignedTo = req.user.id;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
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

    // Execute query with pagination
    const clients = await Client.find(query)
      .populate('assignedTo', 'name email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const count = await Client.countDocuments(query);

    res.json({
      success: true,
      data: clients,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private (Admin, Agent - agents can only view assigned clients)
router.get('/:id', authorize('admin', 'agent'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Role-based access: agents can only view their assigned clients
    if (req.user.role === 'agent' && client.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بعرض هذا العميل' });
    }

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'client_viewed',
      entityType: 'Client',
      entityId: client._id,
      details: { name: client.name },
      req,
    });

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (Admin, Agent)
router.post('/', authorize('admin', 'agent'), async (req, res) => {
  try {
    const { name, email, phone, service, status, message } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      service,
      status: status || 'جديد',
      message,
    });

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'client_created',
      entityType: 'Client',
      entityId: client._id,
      details: { name: client.name, email: client.email, service: client.service },
      req,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin, Agent - agents can only update assigned clients)
router.put('/:id', authorize('admin', 'agent'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Role-based access: agents can only update their assigned clients
    if (req.user.role === 'agent' && client.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بتعديل هذا العميل' });
    }

    const { name, email, phone, service, status, message, assignedTo } = req.body;

    client.name = name || client.name;
    client.email = email !== undefined ? email : client.email;
    client.phone = phone || client.phone;
    client.service = service || client.service;
    client.status = status || client.status;
    client.message = message || client.message;

    // Only admins can reassign clients
    if (req.user.role === 'admin' && assignedTo !== undefined) {
      client.assignedTo = assignedTo;
    }

    const updatedClient = await client.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'client_updated',
      entityType: 'Client',
      entityId: updatedClient._id,
      details: { name, email, phone, service, status, assignedTo },
      req,
    });

    res.json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Log activity before deletion
    await logActivity({
      userId: req.user.id,
      action: 'client_deleted',
      entityType: 'Client',
      entityId: client._id,
      details: { name: client.name, email: client.email },
      req,
    });

    await client.deleteOne();

    res.json({
      success: true,
      message: 'Client removed',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add note to client
// @route   POST /api/clients/:id/notes
// @access  Private (Admin, Agent - agents can only add notes to assigned clients)
router.post('/:id/notes', authorize('admin', 'agent'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Role-based access: agents can only add notes to their assigned clients
    if (req.user.role === 'agent' && client.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'غير مصرح لك بإضافة ملاحظات لهذا العميل' });
    }

    const note = {
      content: req.body.content,
      addedBy: req.user.id,
    };

    client.notes.push(note);
    await client.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      action: 'client_note_added',
      entityType: 'Client',
      entityId: client._id,
      details: { clientName: client.name, noteContent: req.body.content },
      req,
    });

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get client statistics
// @route   GET /api/clients/stats/overview
// @access  Private (Admin, Viewer)
router.get('/stats/overview', authorize('admin', 'viewer'), async (req, res) => {
  try {
    const total = await Client.countDocuments();
    const byStatus = await Client.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byService = await Client.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        byStatus,
        byService,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
