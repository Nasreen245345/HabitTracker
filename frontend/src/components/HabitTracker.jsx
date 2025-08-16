import React, { useState } from "react";
import AddHabitForm from "./AddHabbitForm";
import Dashboard from "../pages/Dashboard";  

function HabitTracker() {
  const [habits, setHabits] = useState([]);

  // Add new habit
  const handleAddHabit = (newHabit) => {
    setHabits([...habits, {
      ...newHabit,
      history: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false }
    }]);
  };
  const handleToggleHabit = (index, day = "Wed") => {
    const updatedHabits = [...habits];
    updatedHabits[index].history[day] = !updatedHabits[index].history[day];
    setHabits(updatedHabits);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold text-center">Habit Tracker</h1>

      <AddHabitForm onAddHabit={handleAddHabit} />

       {/* Habits List  */}
      <ul className="mt-6 space-y-3">
        {habits.map((habit, index) => (
          <li key={index} className="border p-2 rounded">
            <span className="font-semibold">{habit.name}</span>
            <div className="flex gap-2 mt-2">
              {Object.keys(habit.history).map((day) => (
                <label key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={habit.history[day]}
                    onChange={() => handleToggleHabit(index, day)}
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </li>
          
        ))}
      </ul>
      
      {/* <Dashboard habits={habits} /> */}
    </div>
    
  );
}
export default HabitTracker;
