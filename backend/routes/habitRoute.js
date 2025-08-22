const express = require("express");
const Habit = require("../models/Habit");
const router = express.Router();
const authMiddleware = require("../middleware/Auth");
//get all habits
router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create habit
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name} = req.body;
    const habit = new Habit({
      name,
      userId: req.user.id,
    });

    await habit.save();
    res.status(201).json(habit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// toggle habit day
router.patch("/:id/toggle", authMiddleware, async (req, res) => {
  try {
    const { day, date } = req.body;

    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const existingIndex = habit.days.findIndex(
      (d) => d.day === day && d.date === date
    );

    if (existingIndex >= 0) {

      habit.days.splice(existingIndex, 1);
    } else {

      habit.days.push({ 
        day, 
        date, 
        completed: true 
      });
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error("Error in toggle route:", err);
    res.status(500).json({ message: err.message });
  }
});

// delete habit
router.delete("/:id",authMiddleware, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
