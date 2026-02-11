const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect } = require('../middleware/auth');

// @route   GET /api/reports/memberships
// @desc    Get membership report
// @access  Private
router.get('/memberships', protect, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const memberships = await Membership.find(query).sort({ createdAt: -1 });

    const stats = {
      total: memberships.length,
      active: memberships.filter(m => m.status === 'active').length,
      expired: memberships.filter(m => m.status === 'expired').length,
      cancelled: memberships.filter(m => m.status === 'cancelled').length,
      sixMonths: memberships.filter(m => m.membershipType === '6months').length,
      oneYear: memberships.filter(m => m.membershipType === '1year').length,
      twoYears: memberships.filter(m => m.membershipType === '2years').length
    };

    res.json({ memberships, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/events
// @desc    Get events report
// @access  Private
router.get('/events', protect, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.eventDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query).sort({ eventDate: -1 });

    // Get registration counts for each event
    const eventsWithRegistrations = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          eventId: event._id,
          status: { $ne: 'cancelled' }
        });

        return {
          ...event.toObject(),
          registrationCount,
          availableSlots: event.capacity - registrationCount
        };
      })
    );

    const stats = {
      total: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
      cancelled: events.filter(e => e.status === 'cancelled').length
    };

    res.json({ events: eventsWithRegistrations, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/registrations
// @desc    Get registrations report
// @access  Private
router.get('/registrations', protect, async (req, res) => {
  try {
    const { status, eventId, membershipNumber, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (eventId) {
      query.eventId = eventId;
    }

    if (membershipNumber) {
      query.membershipNumber = membershipNumber;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const registrations = await Registration.find(query)
      .populate('eventId')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    // Get membership details for each registration
    const registrationsWithDetails = await Promise.all(
      registrations.map(async (registration) => {
        const membership = await Membership.findOne({
          membershipNumber: registration.membershipNumber
        });

        return {
          ...registration.toObject(),
          memberDetails: membership,
          username: registration.createdBy?.username
        };
      })
    );

    const stats = {
      total: registrations.length,
      registered: registrations.filter(r => r.status === 'registered').length,
      attended: registrations.filter(r => r.status === 'attended').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length
    };

    res.json({ registrations: registrationsWithDetails, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/registrations/by-user
// @desc    Get registrations grouped by user (membership) with their events
// @access  Private
router.get('/registrations/by-user', protect, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const match = {};
    if (status) match.status = status;
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          as: 'event'
        }
      },
      { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$membershipNumber',
          membershipNumber: { $first: '$membershipNumber' },
          events: {
            $push: {
              eventId: '$event._id',
              eventName: '$event.eventName',
              eventDate: '$event.eventDate',
              status: '$status',
              registeredAt: '$createdAt',
              username: '$user.username'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'memberships',
          localField: '_id',
          foreignField: 'membershipNumber',
          as: 'member'
        }
      },
      { $unwind: { path: '$member', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          membershipNumber: '$_id',
          member: '$member',
          events: 1,
          count: 1,
          _id: 0
        }
      }
    ];

    const users = await Registration.aggregate(pipeline);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalMemberships = await Membership.countDocuments();
    const activeMemberships = await Membership.countDocuments({ status: 'active' });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const totalRegistrations = await Registration.countDocuments();
    const activeRegistrations = await Registration.countDocuments({ 
      status: { $ne: 'cancelled' } 
    });

    // Recent activities
    const recentMemberships = await Membership.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentRegistrations = await Registration.find()
      .populate('eventId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalMemberships,
        activeMemberships,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        activeRegistrations
      },
      recentActivities: {
        memberships: recentMemberships,
        events: recentEvents,
        registrations: recentRegistrations
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
