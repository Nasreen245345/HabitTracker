import React, { useState, useEffect } from "react";
import AddHabitForm from "./AddHabbitForm";
import habitApi from "../services/HabitApi";
import { useAuth } from "../context/AuthContext";

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedHabits = await habitApi.getAllHabits();
      setHabits(fetchedHabits);
    } catch (err) {
      setError('Failed to load habits');
      console.error('Error loading habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (newHabitData) => {
    try {
      setError(null);
  
      const createdHabit = await habitApi.createHabit(newHabitData);
      setHabits(prevHabits => [createdHabit, ...prevHabits]);
    } catch (err) {
      setError('Failed to add habit');
      console.error('Error adding habit:', err);
    }
  };

  const handleToggleHabit = async (habitId, day) => {
  try {
    setError(null);
    const today = new Date().toISOString().split('T')[0]; 
    const updatedHabit = await habitApi.toggleHabitDay(habitId, day, today);
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit._id === habitId ? updatedHabit : habit
      )
    );
  } catch (err) {
    setError('Failed to update habit');
    console.error('Error toggling habit:', err);
  }
};

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      setError(null);
      await habitApi.deleteHabit(habitId);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
    } catch (err) {
      setError('Failed to delete habit');
      console.error('Error deleting habit:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading habits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 mb-10">
      <div className="w-1/2 mx-auto mt-10 p-6 border rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-inter">Habit Tracker</h1>
          
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button 
              onClick={() => setError(null)}
              className="float-right text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        <AddHabitForm onAddHabit={handleAddHabit} />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No habits yet. Add your first habit above!
            </p>
          ) : (
            <ul className="space-y-3">
              {habits.map((habit) => (
                <li key={habit._id} className="border p-4 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-lg">{habit.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {Math.round((habit.days.length / 7) * 100)}% complete
                      </span>
                      <button
                        onClick={() => handleDeleteHabit(habit._id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                 <div className="grid grid-cols-7 gap-2">
  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
    const isChecked = habit.days.some((d) => d.day === day);

    return (
      <label
        key={day}
        className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-50 cursor-pointer"
      >
        <span className="text-xs font-medium text-gray-600">{day}</span>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => handleToggleHabit(habit._id, day)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />
      </label>
    );
  })}
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