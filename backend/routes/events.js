const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { eventName, eventDate, venue, capacity, description, eventType } = req.body;

    // Validation
    if (!eventName || !eventDate || !venue || !capacity || !description || !eventType) {
      return res.status(400).json({ message: 'All fields are mandatory' });
    }

    if (capacity <= 0) {
      return res.status(400).json({ message: 'Capacity must be greater than 0' });
    }

    const event = await Event.create({
      eventName,
      eventDate,
      venue,
      capacity,
      description,
      eventType,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/events
// @desc    Get all events
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ eventDate: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { eventName, eventDate, venue, capacity, description, eventType, status } = req.body;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.eventName = eventName || event.eventName;
    event.eventDate = eventDate || event.eventDate;
    event.venue = venue || event.venue;
    event.capacity = capacity || event.capacity;
    event.description = description || event.description;
    event.eventType = eventType || event.eventType;
    event.status = status || event.status;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
