const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/profile/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/profile/:userId', async (req, res) => {
    try {
        const { name, phone, address, skills, experience } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { name, phone, address, skills, experience },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all handymen
router.get('/handymen', async (req, res) => {
    try {
        const handymen = await User.find({ role: 'handyman' })
            .select('-password')
            .sort({ rating: -1 });
        res.json(handymen);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (admin only)
router.get('/admin/all', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 