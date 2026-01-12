// node-js/routes/contact.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   POST /api/contact
// @desc    Submit a new contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Message({
            name, email, subject, message
        });

        await newMessage.save();
        res.status(201).json({ msg: "Message sent successfully!" });
    } catch (err) {
        console.error("Contact API Error:", err.message);
        res.status(500).send("Server Error: Could not send message");
    }
});

// @route   GET /api/contact
// @desc    Get all messages (For Admin Dashboard)
// router.get('/', async (req, res) => {
//     try {
//         const messages = await Message.find().sort({ createdAt: -1 });
//         res.json(messages);
//     } catch (err) {
//         res.status(500).send("Server Error: Could not fetch messages");
//     }
// });

module.exports = router;