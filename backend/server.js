const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const meetingRoutes = require('./routes/meetingRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

app.use('/api/meetings', meetingRoutes);

// --- Socket.io Connection Logic ---
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join-meeting', (meetingId) => {
    console.log(`User ${socket.id} is joining meeting ${meetingId}`);
    socket.join(meetingId);
    socket.to(meetingId).emit('user-joined', { socketId: socket.id });
  });

  // --- THIS IS THE CORRECTED SIGNALING LOGIC ---
  // The server now acts as a simple relay.

  socket.on('offer', (payload) => {
    // Just forward the entire payload to the target
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    // Just forward the entire payload to the target
    io.to(payload.target).emit('answer', payload);
  });

  socket.on('ice-candidate', (payload) => {
    // Just forward the entire payload to the target
    io.to(payload.target).emit('ice-candidate', payload);
  });
  
  // Handle user disconnection
  socket.on('disconnecting', () => {
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.to(room).emit('user-left', { socketId: socket.id });
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});