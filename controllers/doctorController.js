const User = require('../models/User');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

// Get single doctor by ID with availability
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select('-password');
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
};

// Add available slots (Doctor-only action)
exports.addAvailableSlots = async (req, res) => {
  try {
    const { date, slots } = req.body;
    const doctor = await User.findById(req.user.id);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Add or update availability for the date
    const existingDate = doctor.availableSlots.find(slot => slot.date === date);
    if (existingDate) {
      existingDate.slots = [...new Set([...existingDate.slots, ...slots])]; // merge slots
    } else {
      doctor.availableSlots.push({ date, slots });
    }

    await doctor.save();
    res.json({ message: 'Slots updated', availableSlots: doctor.availableSlots });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update slots', error: error.message });
  }
};
