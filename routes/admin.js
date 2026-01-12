const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Appointment = require('../models/Appointment');
const Message = require('../models/Message');
const User = require('../models/user');

// @route   GET /api/admin/appointments
// @desc    Get all appointments for the dashboard
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ date: -1 });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route   GET /api/admin/messages
// @desc    Get all contact messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route   GET /api/admin/stats
// @desc    Get counts for the dashboard cards
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments({ role: 'patient' });
        const appointmentCount = await Appointment.countDocuments();
        const messageCount = await Message.countDocuments();
        
        res.json({
            users: userCount,
            appointments: appointmentCount,
            messages: messageCount,
            revenue: appointmentCount * 50 // Example calculation
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// @route   GET /api/admin/admin-name
// @desc    Get admin user name from token
router.get('/admin-name', async (req, res) => {
    try {
        // Get token from Authorization header or from request body
        const token = req.headers.authorization?.split(' ')[1] || req.headers['x-auth-token'] || req.query.token;
        
        if (!token) {
            return res.status(401).json({ msg: "No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user by ID from token
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied. Admin only." });
        }

        // Return admin name
        res.json({ name: user.name });
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token expired" });
        }
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;