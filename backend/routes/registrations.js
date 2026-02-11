const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Membership = require('../models/Membership');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// @route   POST /api/registrations
// @desc    Register for an event
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { membershipNumber, eventId } = req.body;

    // Validation
    if (!membershipNumber || !eventId) {
      return res.status(400).json({ message: 'Membership number and event are required' });
    }

    // Check if membership exists and is active
    const membership = await Membership.findOne({ membershipNumber });
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    if (membership.status !== 'active') {
      return res.status(400).json({ message: 'Membership is not active' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      membershipNumber,
      eventId,
      status: { $ne: 'cancelled' }
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check event capacity
    const registrationCount = await Registration.countDocuments({
      eventId,
      status: { $ne: 'cancelled' }
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const registration = await Registration.create({
      membershipNumber,
      eventId,
      createdBy: req.user._id
    });

    const populatedRegistration = await Registration.findById(registration._id)
      .populate('eventId')
      .populate('createdBy', 'username');

    res.status(201).json(populatedRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/registrations
// @desc    Get all registrations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/registrations/member/:membershipNumber
// @desc    Get registrations by membership number
// @access  Private
router.get('/member/:membershipNumber', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({
      membershipNumber: req.params.membershipNumber
    }).populate('eventId').sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/registrations/event/:eventId
// @desc    Get registrations by event
// @access  Private
router.get('/event/:eventId', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.eventId
    }).sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/registrations/:id
// @desc    Update registration status
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;

    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (status) {
      registration.status = status;
      await registration.save();
    }

    const updatedRegistration = await Registration.findById(registration._id)
      .populate('eventId');

    res.json(updatedRegistration);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/registrations/:id
// @desc    Cancel registration
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
