
import React from 'react';
<<<<<<< HEAD
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
=======
import { Link, NavLink, useNavigate } from 'react-router-dom';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon, AcademicCapIcon } from './icons/Icons';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();
  const isHomePage = location.pathname === '/';
=======
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)

  const handleLogout = () => {
    logout();
    navigate('/');
  };
<<<<<<< HEAD
  
  const navLinkClasses = "text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200";
  const activeNavLinkClasses = "text-blue-600 dark:text-blue-400 font-semibold";

  // FIX: Added a click handler to manually handle smooth scrolling for anchor links,
  // preventing conflicts with the HashRouter.
  const handleScrollLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const targetId = event.currentTarget.getAttribute('href')?.substring(1);
    if (targetId) {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

=======
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white">
              <LogoIcon className="h-10" />
              <span>AutoLearnPro</span>
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
<<<<<<< HEAD
            <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
            
            {isHomePage && (
              <>
                <a href="#features" onClick={handleScrollLinkClick} className={navLinkClasses}>Features</a>
                <a href="#testimonials" onClick={handleScrollLinkClick} className={navLinkClasses}>Testimonials</a>
                <a href="#contact" onClick={handleScrollLinkClick} className={navLinkClasses}>Contact</a>
              </>
            )}

             {isAuthenticated && user?.role === UserRole.TRAINER && (
                <NavLink to="/image-generator" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Image Generator</NavLink>
=======
            <NavLink to="/" className={({ isActive }) => `text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}>Home</NavLink>
            <NavLink to="/courses" className={({ isActive }) => `text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}>Courses</NavLink>
             {isAuthenticated && user?.role === UserRole.TRAINER && (
                <>
                  <NavLink to="/image-generator" className={({ isActive }) => `text-gray-500 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}>Image Generator</NavLink>
                </>
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
            )}
          </nav>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                 <span className="text-gray-700 dark:text-gray-300 hidden sm:block">Welcome, {user?.name}</span>
                 <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">Dashboard</Link>
                 <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2">
                <AcademicCapIcon className="h-5 w-5" />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;