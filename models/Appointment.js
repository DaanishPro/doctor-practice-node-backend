// node-js/models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true },
    service: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: 'Pending' } // Can be Pending, Confirmed, or Cancelled
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Appointment', AppointmentSchema);