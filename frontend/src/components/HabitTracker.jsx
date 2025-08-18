import React, { useState } from "react";
import AddHabitForm from "./AddHabbitForm"; // Your simple form
import Dashboard from "../pages/Dashboard"; // The dashboard we created
import {useHabits} from "../context/HabitsContext"
function HabitTracker() {
  const {habits, setHabits} = useHabits();

  // Add new habit - this function handles the data from your AddHabitForm
  const handleAddHabit = (newHabit) => {
    setHabits([...habits, { 
      ...newHabit, 
      history: { 
        Mon: false, 
        Tue: false, 
        Wed: false, 
        Thu: false, 
        Fri: false, 
        Sat: false, 
        Sun: false 
      },
      id: Date.now() + Math.random(), // Add unique ID
      createdAt: new Date().toISOString() // Add creation date
    }]);
  };

  const handleToggleHabit = (index, day) => {
    const updatedHabits = [...habits];
    updatedHabits[index].history[day] = !updatedHabits[index].history[day];
    setHabits(updatedHabits);
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 mb-10">
        <div className="w-1/2  mx-auto mt-10 p-6 border rounded shadow ">
      <h1 className="text-3xl font-bold text-center mb-6">Habit Tracker</h1>
      
      {/* Your simple AddHabitForm */}
      <AddHabitForm onAddHabit={handleAddHabit} />
      
      {/* Habits List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
        {habits.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No habits yet. Add your first habit above!</p>
        ) : (
          <ul className="space-y-3">
            {habits.map((habit, index) => (
              <li key={habit.id || index} className="border p-4 rounded-lg bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-lg">{habit.name}</span>
                  <span className="text-sm text-gray-500">
                    {Math.round((Object.values(habit.history).filter(Boolean).length / 7) * 100)}% complete
                  </span>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Object.keys(habit.history).map((day) => (
                    <label key={day} className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <span className="text-xs font-medium text-gray-600">{day}</span>
                      <input
                        type="checkbox"
                        checked={habit.history[day]}
                        onChange={() => handleToggleHabit(index, day)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}

export default HabitTracker;