const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // fixed casing to match file system

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Registration attempt for:", email); // Log the email

        let user = await User.findOne({ email });
        if (user) {
            console.log("User already exists");
            return res.status(400).json({ msg: "User already exists" });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log("✅ User saved successfully!");

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (err) {
        console.error("❌ Registration Error:", err.message); // This will show in your terminal
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
});

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;