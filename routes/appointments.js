// node-js/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// @route   POST /api/appointments
// @desc    Save a new appointment booking
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, date, service, notes } = req.body;

        const newAppointment = new Appointment({
            name, email, phone, date, service, notes
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json({ msg: "Appointment booked successfully!", data: savedAppointment });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error while booking appointment");
    }
});

// @route   GET /api/appointments
// @desc    Fetch all appointments (For Admin Dashboard)
// router.get('/', async (req, res) => {
//     try {
//         const appointments = await Appointment.find().sort({ createdAt: -1 });
//         res.json(appointments);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error while fetching appointments");
//     }
// });

module.exports = router;