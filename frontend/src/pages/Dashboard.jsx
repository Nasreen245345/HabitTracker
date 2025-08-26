import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {useAuth} from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import habitApi from "../services/HabitApi";
import {useTheme} from '../context/ThemeContext'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HabitDashboard = () => {
  const [habits, setHabits] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {theme}=useTheme()
  const isDrak=theme==='Dark'
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    fetchHabitsData();
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      processDashboardData();
    }
  }, [habits, period]);

  const fetchHabitsData = async () => {
    try {
      setLoading(true);
      const response = await habitApi.getAllHabits();
      setHabits(response);
      setError(null);
    } catch (err) {
      setError(err.message);
      setHabits([]);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };
  const getDateRange = () => {
    const today = new Date();
    const dates = [];
    
    switch (period) {
      case 'today':
        dates.push(new Date(today));
        break;
      case 'weekly':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
        break;
      case 'monthly':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
        break;
      case 'yearly':
        for (let i = 364; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
        break;
      default:
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date);
        }
    }
    
    return dates;
  };

  // Calculate current streak for a habit
  const calculateCurrentStreak = (habit) => {
    if (!habit.completedDates || habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates.sort().reverse();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const checkDateStr = formatDate(checkDate);
      
      if (sortedDates.includes(checkDateStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  // Calculate success rate for a habit in the given period
  const calculateSuccessRate = (habit, dateRange) => {
    if (dateRange.length === 0) return 0;
    let completedCount = 0;
    dateRange.forEach(date => {
      const dateStr = formatDate(date);
      if (habit.completedDates && habit.completedDates.includes(dateStr)) {
        completedCount++;
      }
    });
    
    return (completedCount / dateRange.length) * 100;
  };

  // Get completion data for chart display
  const getCompletionData = (habit, dateRange) => {
    return dateRange.map(date => {
      const dateStr = formatDate(date);
      return habit.completedDates && habit.completedDates.includes(dateStr) ? 1 : 0;
    });
  };

  // Get labels for the date range
  const getLabels = (dateRange) => {
    return dateRange.map(date => {
      switch (period) {
        case 'today':
          return 'Today';
        case 'weekly':
          return date.toLocaleDateString('en', { weekday: 'short' });
        case 'monthly':
          return date.toLocaleDateString('en', { day: 'numeric' });
        case 'yearly':
          return date.toLocaleDateString('en', { month: 'short' });
        default:
          return date.toLocaleDateString('en', { weekday: 'short' });
      }
    });
  };

  // Process habits data into dashboard format
  const processDashboardData = () => {
    const dateRange = getDateRange();
    const labels = getLabels(dateRange);
    
    const processedData = habits.map(habit => {
      const successRate = calculateSuccessRate(habit, dateRange);
      const streak = calculateCurrentStreak(habit);
      const data = getCompletionData(habit, dateRange);
      
      return {
        habitId: habit._id,
        habitName: habit.name,
        successRate: successRate.toFixed(1),
        streak,
        data,
        labels,
        totalCompletions: habit.completedDates ? habit.completedDates.length : 0,
        createdAt: habit.createdAt
      };
    });
    
    setDashboardData(processedData);
  };

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (dashboardData.length === 0) return { avgSuccessRate: 0, totalStreak: 0, completedHabits: 0 };

    const avgSuccessRate = dashboardData.reduce((sum, habit) => sum + parseFloat(habit.successRate), 0) / dashboardData.length;
    const totalStreak = dashboardData.reduce((sum, habit) => sum + habit.streak, 0);
    const completedHabits = dashboardData.filter(habit => {
      const todayComplete = habit.data[habit.data.length - 1] === 1;
      return todayComplete;
    }).length;

    return { avgSuccessRate, totalStreak, completedHabits };
  };

  const { avgSuccessRate, totalStreak, completedHabits } = calculateOverallStats();

  // Doughnut chart data
  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [avgSuccessRate, 100 - avgSuccessRate],
        backgroundColor: [`${
          theme === 'dark'
            ? ' #16a34a'
            : '#1d87c3  '
        }`, '#E8E8E8'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      }
    },
  };
  // Horizontal bar chart data
  const barData = {
    labels: dashboardData.map(habit => habit.habitName),
    datasets: [
      {
        label: 'Success Rate (%)',
        data: dashboardData.map(habit => parseFloat(habit.successRate)),
        backgroundColor: dashboardData.map((_, index) => colors[index % colors.length]),
        borderRadius: 2,
        barThickness: 40,
      },
    ],
  };
const textColor = theme === 'dark' ? '#ffffff' : '#4b5563'
  const barOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Success Rate: ${context.parsed.x.toFixed(1)}% `;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#F3F4F6',
        },
        ticks: {
          color: textColor,
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
        color: textColor, // <-- define ticks.color for Y axis labels
      }
      },
    },
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
          theme === 'dark'
            ? 'bg-gray-900/80 '
            : 'bg-white/80'
        }`}>
        <div className={`animate-spin rounded-full h-32 w-32 border-b-2  ${
          theme === 'dark'
            ? 'border-white-600'
            : 'border-blue-600'
        }`}></div>
      </div>
    );
  }

  return (
    <div className={`p-6  min-h-screen mt-16 ${
          theme === 'dark'
            ? 'bg-gray-900/80 '
            : 'bg-white/80'
        }`}>
      <div className={`max-w-7xl mx-auto`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold  font-inter ${
          theme === 'dark'
            ? 'text-white '
            : 'text-blue1'
        }`}>Habits Dashboard</h1>
          <div className="flex space-x-2">
            {['today', 'weekly', 'monthly', 'yearly'].map((periodOption) => (
              <button
                key={periodOption}
                onClick={() => setPeriod(periodOption)}
                className={`
  px-4 py-2 rounded-lg capitalize transition-colors
  ${period === periodOption 
    ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-blue1 text-white')
    : (theme === 'dark' 
        ? 'bg-gray-900/80 text-white hover:bg-gray-800'
        : 'bg-white text-gray-600 hover:bg-gray-100')
  }
`}
              >
                {periodOption}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p className="font-medium">Error loading data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchHabitsData}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* No Habits State */}
        {dashboardData.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className={`text-2xl font-semibold  mb-2 ${theme==='dark'?'text-white':'text-gray-900'}`}>No Habits Yet</h3>
            <p className={` mb-8 max-w-md mx-auto ${theme==='dark'?'text-white':'text-gray-500'}`}>
              Start building better habits by adding your first habit. Track your progress and build streaks to achieve your goals.
            </p>
            <button 
              onClick={() => navigate("/tracker")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Habit
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {dashboardData.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className={` rounded-xl shadow-sm p-6 border  ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium  ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-600'
        }`}>Overall Success Rate</p>
                    <p className={`text-3xl font-bold  ${
          theme === 'dark'
            ? 'text-green-600'
            : 'text-blue1'
        }`}>{avgSuccessRate.toFixed(1)}%</p>
                    <p className={`text-xs  mt-1 ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-500'
        }`}>
                      {period === 'today' ? 'Today' : `Past ${period}`}
                    </p>
                  </div>
                  
                </div>
              </div>

              <div className={` rounded-xl shadow-sm p-6 border border-gray-200 ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium  ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-60'
        }`}>Total Streak Days</p>
                    <p className="text-3xl font-bold text-orange-600">{totalStreak}</p>
                    <p className={`text-xs  mt-1 ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-500'
        }`}>
                      Across all habits
                    </p>
                  </div>
                  
                </div>
              </div>

              <div className={` rounded-xl shadow-sm p-6 border border-gray-200 ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium  ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-600'
        }`}>Active Habits</p>
                    <p className="text-3xl font-bold text-blue-600">{dashboardData.length}</p>
                    <p className={`text-xs  mt-1 ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-500'
        }`}>
                      {completedHabits} completed today
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Doughnut Chart */}
              <div className={` rounded-xl shadow-sm p-6 border ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
                <h2 className={`text-xl font-semibold  mb-6 ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-900 '
        }`}>Overall Progress</h2>
                <div className="relative h-64 flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className={`text-3xl font-bold  ${
          theme === 'dark'
            ? 'text-green-600 '
            : 'text-gray-900 '
        }`}>{avgSuccessRate.toFixed(1)}%</p>
                      <p className={`text-sm  ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-500 '
        }`}>Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Habits Performance */}
              <div className={` rounded-xl shadow-sm p-6 border  ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-800'
            : 'bg-white border-gray-200'
        }`}>
                <h2 className={`text-xl font-semibold  mb-6 ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-900 '
        }`}>Individual Habit Performance</h2>
                <div className="h-64">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>

            {/* Habit Details */}
         <div className={`mt-8  rounded-xl shadow-sm border  overflow-hidden ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-900 '
            : 'bg-white border-gray-200'
        }`}>
  <div className="p-6 border-b border-gray-200">
    <h2 className={`text-xl font-semibold  ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-900 '
        }`}>Habit Details</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className={` ${
          theme === 'dark'
            ? 'bg-gray-900/80 '
            : 'bg-gray-50'
        }`}>
        <tr>
          <th className={`px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-500'
        }`}>Habit</th>
          <th className={`px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-500'
        }`}>Current Streak</th>
          <th className={`px-6 py-3 text-left text-xs font-mediu uppercase tracking-wider ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-500'
        }`}>Success Rate</th>
          <th className={`px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-500'
        }`}>Total Completions</th>
          <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
          theme === 'dark'
            ? 'text-white '
            : 'text-gray-500'
        }`}>
            {period === 'today' ? 'Today' : `This ${period.slice(0, -2)}`}
          </th>
        </tr>
      </thead>
      <tbody className={` divide-y divide-gray-200 ${
          theme === 'dark'
            ? 'bg-gray-900/80 '
            : 'bg-gray-50'
        }`}>
        {dashboardData.map((habit, index) => (
          <tr key={habit.habitId} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <div className="text-sm font-medium text-gray-900">{habit.habitName}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {habit.streak} days
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{habit.successRate}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${habit.successRate}%` }}
                ></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className={`text-sm  ${
          theme === 'dark'
            ? 'text-white'
            : 'text-gray-900'
        }`}>{habit.totalCompletions}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className={`flex flex-wrap ${
                period === 'yearly' ? 'gap-1' : 'space-x-1'
              }`}>
                {habit.data.slice(
                  period === 'today' ? -1 : 
                  period === 'weekly' ? -7 : 
                  period === 'monthly' ? -30 :
                  period === 'yearly' ? -365 : -10
                ).map((day, dayIndex) => (
                  <div 
                    key={dayIndex}
                    className={`rounded-sm ${
                      day === 1 ? 'bg-green-500' : 'bg-gray-200'
                    } ${period === 'yearly' ? 'w-2 h-2' : 'w-4 h-4'}`}
                    title={`${habit.labels[dayIndex] || 'Day'}: ${day === 1 ? 'Completed' : 'Not completed'}`}
                  ></div>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
          </>
        )}
      </div>
    </div>
  );
};

export default HabitDashboard;