import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { ClockIcon, UserIcon, ChartBarIcon } from './icons/Icons';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
  progressPercent?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progressPercent }) => {
  const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const showProgress = typeof progressPercent === 'number' && progressPercent >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      <Link to={`/course/${course.id}`} className="block flex flex-col flex-grow">
        <div className="relative">
          <img className="w-full h-48 object-cover" src={course.imageUrl} alt={course.title} />
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs font-semibold rounded-bl-lg">
            {course.category}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{course.description}</p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4" />
              <Link 
                to={`/trainer/${course.trainerId}`} 
                onClick={(e) => e.stopPropagation()} 
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                {course.trainerName}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4"/>
                <span>{course.level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4" />
              <span>{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
            </div>
          </div>
        </div>
      </Link>
      {showProgress && (
        <div className="px-6 pb-4">
            <ProgressBar value={progressPercent} />
        </div>
      )}
    </div>
  );
};

export default CourseCard;