import React, { useState } from "react";

function AddHabitForm({ onAddHabit }) {
  const [habitName, setHabitName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return; 

 
    onAddHabit({
      name: habitName,
      progress: 0, 
      days: [] 
    });
    setHabitName(""); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 px-10">
      <input
        type="text"
        placeholder="Enter habit name"
        value={habitName}
        required
        onChange={(e) => setHabitName(e.target.value)}
        className="border p-2 rounded flex-grow"
     
      />
      <button
        type="submit"
        className="bg-blue1 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  );
}

export default AddHabitForm;
