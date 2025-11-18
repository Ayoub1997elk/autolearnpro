import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { getCourseById } from '../services/mockApiService';
=======
import { getCourseById } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { Course, QuizQuestion } from '../types';
import { ClockIcon, UserIcon, ChartBarIcon, CheckCircleIcon, BookOpenIcon, PlayIcon, QuestionMarkCircleIcon, TrophyIcon, ChatBubbleLeftRightIcon } from '../components/icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import CourseSlidesViewer from '../components/CourseSlidesViewer';
import { generateQuiz } from '../services/geminiService';
import QuizModal from '../components/QuizModal';
import ProgressBar from '../components/ProgressBar';
import CertificateModal from '../components/CertificateModal';
import Forum from '../components/Forum';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { user, isAuthenticated, enrollInCourse } = useAuth();
  const navigate = useNavigate();
  const [isSlidesViewOpen, setIsSlidesViewOpen] = useState(false);
  
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('content');

  const courseId = Number(id);
  const isEnrolled = user?.enrolledCourseIds.includes(courseId);
  
  const completedLessons = user?.progress?.[courseId] || [];
  const progressPercent = course ? (completedLessons.length / course.lessons.length) * 100 : 0;
  const isCourseComplete = progressPercent === 100;

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        setLoading(true);
        const fetchedCourse = await getCourseById(parseInt(id, 10));
        setCourse(fetchedCourse);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
        navigate('/login');
        return;
    }
    if (!id) return;
    
    setIsEnrolling(true);
    try {
        await enrollInCourse(Number(id));
    } catch (error) {
        console.error('Failed to enroll', error);
        alert('An error occurred while enrolling. Please try again.');
    } finally {
        setIsEnrolling(false);
    }
  };

  const handleStartQuiz = async (type: 'knowledge' | 'pre-assessment') => {
    if (!course) return;
    setIsGeneratingQuiz(true);
    setQuizTitle(type === 'knowledge' ? course.title : `Pre-assessment: ${course.title}`);
    try {
        const content = course.lessons.map(l => `Title: ${l.title}\nContent: ${l.content}`).join('\n\n---\n\n');
        const questions = await generateQuiz(course.title, content);
        if (questions && questions.length > 0) {
            setQuizQuestions(questions);
            setIsQuizOpen(true);
        } else {
            alert("The AI couldn't generate a quiz for this course. Please try again later.");
        }
    } catch (error) {
        console.error("Failed to generate quiz", error);
        alert("An error occurred while generating the quiz. Please try again.");
    } finally {
        setIsGeneratingQuiz(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center py-20">Course not found.</div>;
  }

  const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

  const TabButton: React.FC<{tabName: string, label: string, icon: React.ReactNode}> = ({tabName, label, icon}) => (
      <button 
          onClick={() => setActiveTab(tabName)}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabName ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
      >
          {icon}
          <span>{label}</span>
      </button>
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-gray-800 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="text-blue-400 font-semibold mb-2">{course.category}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-5 h-5" />
                  <span>Created by <Link to={`/trainer/${course.trainerId}`} className="font-semibold hover:underline">{course.trainerName}</Link></span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5"/>
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>Approx. {Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Left Column: Course Content */}
            <div className="lg:col-span-2">
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="flex space-x-4 -mb-px">
                      <TabButton tabName="content" label="Content" icon={<BookOpenIcon className="w-5 h-5"/>} />
                      {isEnrolled && <TabButton tabName="discussion" label="Discussion" icon={<ChatBubbleLeftRightIcon className="w-5 h-5"/>} />}
                  </nav>
              </div>

              {activeTab === 'content' && (
                  <div>
                    {isEnrolled && (
                      <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Your Progress</h3>
                          <ProgressBar value={progressPercent} />
                          {isCourseComplete && (
                              <p className="text-green-600 dark:text-green-400 font-semibold mt-2">Congratulations, you've completed this course!</p>
                          )}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 my-8">
                      {isEnrolled && (
                          <>
                              <button 
                                  onClick={() => setIsSlidesViewOpen(true)}
                                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium transform hover:scale-105"
                              >
                                  <PlayIcon className="w-5 h-5 mr-2" />
                                  {progressPercent > 0 ? 'Continue Learning' : 'Start Learning'}
                              </button>
                              <button 
                                  onClick={() => handleStartQuiz('knowledge')}
                                  disabled={isGeneratingQuiz}
                                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 text-sm font-medium transform hover:scale-105 disabled:bg-purple-400 disabled:cursor-wait"
                              >
                                  <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                                  {isGeneratingQuiz ? 'Generating...' : 'Test My Knowledge'}
                              </button>
                              {isCourseComplete && (
                                  <button
                                      onClick={() => setIsCertificateOpen(true)}
                                      className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200 text-sm font-medium transform hover:scale-105"
                                  >
                                      <TrophyIcon className="w-5 h-5 mr-2"/>
                                      View Certificate
                                  </button>
                              )}
                          </>
                      )}
                    </div>
                    <div className="space-y-4">
                      {course.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                          <div className="flex items-center">
                            {isEnrolled && (
                              <CheckCircleIcon className={`w-5 h-5 mr-4 ${completedLessons.includes(lesson.id) ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}/>
                            )}
                            <span className="text-blue-500 font-bold mr-4">{index + 1}</span>
                            <p className="text-gray-800 dark:text-gray-200">{lesson.title}</p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {lesson.duration} min
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900 dark:text-white">Description</h2>
                      <p className="text-gray-700 dark:text-gray-300">{course.longDescription}</p>
                    </div>
                  </div>
              )}
              {activeTab === 'discussion' && isEnrolled && (
                  <Forum course={course} />
              )}
            </div>
            
            {/* Right Column: Enrollment Card */}
            <div className="mt-8 lg:mt-0">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <img src={course.imageUrl} alt={course.title} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Price: $199.99</h3>
                    {isEnrolled ? (
                        <button disabled className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md flex items-center justify-center space-x-2">
                          <CheckCircleIcon className="w-5 h-5"/>
                          <span>Enrolled</span>
                        </button>
                    ) : (
                      <>
                        <button 
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 disabled:bg-blue-400"
                        >
                          {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                        <button 
                            onClick={() => handleStartQuiz('pre-assessment')}
                            disabled={isGeneratingQuiz}
                            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium disabled:bg-gray-400 disabled:cursor-wait"
                        >
                            <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
                            {isGeneratingQuiz ? 'Generating...' : 'Take Pre-Assessment'}
                        </button>
                      </>
                    )}
                    <p className="text-xs text-center text-gray-400 mt-4">30-Day Money-Back Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isSlidesViewOpen && course && (
        <CourseSlidesViewer 
            courseId={course.id}
            lessons={course.lessons}
            courseTitle={course.title}
            onClose={() => setIsSlidesViewOpen(false)}
        />
      )}
       {isQuizOpen && (
        <QuizModal
            courseTitle={quizTitle}
            questions={quizQuestions}
            onClose={() => setIsQuizOpen(false)}
        />
      )}
      {isCertificateOpen && course && user && (
        <CertificateModal
            courseTitle={course.title}
            userName={user.name}
            completionDate={new Date().toLocaleDateString()}
            onClose={() => setIsCertificateOpen(false)}
        />
      )}
    </>
  );
};

export default CourseDetailPage;