import React, { useEffect, useState } from 'react';
import { User, TrainerAnalyticsData } from '../types';
<<<<<<< HEAD
import { getTrainerAnalyticsData } from '../services/mockApiService';
=======
import { getTrainerAnalyticsData } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { generateTrainerInsights } from '../services/geminiService';
import StatCard from './StatCard';
import BarChart from './BarChart';
import { ChartPieIcon, BookOpenIcon, UsersIcon, CheckCircleIcon, LightBulbIcon } from './icons/Icons';

interface TrainerAnalyticsProps {
  trainer: User;
}

const TrainerAnalytics: React.FC<TrainerAnalyticsProps> = ({ trainer }) => {
  const [analytics, setAnalytics] = useState<TrainerAnalyticsData | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTrainerAnalyticsData(trainer.id);
        setAnalytics(data);
        if (data && (data.totalEnrollments > 0 || data.lessonDropOffs.length > 0)) {
            const aiInsights = await generateTrainerInsights(data, trainer.name);
            setInsights(aiInsights);
        }
      } catch (error) {
        console.error("Failed to load trainer analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trainer.id, trainer.name]);

  if (loading) {
    return <div className="text-center p-8">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="text-center p-8">Could not load analytics data.</div>;
  }
  
  if (analytics.totalCourses === 0) {
      return <div className="text-center p-8">You haven't created any courses yet. No analytics to display.</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center"><ChartPieIcon className="h-6 w-6 mr-2" />My Analytics</h2>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Courses" value={analytics.totalCourses} icon={<BookOpenIcon className="w-8 h-8 text-blue-500" />} />
        <StatCard title="Total Enrollments" value={analytics.totalEnrollments} icon={<UsersIcon className="w-8 h-8 text-green-500" />} />
        <StatCard title="Avg. Completion Rate" value={`${analytics.avgCompletionRate.toFixed(1)}%`} icon={<CheckCircleIcon className="w-8 h-8 text-purple-500" />} />
      </div>

      {/* AI Insights */}
      {insights && (
          <div className="bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-500 p-6 rounded-r-lg">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><LightBulbIcon className="h-6 w-6 mr-2 text-blue-500" /> AI-Powered Insights</h3>
               <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: insights.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
      )}

      {/* Charts */}
      <div>
        <BarChart 
            title="Lesson Drop-off Points" 
            data={analytics.lessonDropOffs} 
            unit="learners"
        />
      </div>
    </div>
  );
};

export default TrainerAnalytics;