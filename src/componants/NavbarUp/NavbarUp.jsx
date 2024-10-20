import React, { useState } from "react";

const NavbarUp = () => {
  // State for toggling mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-teal-500">ZeptoBook</div>

          {/* Navbar Links (Hidden on small screens) */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="nav-item text-gray-700">
              Home
            </a>
            <a href="#books" className="nav-item text-gray-700">
              Books
            </a>
            <a href="#contact" className="nav-item text-gray-700">
              Contact
            </a>
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (Hidden by default, visible when state is true) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white space-y-2 p-4">
            <a href="#home" className="block nav-item text-gray-700">
              Home
            </a>
            <a href="#books" className="block nav-item text-gray-700">
              Books
            </a>
            <a href="#contact" className="block nav-item text-gray-700">
              Contact
            </a>
          </div>
        )}
      </div>

      {/* Navbar hover animation */}
      <style jsx>{`
        .nav-item {
          position: relative;
          padding: 0.5rem;
          margin-right: 1rem;
          font-weight: 500;
          text-transform: uppercase;
          transition: color 0.3s ease-in-out;
        }

        .nav-item::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          left: 0;
          bottom: -3px;
          background-color: #00adb5; /* Highlight color */
          transition: width 0.4s ease;
        }

        .nav-item:hover::after {
          width: 100%;
        }

        .nav-item:hover {
          color: #00adb5;
        }
      `}</style>
    </nav>
  );
};

export default NavbarUp;
