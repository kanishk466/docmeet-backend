const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const cors = require('cors');

// Inside server.js
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());



// Routes (will add soon)
app.get('/', (req, res) => {
  res.send('API Running...');
});


app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

