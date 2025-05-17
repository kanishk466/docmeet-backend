const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
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




const server = http.createServer(app);




const io = new Server(server, {
  cors: {
    origin: '*', // For development – adjust in prod
    methods: ['GET', 'POST'],
  },
});



// === Socket.IO Signaling Logic ===
io.on('connection', socket => {
  console.log('🔗 Client connected:', socket.id);

  socket.on('join-room', roomId => {
    socket.join(roomId);
    console.log(`📥 ${socket.id} joined room: ${roomId}`);

    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('sending-signal', ({ userToSignal, signal, callerId }) => {
    io.to(userToSignal).emit('user-signal', { signal, callerId });
  });

  socket.on('returning-signal', ({ signal, callerId }) => {
    io.to(callerId).emit('receiving-returned-signal', { signal, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});











// Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));