const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
} = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');

router.post('/book', protect, bookAppointment); // patient
router.get('/my', protect, getMyAppointments); // patient
router.get('/doctor', protect, getDoctorAppointments); // doctor

module.exports = router;
