import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class HabitApi {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get all habits 
  async getAllHabits() {
    try {
      const response = await this.axiosInstance.get('/habits');
      return response.data;
    } catch (error) {
      console.error("Error fetching habits:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to fetch habits');
    }
  }

  // Create a new habit
  async createHabit(habitData) {
    try {
      const response = await this.axiosInstance.post('/habits', habitData);
      return response.data;
    } catch (error) {
      console.error("Error creating habit:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to create habit');
    }
  }

  // Toggle habit completion for a specific date
  async toggleHabitCompletion(habitId, date) {
    try {
      const response = await this.axiosInstance.patch(
        `/habits/${habitId}/toggle-date`,
        { date } 
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling habit completion:", error.response?.data || error.message);
      
      // Handle different error types
      if (error.response) {
        throw new Error(error.response.data?.message || error.response.data?.error || 'Server error');
      } else if (error.request) {
        throw new Error('Network error - no response from server');
      } else {
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  }

  // Delete a habit
  async deleteHabit(habitId) {
    try {
      const response = await this.axiosInstance.delete(`/habits/${habitId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting habit:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to delete habit');
    }
  }
}

export default new HabitApi();