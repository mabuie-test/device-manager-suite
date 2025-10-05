// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const apiRoutes = require('./src/routes'); // index of routes
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// connect mongo
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devicemgr', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const conn = mongoose.connection;
conn.once('open', () => console.log('Connected to MongoDB'));

// setup GridFSBucket after connection
const mongodb = require('mongodb');
let gridfsBucket = null;
conn.once('open', () => {
  gridfsBucket = new mongodb.GridFSBucket(conn.db, { bucketName: 'media' });
  app.set('gridfsBucket', gridfsBucket);
});

// attach socket.io
app.set('io', io);

// routes
app.use('/api', apiRoutes);

// static frontend (if you host frontend from backend)
app.use('/', express.static(path.join(__dirname, '../web-frontend')));

// socket.io behavior
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join_device_room', (deviceId) => {
    socket.join(`device_${deviceId}`);
  });
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server listening on', PORT));
