const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Handyman = require('../models/Handyman');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const {
      serviceType,
      category,
      description,
      preferredDate,
      preferredTime,
      address,
      additionalNotes,
      userId
    } = req.body;

    // Find nearest available handyman
    const handyman = await Handyman.findOne({
      serviceType,
      isAvailable: true
    }).sort({ rating: -1 });

    if (!handyman) {
      return res.status(400).json({
        message: 'No handyman available for this service at the moment'
      });
    }

    // Create booking
    const booking = new Booking({
      userId,
      handymanId: handyman._id,
      serviceType,
      category,
      description,
      preferredDate,
      preferredTime,
      address,
      additionalNotes,
      status: 'pending'
    });

    await booking.save();

    // Update handyman availability
    handyman.isAvailable = false;
    await handyman.save();

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: booking._id,
      handymanId: handyman._id,
      handymanName: handyman.name
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      message: 'Failed to create booking'
    });
  }
});

// Get user's bookings
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('handymanId', 'name phone rating')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bookings'
    });
  }
});

// Get handyman's bookings
router.get('/handyman/:handymanId', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ handymanId: req.params.handymanId })
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch bookings'
    });
  }
});

// Update booking status
router.patch('/:bookingId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    // If booking is completed or cancelled, make handyman available again
    if (status === 'completed' || status === 'cancelled') {
      const handyman = await Handyman.findById(booking.handymanId);
      if (handyman) {
        handyman.isAvailable = true;
        await handyman.save();
      }
    }

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update booking status'
    });
  }
});

module.exports = router; 