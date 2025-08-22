import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_URL;
class HabitAPI {
  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllHabits() {
    try {
      const response = await axios.get(`${API_BASE_URL}/habits`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching habits:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  async createHabit(habitData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/habits`, habitData, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async toggleHabitDay(id, day, date) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/habits/${id}/toggle`,
        { day, date },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling habit day:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }

  async deleteHabit(id) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/habits/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting habit:", error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
}

export default new HabitAPI();
