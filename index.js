const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// Inside server.js
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

dotenv.config();
const app = express();


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // For development – adjust in prod
    methods: ['GET', 'POST'],
  },
});

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());




// Socket.IO logic
io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('receive-offer', offer);
  });

  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('receive-answer', answer);
  });

  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('receive-ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


// Routes (will add soon)
app.get('/', (req, res) => {
  res.send('API Running...');
});


app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));