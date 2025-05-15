const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
  date: String,
  slots: [String], // ["10:00 AM", "11:00 AM"]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'patient'], required: true },
  specialization: String, // only for doctors
  availableSlots: [availableSlotSchema], // only for doctors
});

module.exports = mongoose.model('User', userSchema);
