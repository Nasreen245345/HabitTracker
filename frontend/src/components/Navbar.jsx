import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
    console.log(user)
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue1 font-inter shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1 className="text-customWhite font-bold text-lg">Habit Tracker</h1>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className="text-customWhite font-inter hover:underline"
          >
            Dashboard
          </Link>

          {user ? (
            <>
            <Link
                to="/tracker"
                className="text-customWhite font-inter hover:underline"
              >
                Tracker
              </Link>
              <span className="font-inter text-customWhite">Welcome, {user.name}</span>
              <button className="font-inter text-customWhite hover:underline" onClick={logout}>Logout</button>
              
              
            </>
          ) :(
            navigate('/login')
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-customWhite focus:outline-none"
        >
          ☰
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-blue1 px-4 pb-4 space-y-2">
          <Link
            to="/dashboard"
            className="block text-customWhite hover:underline"
          >
            Dashboard
          </Link>
          {user && (
            <>
              <Link
                to="/tracker"
                className="block text-customWhite hover:underline"
              >
                Tracker
              </Link>
              <span className="block text-customWhite">
                Welcome, {user.name}
              </span>
              <button onClick={logout} className="block text-customWhite">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
