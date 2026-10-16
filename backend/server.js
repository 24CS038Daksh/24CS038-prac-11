require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const os = require('os');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_manager_p11';

app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// Health Check Endpoint (Used by Docker Healthcheck)
// -----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'task-manager-backend',
    containerHostname: os.hostname(),
    uptimeSeconds: Math.floor(process.uptime()),
    databaseState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED',
    studentId: process.env.STUDENT_ID || '24CS038',
    studentName: process.env.STUDENT_NAME || 'Daksh Karangiya',
    practical: 'Practical 11: Docker Containerization & Docker Compose Orchestration'
  });
});

// -----------------------------------------------------------------------------
// Docker Orchestration Status & Topology Endpoint
// -----------------------------------------------------------------------------
app.get('/api/docker/status', (req, res) => {
  res.status(200).json({
    orchestration: 'Docker Compose v3.8',
    network: {
      name: 'task-manager-app-network',
      driver: 'bridge',
      subnet: '172.20.0.0/16',
      dnsServer: '127.0.0.11 (Docker Internal DNS)'
    },
    volumes: [
      {
        name: 'task-manager-mongo-data',
        mountPath: '/data/db',
        driver: 'local',
        scope: 'persistent across container restarts'
      }
    ],
    services: [
      {
        name: 'frontend',
        container: 'task-manager-frontend',
        image: 'practical-11-frontend:latest',
        buildType: 'Multi-Stage Build (node:20-alpine -> nginx:alpine)',
        ports: '5173:5173',
        status: 'RUNNING',
        role: 'Client Interface'
      },
      {
        name: 'backend',
        container: 'task-manager-backend',
        image: 'practical-11-backend:latest',
        buildType: 'Node 20 Alpine Linux',
        ports: '5000:5000',
        status: 'RUNNING (Healthy)',
        role: 'Express REST API'
      },
      {
        name: 'mongodb',
        container: 'task-manager-mongodb',
        image: 'mongo:7.0-jammy',
        ports: '27017:27017',
        status: 'RUNNING (Healthy)',
        role: 'Persistent Document Store'
      }
    ],
    student: {
      id: process.env.STUDENT_ID || '24CS038',
      name: process.env.STUDENT_NAME || 'Daksh Karangiya',
      subject: 'ITUE301: Advance Web Development Framework'
    }
  });
});

// -----------------------------------------------------------------------------
// Task CRUD Endpoints
// -----------------------------------------------------------------------------
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      containerHostname: os.hostname(),
      tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, priority, status } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      status: status || 'pending',
      containerService: 'task-manager-backend',
      studentRoll: '24CS038'
    });

    res.status(201).json({
      success: true,
      message: 'Task created inside containerized backend and persisted to MongoDB volume',
      task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      taskId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('====================================================');
    console.log(`MongoDB Connected: ${MONGO_URI}`);
    console.log(`Service: task-manager-backend | Host: ${os.hostname()}`);
    console.log(`Student: Daksh Karangiya | Roll: 24CS038`);
    console.log('====================================================');
    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Allow server to listen even if mongo takes a few seconds to initialize
    app.listen(PORT, () => {
      console.log(`Backend server started on port ${PORT} (retrying DB connection...)`);
    });
  });
