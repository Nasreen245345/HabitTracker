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
    validate: {
      validator: function(dateStr) {
        // Validate date format YYYY-MM-DD
        return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
      },
      message: 'Date must be in YYYY-MM-DD format'
    }
  }],
  
  // Track when habit was created to calculate total days
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