
import React, { useEffect, useState, useMemo } from 'react';
import { getCourses } from '../services/apiService';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { AcademicCapIcon, FunnelIcon, MagnifyingGlassIcon } from '../components/icons/Icons';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamically generate filter options
  const categories = useMemo(() => ['All', ...new Set(courses.map(c => c.category))], [courses]);
  const levels = useMemo(() => ['All', 'Beginner', 'Intermediate', 'Advanced'], []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const allCourses = await getCourses();
      setCourses(allCourses);
      setFilteredCourses(allCourses);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // Apply filters whenever filter states or the master course list change
  useEffect(() => {
    let result = courses;

    // Filter by search term (title and description)
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(lowercasedTerm) ||
        course.description.toLowerCase().includes(lowercasedTerm)
      );
    }

    // Filter by level
    if (selectedLevel !== 'All') {
      result = result.filter(course => course.level === selectedLevel);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(result);
  }, [searchTerm, selectedLevel, selectedCategory, courses]);
  
  const handleResetFilters = () => {
      setSearchTerm('');
      setSelectedLevel('All');
      setSelectedCategory('All');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Our Course Catalog</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Find the right course to accelerate your automotive career.</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                {/* Search Input */}
                <div className="lg:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search Course</label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="e.g., Engine Diagnostics"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                        />
                    </div>
                </div>
                {/* Level Filter */}
                <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
                    <select id="level" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {levels.map(level => <option key={level}>{level}</option>)}
                    </select>
                </div>
                {/* Category Filter */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {categories.map(category => <option key={category}>{category}</option>)}
                    </select>
                </div>
            </div>
             <div className="mt-4 flex justify-end">
                <button onClick={handleResetFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Reset Filters
                </button>
            </div>
        </div>
        
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">Loading courses...</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FunnelIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Courses Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
