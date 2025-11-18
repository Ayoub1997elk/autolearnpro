import React from 'react';

interface ProgressBarProps {
  value: number; // A percentage from 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  const progress = Math.max(0, Math.min(100, value)); // Clamp value between 0 and 100

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
