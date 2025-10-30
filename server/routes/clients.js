import express from 'express';
import Client from '../models/Client.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, service, status, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

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
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name');

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

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
// @access  Private
router.post('/', async (req, res) => {
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
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const { name, email, phone, service, status, message, assignedTo } = req.body;

    client.name = name || client.name;
    client.email = email !== undefined ? email : client.email;
    client.phone = phone || client.phone;
    client.service = service || client.service;
    client.status = status || client.status;
    client.message = message || client.message;
    client.assignedTo = assignedTo || client.assignedTo;

    const updatedClient = await client.save();

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
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

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
// @access  Private
router.post('/:id/notes', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const note = {
      content: req.body.content,
      addedBy: req.user.id,
    };

    client.notes.push(note);
    await client.save();

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
// @access  Private
router.get('/stats/overview', async (req, res) => {
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
