const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/memberships
// @desc    Add new membership
// @access  Private (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { memberName, contactNumber, email, address, membershipType } = req.body;

    // Validation
    if (!memberName || !contactNumber || !email || !address || !membershipType) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Contact number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).json({ message: 'Contact number must be 10 digits' });
    }

    // Check if email already exists
    const existingMembership = await Membership.findOne({ email });
    if (existingMembership) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const membership = await Membership.create({
      memberName,
      contactNumber,
      email,
      address,
      membershipType: membershipType || '6months',
      createdBy: req.user._id
    });

    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/memberships
// @desc    Get all memberships
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/memberships/:membershipNumber
// @desc    Get membership by number
// @access  Private
router.get('/:membershipNumber', protect, async (req, res) => {
  try {
    const membership = await Membership.findOne({ 
      membershipNumber: req.params.membershipNumber 
    });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/memberships/:membershipNumber
// @desc    Update membership (extend or cancel)
// @access  Private (Admin only)
router.put('/:membershipNumber', protect, adminOnly, async (req, res) => {
  try {
    const { action, extensionType } = req.body;

    const membership = await Membership.findOne({ 
      membershipNumber: req.params.membershipNumber 
    });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    if (action === 'extend') {
      if (!extensionType) {
        return res.status(400).json({ message: 'Extension type is required' });
      }

      const currentEndDate = new Date(membership.endDate);
      const newEndDate = new Date(currentEndDate);

      switch(extensionType) {
        case '6months':
          newEndDate.setMonth(newEndDate.getMonth() + 6);
          break;
        case '1year':
          newEndDate.setFullYear(newEndDate.getFullYear() + 1);
          break;
        case '2years':
          newEndDate.setFullYear(newEndDate.getFullYear() + 2);
          break;
        default:
          return res.status(400).json({ message: 'Invalid extension type' });
      }

      membership.endDate = newEndDate;
      membership.status = 'active';
    } else if (action === 'cancel') {
      membership.status = 'cancelled';
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    membership.updatedAt = Date.now();
    await membership.save();

    res.json(membership);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/memberships/:id
// @desc    Delete membership
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    await membership.deleteOne();
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
