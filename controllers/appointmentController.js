const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Book appointment (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Check if the slot is already booked
    const existing = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existing) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      time,
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};

// Get appointments for logged-in patient
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization email')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get appointments', error: err.message });
  }
};

// Get appointments for doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name email')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get appointments', error: err.message });
  }
};
