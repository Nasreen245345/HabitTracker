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
  completedDates: [{
    type: String, 
  }],
  startDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});
habitSchema.index({ userId: 1, createdAt: -1 });
habitSchema.index({ userId: 1, completedDates: 1 });
module.exports = mongoose.model('Habit', habitSchema);