const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  addAvailableSlots,
} = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/add-slots', protect, addAvailableSlots); // only doctor can do this

module.exports = router;
