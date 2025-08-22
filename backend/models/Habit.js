const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  days: [
    {
      day: { type: String },
      date: { type: String },
      completed: { type: Boolean, default: false }
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  },
{ timestamps: true }
);
module.exports = mongoose.model('Habit', habitSchema);