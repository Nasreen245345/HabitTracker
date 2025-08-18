import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Signup successful!");
        localStorage.setItem("token", data.token);
        navigate("/login"); // go to login after signup
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-customWhite w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 mx-auto flex flex-col justify-center rounded-lg gap-4 py-6 px-6 shadow-lg">
        <div className="text-center text-black font-bold text-2xl">Habit Tracker</div>
        <div className="text-center text-sm text-black">Welcome to Habit Tracker</div>

        <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required placeholder="Enter name" />

          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter email" />

          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Enter password" />

          <button type="submit" className="bg-blue1 text-white py-2 rounded-md">Sign Up</button>
        </form>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue1 font-bold hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
