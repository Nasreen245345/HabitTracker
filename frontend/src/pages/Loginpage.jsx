import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext"
import { useEffect } from 'react';
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const {user,login}=useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // send login API request
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.user,data.token)
        navigate('/tracker')
        alert("Login successful!");
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-customWhite w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto flex flex-col justify-center rounded-lg gap-4 py-6 px-6 shadow-lg">

        <div className="text-center text-black font-bold text-2xl">Habit Tracker</div>
        <div className="text-center text-lg text-black">Welcome back to Habit Tracker</div>

        <form className="space-y-3 flex flex-col" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <button type="submit" className="bg-blue1 text-white py-2 rounded-md font-inter text-lg font-bold">Login</button>
        </form>

        <div className="text-center font-inter text-lg">
          Don't have an account?{" "}
          <button onClick={() => navigate("/signup")} className="text-blue1 font-inter text-lg font-bold hover:underline">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
