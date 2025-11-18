<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Course, User } from '../types';
import { getCourses, getUsers } from '../services/mockApiService';
=======
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Course, User } from '../types';
import { getCourses, getUsers } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import CourseCard from '../components/CourseCard';
import { UserIcon, BookOpenIcon, CogIcon, PlusIcon, SparklesIcon, UsersIcon, ArrowRightIcon, ChartPieIcon, FireIcon, ShieldCheckIcon, TrophyIcon, AcademicCapIcon } from '../components/icons/Icons';
import { useNavigate, Link } from 'react-router-dom';
import { generateCourseRecommendations } from '../services/geminiService';
import BadgeIcon from '../components/BadgeIcon';
import TrainerAnalytics from '../components/TrainerAnalytics';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState('users');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setUsers(await getUsers());
            setCourses(await getCourses());
        };
        fetchData();
    }, []);

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('users')} className={`${activeTab === 'users' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}><UsersIcon className="h-5 w-5 mr-2" />User Management</button>
                    <button onClick={() => setActiveTab('courses')} className={`${activeTab === 'courses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}><BookOpenIcon className="h-5 w-5 mr-2" />Course Management</button>
                    <button onClick={() => navigate('/analytics')} className={`${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}><ChartPieIcon className="h-5 w-5 mr-2" />Analytics</button>
                </nav>
            </div>

            {activeTab === 'users' && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><UsersIcon className="h-6 w-6 mr-2" />User Management</h2>
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Enrolled Courses</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{user.role}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.enrolledCourseIds.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {activeTab === 'courses' && (
                <div>
                     <h2 className="text-2xl font-bold my-6 flex items-center"><BookOpenIcon className="h-6 w-6 mr-2" />Course Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => <CourseCard key={course.id} course={course} />)}
                    </div>
                </div>
            )}
        </div>
    );
};

const TrainerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState('myCourses');
    
    useEffect(() => {
        const fetchCourses = async () => {
            const allCourses = await getCourses();
            if(user && user.createdCourseIds) {
                setMyCourses(allCourses.filter(c => user.createdCourseIds?.includes(c.id)));
            }
            if(user) {
                setEnrolledCourses(allCourses.filter(c => user.enrolledCourseIds.includes(c.id)));
            }
        };
        fetchCourses();
    }, [user]);

    const calculateProgress = (course: Course) => {
        if (!user?.progress || !user.progress[course.id]) {
            return 0;
        }
        const completedCount = user.progress[course.id].length;
        const totalLessons = course.lessons.length;
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    };
    
    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('myCourses')} className={`${activeTab === 'myCourses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Created Courses</button>
                    <button onClick={() => setActiveTab('createCourse')} className={`${activeTab === 'createCourse' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Create New Course</button>
                    <button onClick={() => setActiveTab('analytics')} className={`${activeTab === 'analytics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Analytics</button>
                    <button onClick={() => setActiveTab('myEnrollments')} className={`${activeTab === 'myEnrollments' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Enrollments</button>
                </nav>
            </div>

            {activeTab === 'myCourses' && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><BookOpenIcon className="h-6 w-6 mr-2" />My Created Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.length > 0 ? myCourses.map(course => <CourseCard key={course.id} course={course} />) : <p>You haven't created any courses yet.</p>}
                    </div>
                </div>
            )}
             {activeTab === 'createCourse' && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><PlusIcon className="h-6 w-6 mr-2" />Create New Course</h2>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                        <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-blue-500"/>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Launch the Course Editor</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-lg mx-auto">Use our powerful, slide-based editor to build your next course from scratch. Manage lessons, content, and details all in one place.</p>
                         <button 
                            onClick={() => navigate('/create-course')} 
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                         >
                            <span>Open Editor</span>
                            <ArrowRightIcon className="h-5 w-5 ml-2"/>
                         </button>
                    </div>
                </div>
            )}
            {activeTab === 'analytics' && user && (
                <TrainerAnalytics trainer={user} />
            )}
            {activeTab === 'myEnrollments' && (
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><BookOpenIcon className="h-6 w-6 mr-2" />My Enrollments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.length > 0 ? enrolledCourses.map(course => <CourseCard key={course.id} course={course} progressPercent={calculateProgress(course)} />) : <p>You are not enrolled in any courses.</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

const Recommendations: React.FC<{user: User}> = ({ user }) => {
    const [recommendations, setRecommendations] = useState<{ course: Course, justification: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecs = async () => {
            setLoading(true);
            try {
                const allCourses = await getCourses();
                const result = await generateCourseRecommendations(user, allCourses);
                const recsWithDetails = result.recommendations
                    .map(rec => ({
                        course: allCourses.find(c => c.id === rec.courseId),
                        justification: rec.justification
                    }))
                    .filter(item => item.course) as { course: Course, justification: string }[];
                setRecommendations(recsWithDetails);
            } catch (error) {
                console.error("Failed to get recommendations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecs();
    }, [user]);

    if (loading) {
        return <div className="text-center p-4">Loading recommendations...</div>;
    }

    if (recommendations.length === 0) {
        return <p>No recommendations available right now. Keep learning!</p>;
    }

    return (
        <div className="space-y-4">
            {recommendations.map(({ course, justification }) => (
                <div key={course.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex items-start space-x-4">
                    <img src={course.imageUrl} alt={course.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{course.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic my-1">"{justification}"</p>
                        <Link to={`/course/${course.id}`} className="text-sm font-semibold text-blue-600 hover:underline">View Course &rarr;</Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

const LearnerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    
    useEffect(() => {
        const fetchCourses = async () => {
            const allCourses = await getCourses();
            if(user) {
                setEnrolledCourses(allCourses.filter(c => user.enrolledCourseIds.includes(c.id)));
            }
        };
        fetchCourses();
    }, [user]);
    
    const calculateProgress = (course: Course) => {
        if (!user?.progress || !user.progress[course.id]) {
            return 0;
        }
        const completedCount = user.progress[course.id].length;
        const totalLessons = course.lessons.length;
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6 flex items-center"><BookOpenIcon className="h-6 w-6 mr-2" />My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<<<<<<< HEAD
                    {enrolledCourses.length > 0 ? enrolledCourses.map(course => <CourseCard key={course.id} course={course} progressPercent={calculateProgress(course)} />) : <p>You are not enrolled in any courses yet.</p>}
=======
                    {enrolledCourses.length > 0 ? enrolledCourses.map(course => <CourseCard key={course.id} course={course} progressPercent={calculateProgress(course)} />) : <p>You are not enrolled in any courses yet. <a href="#/courses" className="text-blue-500 hover:underline">Explore courses</a>.</p>}
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
                </div>
            </div>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><SparklesIcon className="h-6 w-6 mr-2" />Recommended For You</h2>
                    {user && <Recommendations user={user} />}
                </div>
                <div>
                     <h2 className="text-2xl font-bold mb-6 flex items-center"><TrophyIcon className="h-6 w-6 mr-2" />My Achievements</h2>
                     <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                                <FireIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{user?.learningStreak?.current || 0} Day Streak</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Keep the fire burning!</p>
                            </div>
                        </div>
                        {user?.badges && user.badges.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h4 className="font-semibold mb-2 dark:text-gray-200">Badges Earned</h4>
                                <div className="flex flex-wrap gap-4">
                                    {user.badges.map(badge => <BadgeIcon key={badge.id} badge={badge} />)}
                                </div>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.TRAINER:
        return <TrainerDashboard />;
      case UserRole.LEARNER:
        return <LearnerDashboard />;
      default:
        return <p>Loading dashboard...</p>;
    }
  };
  
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return <CogIcon className="w-8 h-8"/>;
      case UserRole.TRAINER: return <UserIcon className="w-8 h-8"/>;
      case UserRole.LEARNER: return <BookOpenIcon className="w-8 h-8"/>;
      default: return null;
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center space-x-4">
            {user && getRoleIcon(user.role)}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">Welcome back, {user?.name}! You are logged in as a {user?.role}.</p>
            </div>
        </div>
        
        {renderDashboard()}
    </div>
  );
};

export default DashboardPage;