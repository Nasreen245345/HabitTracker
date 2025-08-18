import React, { useState } from "react";
import {useHabits} from "../context/HabitsContext"
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const {habits}=useHabits()
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedHabit, setSelectedHabit] = useState("all");

  // Helper function to get current date info
  const getCurrentDay = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()];
  };

  // Calculate success rate for different periods
  const calculateSuccessRate = (period) => {
    if (!habits.length) return 0;

    const totalHabits = habits.length;
    const currentDay = getCurrentDay();

    switch (period) {
      case "today":
        const todayCompleted = habits.filter(habit => habit.history[currentDay]).length;
        return Math.round((todayCompleted / totalHabits) * 100);

      case "week":
        const days = Object.keys(habits[0]?.history || {});
        let weeklyCompleted = 0;
        let totalWeeklyHabits = totalHabits * days.length;
        
        habits.forEach(habit => {
          days.forEach(day => {
            if (habit.history[day]) weeklyCompleted++;
          });
        });
        
        return Math.round((weeklyCompleted / totalWeeklyHabits) * 100);

      default:
        return 0;
    }
  };

  // Get habit completion data for charts
  const getHabitCompletionData = () => {
    if (!habits.length) return { completed: 0, remaining: 0 };

    const currentDay = getCurrentDay();
    const completed = habits.filter(habit => habit.history[currentDay]).length;
    const remaining = habits.length - completed;

    return { completed, remaining };
  };

  // Get weekly progress data
  const getWeeklyProgressData = () => {
    if (!habits.length) return {};

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
      const completed = habits.filter(habit => habit.history[day]).length;
      return Math.round((completed / habits.length) * 100);
    });

    return {
      labels: days,
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: data,
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        }
      ]
    };
  };

  // Get individual habit progress
  const getIndividualHabitData = () => {
    if (!habits.length) return {};

    const habitNames = habits.map(habit => habit.name.length > 10 ? habit.name.substring(0, 10) + '...' : habit.name);
    const days = Object.keys(habits[0].history);
    const completionRates = habits.map(habit => {
      const completed = days.filter(day => habit.history[day]).length;
      return Math.round((completed / days.length) * 100);
    });

    return {
      labels: habitNames,
      datasets: [
        {
          label: 'Weekly Completion Rate (%)',
          data: completionRates,
          backgroundColor: [
            'rgba(59, 130, 246, 0.6)',
            'rgba(16, 185, 129, 0.6)',
            'rgba(245, 158, 11, 0.6)',
            'rgba(239, 68, 68, 0.6)',
            'rgba(139, 92, 246, 0.6)',
            'rgba(236, 72, 153, 0.6)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
          ],
          borderWidth: 2,
        }
      ]
    };
  };

  // Doughnut chart data for today's completion
  const doughnutData = () => {
    const { completed, remaining } = getHabitCompletionData();
    
    return {
      labels: ['Completed', 'Remaining'],
      datasets: [
        {
          data: [completed, remaining],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: ['#16a34a', '#dc2626'],
          borderWidth: 2,
        }
      ]
    };
  };

  // Get stats for selected period
  const getStats = () => {
    const currentDay = getCurrentDay();
    const todayRate = calculateSuccessRate("today");
    const weeklyRate = calculateSuccessRate("week");
    
    return {
      totalHabits: habits.length,
      todayCompleted: habits.filter(habit => habit.history[currentDay]).length,
      todayRate,
      weeklyRate,
    };
  };

  const stats = getStats();

  if (!habits.length) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-4 ">Dashboard</h2>
        <p className="text-gray-600">Add some habits to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>

      {/* Period Selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'year', label: 'This Year' }
          ].map(period => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Habits</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalHabits}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Today Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.todayCompleted}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Rate</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.todayRate}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Weekly Rate</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.weeklyRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Today's Completion Doughnut Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Today's Progress</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut 
              data={doughnutData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.label}: ${context.parsed} habits`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Weekly Progress Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Weekly Overview</h3>
          <div className="h-64">
            <Bar 
              data={getWeeklyProgressData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Completion: ${context.parsed.y}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Individual Habit Performance */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center">Individual Habit Performance</h3>
          <div className="h-64">
            <Bar 
              data={getIndividualHabitData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `Weekly completion: ${context.parsed.x}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Habit Details Table */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Habit Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Habit Name</th>
                <th className="text-center p-2">Mon</th>
                <th className="text-center p-2">Tue</th>
                <th className="text-center p-2">Wed</th>
                <th className="text-center p-2">Thu</th>
                <th className="text-center p-2">Fri</th>
                <th className="text-center p-2">Sat</th>
                <th className="text-center p-2">Sun</th>
                <th className="text-center p-2">Weekly Rate</th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, index) => {
                const days = Object.keys(habit.history);
                const completed = days.filter(day => habit.history[day]).length;
                const rate = Math.round((completed / days.length) * 100);
                
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{habit.name}</td>
                    {days.map(day => (
                      <td key={day} className="text-center p-2">
                        <span className={`inline-block w-4 h-4 rounded-full ${
                          habit.history[day] ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                      </td>
                    ))}
                    <td className="text-center p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rate >= 80 ? 'bg-green-100 text-green-800' :
                        rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Motivational Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold mb-2">Keep Going! 🚀</h3>
        <p className="text-blue-100">
          {stats.todayRate === 100 ? 
            "Perfect day! You've completed all your habits today!" :
            stats.todayRate >= 75 ?
            "Great progress! You're doing amazing!" :
            stats.todayRate >= 50 ?
            "Good job! Keep pushing forward!" :
            "Every step counts! You can do this!"
          }
        </p>
      </div>
    </div>
  );
};

export default Dashboard;