
import React from 'react';
import { LogoIcon } from './icons/Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <LogoIcon className="h-10" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AutoLearnPro</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} AutoLearnPro. All rights reserved.</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Your #1 source for automotive expertise.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;