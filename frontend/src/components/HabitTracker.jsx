import React, { useState, useEffect, useCallback } from "react";
import AddHabitForm from "./AddHabbitForm";
import habitApi from "../services/HabitApi";
import { useAuth } from "../context/AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Trash2, 
  Check, 
  X, 
  TrendingUp,
  Target,
  Award,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('today');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { token } = useAuth();

  // Auto-refresh when date changes (midnight detection)
  useEffect(() => {
    const checkForNewDay = () => {
      const now = new Date();
      const currentDateStr = formatDate(now);
      const storedDate = localStorage.getItem('lastVisitDate');
      
      if (storedDate && storedDate !== currentDateStr) {
        // New day detected, refresh habits
        loadHabits();
        localStorage.setItem('lastVisitDate', currentDateStr);
      }
    };

    // Store current date
    localStorage.setItem('lastVisitDate', formatDate(new Date()));
    
    // Check every minute for date change
    const interval = setInterval(checkForNewDay, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = useCallback(async () => {
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
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadHabits();
    setIsRefreshing(false);
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

  const handleToggleHabit = async (habitId, date) => {
    // CRITICAL: Only allow toggle if it's today
    if (!isToday(date)) {
      console.warn('Cannot toggle habit for non-current date');
      return;
    }

    try {
      setError(null);
      const dateStr = formatDate(date);
      
      // Optimistic update
      const habitToUpdate = habits.find(h => h._id === habitId);
      const wasCompleted = isHabitCompletedForDate(habitToUpdate, date);
      
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit._id === habitId) {
            const updatedDates = [...(habit.completedDates || [])];
            if (wasCompleted) {
              const index = updatedDates.indexOf(dateStr);
              if (index > -1) updatedDates.splice(index, 1);
            } else {
              updatedDates.push(dateStr);
            }
            return { ...habit, completedDates: updatedDates };
          }
          return habit;
        })
      );
      
      // Call the API
      const updatedHabit = await habitApi.toggleHabitCompletion(habitId, dateStr);
      
      // Update with server response
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId ? updatedHabit : habit
        )
      );
     
      
    } catch (err) {
      setError('Failed to update habit');
      console.error('Error toggling habit:', err);
      // Revert optimistic update
      loadHabits();
      
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const habit = habits.find(h => h._id === habitId);
    if (!window.confirm(`Are you sure you want to delete "${habit?.name}"?`)) {
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

  // Fixed date helper functions
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    return today.getFullYear() === compareDate.getFullYear() &&
           today.getMonth() === compareDate.getMonth() &&
           today.getDate() === compareDate.getDate();
  };

  const isFutureDate = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    // Set both dates to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    
    return compareDate > today;
  };

  const isPastDate = (date) => {
    const today = new Date();
    const compareDate = new Date(date);
    
    // Set both dates to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    
    return compareDate < today;
  };

  const isHabitCompletedForDate = (habit, date) => {
    const dateStr = formatDate(date);
    return habit.completedDates && habit.completedDates.includes(dateStr);
  };
  const generateCalendarDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    setCurrentView('today');
  };

  // FIXED: Handle calendar date selection - only allow today
  const handleCalendarDateClick = (date) => {
    if (isToday(date)) {
      setSelectedDate(new Date(date));
      setCurrentView('today'); 
    }
   
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

  const filteredHabits = habits;

  // Stats for today
  const todayStats = {
    total: habits.length,
    completed: habits.filter(habit => isHabitCompletedForDate(habit, new Date())).length,
    pending: habits.length - habits.filter(habit => isHabitCompletedForDate(habit, new Date())).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your habits...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold text-blue1">
                Habit Tracker
              </h1>
              <p className="text-gray-600 mt-2">Build better habits, one day at a time</p>
            </div>
            
            {/* Action Buttons */}
            {/* <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg"
              >
                Today
              </button>

              <button
                onClick={() => setCurrentView(currentView === 'today' ? 'calendar' : 'today')}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium ${
                  currentView === 'calendar' 
                    ? 'bg-blue1 text-white shadow-lg' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:shadow-md'
                }`}
              >
                
                {currentView === 'today' ? 'Calendar View' : 'Today View'}
              </button>
            </div> */}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
       
          {/* Add Habit Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <AddHabitForm onAddHabit={handleAddHabit} />
          </div>
        </div>

        {/* Calendar View */}
        {currentView === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
           
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => navigateMonth(-1)}
                className="p-3 hover:bg-gray-100 rounded-lg"
              >
             
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </h2>
              <button 
                onClick={() => navigateMonth(1)}
                className="p-3 hover:bg-gray-100 rounded-lg"
              >
               
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {generateCalendarDates().map((date, index) => {
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isTodayDate = isToday(date);
                const isFuture = isFutureDate(date);
                const isPast = isPastDate(date);
                const completedCount = habits.filter(habit => 
                  isHabitCompletedForDate(habit, date)
                ).length;
                
                return (
                  <div
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-center text-sm relative rounded-xl border-2 transition-all ${
                      isCurrentMonth 
                        ? isTodayDate 
                          ? 'bg-blue-100 border-blue-300 text-blue1 font-bold shadow-md cursor-pointer hover:shadow-lg' 
                          : isFuture
                            ? 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed'
                            : isPast
                              ? 'text-gray-500 bg-gray-100 border-gray-200 cursor-default'
                              : 'text-gray-700 hover:bg-gray-50 border-gray-200 hover:border-gray-300 cursor-pointer'
                        : 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed'
                    }`}
                    onClick={() => isCurrentMonth && handleCalendarDateClick(date)}
                    title={
                      isTodayDate ? 'Click to go to today view' :
                      isPast ? 'Past date - view only' :
                      isFuture ? 'Future date' : ''
                    }
                  >
                    <span className="text-base font-medium mb-1">{date.getDate()}</span>
                    {completedCount > 0 && isCurrentMonth && !isFuture && (
                      <div className="flex space-x-1">
                        {Array.from({length: Math.min(completedCount, 4)}, (_, i) => (
                          <div key={i} className="w-2 h-2 bg-green-500 rounded-full shadow-sm" />
                        ))}
                        {completedCount > 4 && (
                          <span className="text-xs text-green-600 font-bold">+</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Habits List */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentView === 'today' 
                  ? "Today's Habits" 
                  : `Habits for ${selectedDate.toLocaleDateString()}`
                }
              </h2>
              <p className="text-gray-600 mt-1">
                {filteredHabits.length} habit{filteredHabits.length !== 1 ? 's' : ''} 
                {currentView === 'today' && ` • ${todayStats.completed} completed`}
              </p>
            </div>
            {currentView === 'calendar' && !isToday(selectedDate) && (
              <span className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
                {isFutureDate(selectedDate) ? 'Future date - view only' : 'Past date - view only'}
              </span>
            )}
          </div>
          
          {habits.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Ready to build great habits?</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Start your journey towards better daily routines. Add your first habit above and begin tracking your progress.
              </p>
            </div>
          ) : filteredHabits.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All done for today!</h3>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredHabits.map((habit) => {
                const displayDate = currentView === 'today' ? new Date() : selectedDate;
                const isCompleted = isHabitCompletedForDate(habit, displayDate);
                const canToggle = isToday(displayDate); 
                
                
                return (
                  <div key={habit._id} className={`border-2 rounded-xl p-6 ${
                    isCompleted 
                      ? 'bg-white shadow-md' 
                      : 'hover:border-gray-300 hover:shadow-md bg-white border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-blue1 mb-3">{habit.name}</h3>
                       
                        
                      </div>                      
                      <div className="flex items-center gap-3 ml-4">
                        {canToggle ? (
                          <button
                            onClick={() => handleToggleHabit(habit._id, displayDate)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                              isCompleted 
                                ? 'bg-green-900 text-white shadow-lg hover:bg-green-800' 
                                : 'bg-blue1 text-white shadow-lg hover:opacity-90'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Mark Complete'}
                          </button>
                        ) : (
                          <span className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl text-sm font-medium">
                            {isFutureDate(displayDate) ? 'Future date' : 'Past date - view only'}
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleDeleteHabit(habit._id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-xl text-xl font-bold transition-colors"
                          title="Delete habit"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {/* Weekly Progress for Today View */}
                    {currentView === 'today' && (
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-blue1">
                            {Array.from({length: 7}, (_, i) => {
                              const checkDate = new Date();
                              checkDate.setDate(checkDate.getDate() - (6 - i));
                              return isHabitCompletedForDate(habit, checkDate);
                            }).filter(Boolean).length}/7 days
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {Array.from({length: 7}, (_, i) => {
                            const checkDate = new Date();
                            checkDate.setDate(checkDate.getDate() - (6 - i));
                            const completed = isHabitCompletedForDate(habit, checkDate);
                            const dayName = checkDate.toLocaleDateString('en', {weekday: 'short'});
                            
                            return (
                              <div key={i} className="flex-1 text-center">
                                <div className="text-xs font-medium text-gray-600 mb-2">
                                  {dayName}
                                </div>
                                <div className={`w-full h-8 rounded-md transition-all ${
                                  completed ? 'bg-green-900 shadow-sm' : 'bg-gray-200'
                                }`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HabitTracker;