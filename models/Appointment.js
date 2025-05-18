const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  issue: { type: String }, // 🆕 Brief current issue
  medicalHistory: { type: String }, // 🆕 Optional medical background
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled','inProgress'],
    default: 'booked',
  },
    roomId: {
      type:String
    }
}, { timestamps: true });



module.exports = mongoose.model('Appointment', appointmentSchema);
