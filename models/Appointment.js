const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g. "2025-05-20"
  time: { type: String, required: true }, // e.g. "10:00 AM"
  status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
