// node-js/models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false } // Helps you track new messages in Admin panel
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);