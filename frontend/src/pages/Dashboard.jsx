import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {useAuth} from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import habitApi from "../services/HabitApi";
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
  const [dashboardData, setDashboardData] = useState([]);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user}=useAuth()
  const navigate = useNavigate();
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [period]);
const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // const response = await habitApi.getAllHabits();
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = response
      console.log(data)
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDashboardData([]);
    } finally {
      setLoading(false);
    }
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
        backgroundColor: ['#4ECDC4', '#E8E8E8'],
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
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

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
            return `Success Rate: ${context.parsed.x.toFixed(1)}%`;
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
          callback: function(value) {
            return value + '%';
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-inter">Habits Dashboard</h1>
          <div className="flex space-x-2">
            {['today', 'weekly', 'monthly', 'yearly'].map((periodOption) => (
              <button
                key={periodOption}
                onClick={() => setPeriod(periodOption)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  period === periodOption
                    ? 'bg-blue1 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {periodOption}
              </button>
            ))}
          </div>
        </div>

        {error && dashboardData.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-medium">Using demo data</p>
            <p className="text-sm">Could not connect to API: {error}</p>
          </div>
        )}

        {/* No Habits State */}
        {dashboardData.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Habits Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start building better habits by adding your first habit. Track your progress and build streaks to achieve your goals.
            </p>
            <button 
              onClick={() => {
                navigate("/tracker")
              }}
              className="inline-flex items-center px-6 py-3 bg-blue1 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Habit
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Success Rate</p>
                <p className="text-3xl font-bold text-green-600">{avgSuccessRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Streak</p>
                <p className="text-3xl font-bold text-orange-600">{totalStreak}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Habits</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Details - Only show when there's data */}
        {dashboardData.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Doughnut Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Progress</h2>
                <div className="relative h-64 flex items-center justify-center">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{avgSuccessRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Habits Performance */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Individual Habit Performance</h2>
                <div className="h-64">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>

            {/* Habit Details */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Habit Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Habit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">This Week</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
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
                          <div className="flex space-x-1">
                            {habit.data.map((day, dayIndex) => (
                              <div 
                                key={dayIndex}
                                className={`w-4 h-4 rounded-sm ${
                                  day === 1 ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                                title={`${habit.labels[dayIndex]}: ${day === 1 ? 'Completed' : 'Not completed'}`}
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
