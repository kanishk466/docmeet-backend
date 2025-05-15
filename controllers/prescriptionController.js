const PDFDocument = require('pdfkit');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// Create prescription (Doctor)
exports.createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, medications, advice } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or invalid appointment' });
    }

    const prescription = new Prescription({
      appointment: appointmentId,
      doctor: req.user.id,
      patient: appointment.patient,
      diagnosis,
      medications,
      advice,
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created', prescription });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create prescription', error: err.message });
  }
};

// Get all prescriptions for a patient
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name email')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get prescriptions', error: err.message });
  }
};

// Generate PDF for a prescription
exports.getPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id).populate('doctor patient');
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text('E-Prescription', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Doctor: ${prescription.doctor.name}`);
    doc.text(`Patient: ${prescription.patient.name}`);
    doc.text(`Date: ${new Date(prescription.createdAt).toDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Diagnosis:');
    doc.fontSize(12).text(prescription.diagnosis);
    doc.moveDown();

    doc.fontSize(14).text('Medications:');
    prescription.medications.forEach((med, i) => {
      doc.text(`${i + 1}. ${med.name} - ${med.dosage} - ${med.frequency}`);
    });

    if (prescription.advice) {
      doc.moveDown();
      doc.fontSize(14).text('Advice:');
      doc.fontSize(12).text(prescription.advice);
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
  }
};
