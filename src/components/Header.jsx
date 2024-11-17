import React from 'react';
import { RxAvatar } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoSearch } from "react-icons/io5";
import logo from '/logo.jpg';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <header className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Link to={'/'}>
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain transition-transform transform hover:scale-105" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg max-w-lg w-full">
        <IoSearch size={20} className="text-gray-600" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="ml-2 w-full text-gray-700 outline-none bg-transparent"
        />
      </div>

      {/* Navigation and Profile/Sign-In Section */}
      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6">
          <Link to="/" className="text-lg font-medium hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/about" className="text-lg font-medium hover:text-gray-200 transition-colors">About</Link>
          <Link to="/contact" className="text-lg font-medium hover:text-gray-200 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Notifications Icon (Placeholder for more icons) */}
         
          
          {/* Profile Avatar or Sign-In */}
          <Link to="/profile" className="relative">
            {currentUser ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
            ) : (
              <span className="text-lg font-medium hover:text-gray-200 transition-colors">Sign in</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
