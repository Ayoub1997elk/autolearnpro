import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { getAnalyticsData } from '../services/mockApiService';
=======
import { getAnalyticsData } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { AnalyticsData } from '../types';
// Fix: Imported BookOpenIcon to resolve reference error.
import { ChartPieIcon, UsersIcon, AcademicCapIcon, UserGroupIcon, BookOpenIcon } from '../components/icons/Icons';
import StatCard from '../components/StatCard';
import BarChart from '../components/BarChart';

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading Analytics...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">{error}</div>;
  }

  if (!analytics) {
    return <div className="text-center p-10">No analytics data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center space-x-4">
        <ChartPieIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Platform Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">An overview of platform engagement and content performance.</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value={analytics.totalUsers} icon={<UsersIcon className="w-8 h-8 text-blue-500" />} />
        <StatCard title="Total Learners" value={analytics.totalLearners} icon={<AcademicCapIcon className="w-8 h-8 text-green-500" />} />
        <StatCard title="Total Trainers" value={analytics.totalTrainers} icon={<UserGroupIcon className="w-8 h-8 text-purple-500" />} />
        <StatCard title="Total Courses" value={analytics.totalCourses} icon={<BookOpenIcon className="w-8 h-8 text-yellow-500" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart 
            title="Most Popular Courses (by Enrollment)" 
            data={analytics.coursePopularity} 
            unit="enrollments"
        />
        <BarChart 
            title="Course Completion Rates" 
            data={analytics.completionRates}
            unit="%"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;