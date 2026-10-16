const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  containerService: {
    type: String,
    default: 'task-manager-backend'
  },
  studentRoll: {
    type: String,
    default: '24CS038'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
