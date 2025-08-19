import React, { useState } from "react";
import {Link} from 'react-router-dom'
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue1 font-inter shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1 className="text-customWhite font-bold text-lg">Habit Tracker</h1>
        <div className="hidden md:flex space-x-6">
          <Link to='/dashboard' className="text-customWhite font-inter hover:underline">
            Dashboard
          </Link>
          <Link to="/tracker" className="text-customWhite font-inter hover:underline">
            Tracker
          </Link>
          <Link to="login" className="text-customWhite font-inter hover:underline">Logout</Link>
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
          <Link to="/dashboard" className="block text-customWhite hover:underline">
            Dashboard
          </Link>
          <Link to="login" className="block text-customWhite hover:underline">
            Login
          </Link>
          <Link to="login" className="">Logout</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
