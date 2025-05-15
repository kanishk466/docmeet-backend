const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionPDF,
} = require('../controllers/prescriptionController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createPrescription); // Doctor only
router.get('/mine', protect, getPatientPrescriptions); // Patient
router.get('/pdf/:id', protect, getPrescriptionPDF); // PDF download

module.exports = router;
