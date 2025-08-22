import React, { useState } from "react";

function AddHabitForm({ onAddHabit }) {
  const [habitName, setHabitName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!habitName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddHabit({
        name: habitName.trim()
      });
      setHabitName("");
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 px-10 sm:px-1">
      <input
        type="text"
        placeholder="Enter habit name"
        value={habitName}
        required
        onChange={(e) => setHabitName(e.target.value)}
        className="border p-2 rounded flex-grow"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting || !habitName.trim()}
        className={`px-4 py-2 rounded text-white ${
          isSubmitting || !habitName.trim()
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}

export default AddHabitForm;