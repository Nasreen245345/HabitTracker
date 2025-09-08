const express = require('express');
const router = express.Router();
const Habit = require('../models/Habit'); 
const authMiddleware = require('../middleware/auth'); 
router.use(authMiddleware);
//Get all habits 
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id; 
    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ 
      message: 'Failed to fetch habits',
      error: error.message 
    });
  }
});

// Create a new habit
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { name} = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const habit = new Habit({
      name: name.trim(),
      userId,
      completedDates: [],
      createdAt: new Date()
    });

    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ 
      message: 'Failed to create habit',
      error: error.message 
    });
  }
});




//  Delete habit
router.delete('/:habitId', async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user.id;

    const habit = await Habit.findOneAndDelete({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.json({ 
      message: 'Habit deleted successfully',
      deletedHabit: habit 
    });
  } catch (error) {
    console.error('Error deleting habit:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid habit ID' });
    }
    
    res.status(500).json({ 
      message: 'Failed to delete habit',
      error: error.message 
    });
  }
});

// Toggle habit completion for a specific date
router.patch('/:habitId/toggle', async (req, res) => {
  try {
    const { habitId } = req.params;
    const { date } = req.body;
    const userId = req.user.id;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Ensure format is YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }
    const [year, month, day] = date.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day, 0, 0, 0, 0); // local midnight
    // Today (local)
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (inputDate > today) {
      return res.status(400).json({
        message: 'Cannot mark habits as completed for future dates'
      });
    }
    // Find the habit
    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Toggle completion
    const dateIndex = habit.completedDates.indexOf(date);
    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(date);
    }

    const updatedHabit = await habit.save();

    res.json(updatedHabit);
  } catch (error) {
    console.error('Error toggling habit completion:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid habit ID' });
    }

    res.status(500).json({
      message: 'Failed to update habit completion',
      error: error.message
    });
  }
});




module.exports = router;