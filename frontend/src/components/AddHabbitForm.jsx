import React, { useState } from "react";

function AddHabitForm({ onAddHabit }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Other",
    target: 1,
    unit: "session",
    color: "blue"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!formData.name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const habitData = {
        name: formData.name.trim(),
        category: formData.category,
        target: formData.target,
        unit: formData.unit,
        color: formData.color
      };
      
      await onAddHabit(habitData);
      
      // Reset form
      setFormData({
        name: "",
        category: "Other",
        target: 1,
        unit: "session",
        color: "blue"
      });
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSubmitting && formData.name.trim()) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add New Habit</h2>
      </div>

      <div className="space-y-4">
        {/* Habit Name - Only visible field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g., Drink 8 glasses of water"
            value={formData.name}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting}
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name.trim()}
            className={`
              flex-1 sm:flex-none px-6 py-2 rounded-md font-medium
              ${isSubmitting || !formData.name.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            {isSubmitting ? 'Adding...' : 'Add Habit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddHabitForm;