import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import {useTheme} from '../context/ThemeContext'
import {Sun,Moon} from 'lucide-react'
const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
   const {theme,toggleTheme}=useTheme()
    // const isDrak=theme==='Dark'
  if (!user) {
    navigate("/login"); // redirect if user is not logged in
  }
  return (
    <nav className={`fixed top-0 left-0 right-0 bg-blue1 font-inter shadow-md py-1 sm:py-2 ${
          theme === 'dark'
            ? 'bg-gray-900/80 border-gray-700 shadow-sm backdrop-blur-sm'
            : 'bg-blue1 border-gray-200 shadow-sm backdrop-blur-sm'
        }`}>
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1 className={`font-bold text-2xl ${
          theme === 'dark'
            ? 'text-customWhite'
            : 'text-customWhite'
        }`}>Habit Tracker</h1>
       <div className={`flex items-center gap-5`}>
        <button onClick={toggleTheme} className="bg-gray-50 transition-all rounded-full flex items-center justify-center w-8 h-8 duration-300 hover:bg-gray-600 dark:hover:bg-gray-700" aria-label="Toggle Theme">
      {theme==='dark'?(
        <Moon className="w-5 h-4 text-white-800"/>
        
      ):(
        <Sun className="w-10 h-4 text-yellow-800"/>
      )
      }
        </button>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/dashboard"
            className={` text-lg font-inter hover:underline ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}
          >
            Dashboard
          </Link>
          <Link
                to="/tracker"
                className={`font-inter hover:underline text-lg ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}
              >
                Tracker
              </Link>
{user ? (
  <>
    <button
      className={`font-inter text-lg hover:underline ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}
      onClick={logout}
    >
      Logout
    </button>
  </>
) : (
  <Navigate to="/login" />
)}
        </div>

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
        <div className={`md:hidden  px-4 pb-4 space-y-2 ${
          theme === 'dark'
            ? 'bg-gray-900/80'
            :'bg-blue1'
        }`}>
          <Link
            to="/dashboard"
            className={`block hover:underline ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}
          >
            Dashboard
          </Link>
          <Link
                to="/tracker"
                className={`block hover:underline ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}
              >
                Tracker
              </Link>
          {user ? (
            <>
              
              <button onClick={logout} className={`block  ${
          theme === 'dark'
            ? 'text-customWhite'
            :'text-customWhite'
        }`}>
                Logout
              </button>
            </>
          ):(
            navigate("/login")
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
