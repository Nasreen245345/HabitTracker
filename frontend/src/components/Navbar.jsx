import React, { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue1 font-inter shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1 className="text-customWhite font-bold text-lg">Habit Tracker</h1>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-customWhite hover:underline">
            Dashboard
          </a>
          <a href="#" className="text-customWhite hover:underline">
            Logout
          </a>
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
          <a href="#" className="block text-customWhite hover:underline">
            Dashboard
          </a>
          <a href="#" className="block text-customWhite hover:underline">
            Logout
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
