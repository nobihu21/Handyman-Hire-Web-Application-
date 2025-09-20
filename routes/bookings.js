const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { customer, handyman, service, description, date, time, address, price } = req.body;
        
        const booking = new Booking({
            customer,
            handyman,
            service,
            description,
            date,
            time,
            address,
            price
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings for a handyman
router.get('/handyman/:handymanId', async (req, res) => {
    try {
        const bookings = await Booking.find({ handyman: req.params.handymanId })
            .populate('customer', 'name email phone')
            .sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings for a customer
router.get('/customer/:customerId', async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.params.customerId })
            .populate('handyman', 'name email phone skills rating')
            .sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.patch('/:bookingId/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            { status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all bookings (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customer', 'name email phone')
            .populate('handyman', 'name email phone')
            .sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 