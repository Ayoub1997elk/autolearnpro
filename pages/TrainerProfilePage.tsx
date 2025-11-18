import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
<<<<<<< HEAD
import { getTrainerById, getCourses } from '../services/mockApiService';
=======
import { getTrainerById, getCourses } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { User, Course } from '../types';
import CourseCard from '../components/CourseCard';
import { UserIcon, BookOpenIcon } from '../components/icons/Icons';

const TrainerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          const trainerId = parseInt(id, 10);
          const [fetchedTrainer, allCourses] = await Promise.all([
            getTrainerById(trainerId),
            getCourses()
          ]);
          
          setTrainer(fetchedTrainer);
          if (fetchedTrainer) {
            const trainerCourses = allCourses.filter(course => course.trainerId === fetchedTrainer.id);
            setCourses(trainerCourses);
          }
        } catch (error) {
          console.error("Failed to fetch trainer data:", error);
          setTrainer(null); // Ensure trainer is null on error
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Loading trainer profile...</div>;
  }

  if (!trainer) {
    return <div className="text-center py-20">Trainer not found.</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-12 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <UserIcon className="w-20 h-20 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{trainer.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold mt-1">Automotive Trainer</p>
            <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
              {trainer.bio || "This trainer has not yet provided a biography."}
            </p>
          </div>
        </div>

        {/* Courses by Trainer */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-500" />
            Courses by {trainer.name}
          </h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">This trainer has not published any courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfilePage;
