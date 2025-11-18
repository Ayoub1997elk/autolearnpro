
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { ArrowRightIcon, AcademicCapIcon, UserGroupIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, SparklesIcon, ChatBubbleLeftRightIcon, ChatBubbleBottomCenterTextIcon } from '../components/icons/Icons';


const HomePage: React.FC = () => {

  return (
    <div className="bg-white dark:bg-gray-900">
=======
import { getCourses } from '../services/apiService';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { ArrowRightIcon, LogoIcon, AcademicCapIcon, UserGroupIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from '../components/icons/Icons';


const HomePage: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getCourses();
        setFeaturedCourses(allCourses.slice(0, 3)); // Show first 3 as featured
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        // Set empty array on error so page still renders
        setFeaturedCourses([]);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
      {/* Hero Section */}
      <section 
        className="relative text-white"
        style={{
            backgroundImage: `url(https://i.imgur.com/vpSnrXz.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">Master the Art of Automotive Engineering</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8 drop-shadow-md">
<<<<<<< HEAD
            Drive your career forward. Master automotive technology with intelligent, hands-on courses built for the modern technician.
          </p>
          <Link to="/signup" className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Get Started <ArrowRightIcon className="inline-block h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
      
       {/* Why Choose Us Section */}
      <section id="features" className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose AutoLearnPro?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
                    We're not just another learning platform. We're a supercharged, AI-enhanced ecosystem designed to accelerate your automotive expertise.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">AI-Powered Learning</h3>
                    <p className="text-gray-600 dark:text-gray-400">Instantly generate quizzes, get 24/7 help from an AI assistant, and receive personalized course recommendations.</p>
                </div>
                 <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Expert-Led Content</h3>
                    <p className="text-gray-600 dark:text-gray-400">Learn from certified master mechanics and industry veterans who bring real-world workshop experience to every lesson.</p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Thriving Community</h3>
                    <p className="text-gray-600 dark:text-gray-400">Engage in discussion forums, ask questions, and collaborate with a passionate community of learners and trainers.</p>
                </div>
                 <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                    <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Career-Focused Skills</h3>
                    <p className="text-gray-600 dark:text-gray-400">Gain practical, hands-on skills you can apply immediately, and earn certificates to prove your expertise.</p>
=======
            From engine diagnostics to custom modifications, AutoLearnPro is your ultimate garage for professional-grade courses.
          </p>
          <Link to="/courses" className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Explore Courses <ArrowRightIcon className="inline-block h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About AutoLearnPro</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                      AutoLearnPro was born from a passion for all things automotive and a drive to share high-quality, accessible knowledge. We believe that anyone can master complex automotive skills with the right guidance. Our mission is to empower mechanics, enthusiasts, and DIYers with expert-led courses that are both comprehensive and engaging. We're building a community dedicated to excellence, innovation, and a shared love for the road.
                  </p>
              </div>
          </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Expert-Led Courses</h3>
                    <p className="text-gray-600 dark:text-gray-400">Learn from certified mechanics and industry veterans with years of hands-on experience.</p>
                </div>
                <div className="p-6">
                    <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Community Driven</h3>
                    <p className="text-gray-600 dark:text-gray-400">Join a community of enthusiasts and professionals. Share projects, ask questions, and grow together.</p>
                </div>
                <div className="p-6">
                    <LogoIcon className="h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 dark:text-white">Hands-On Learning</h3>
                    <p className="text-gray-600 dark:text-gray-400">Our courses are packed with practical examples and real-world scenarios to build your skills.</p>
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
                </div>
            </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Get Started in 3 Easy Steps</h2>
              <div className="relative">
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                      <div className="text-center">
                          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-2xl border-2 border-white dark:border-gray-900">1</div>
                          <h3 className="text-xl font-semibold mb-2 dark:text-white">Find Your Course</h3>
                          <p className="text-gray-600 dark:text-gray-400">Explore our catalog and use advanced filters to find the perfect course for your skill level and interests.</p>
                      </div>
                      <div className="text-center">
                          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-2xl border-2 border-white dark:border-gray-900">2</div>
                          <h3 className="text-xl font-semibold mb-2 dark:text-white">Learn Interactively</h3>
                          <p className="text-gray-600 dark:text-gray-400">Dive into engaging lessons, test your knowledge with AI quizzes, and get help from your AI learning assistant.</p>
                      </div>
                      <div className="text-center">
                          <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold text-2xl border-2 border-white dark:border-gray-900">3</div>
                          <h3 className="text-xl font-semibold mb-2 dark:text-white">Earn Your Certificate</h3>
                          <p className="text-gray-600 dark:text-gray-400">Complete your course, receive your official certificate, and share your new qualification with the world.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Users Say</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                      <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-blue-500 mb-4"/>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-4">"The AI assistant is a game-changer. I was stuck on a wiring diagram, asked a question, and got a clear explanation in seconds. It's like having a personal tutor available 24/7. I've learned more here in a month than in a year of reading forums."</p>
                      <p className="font-bold text-gray-900 dark:text-white">Leo M.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Enthusiast & Learner</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
                      <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-blue-500 mb-4"/>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-4">"As a trainer, the AI content generation tools are phenomenal. They handle the heavy lifting of drafting lessons, which lets me focus on adding the hands-on details and insights that matter most. It's cut my course creation time in half."</p>
                      <p className="font-bold text-gray-900 dark:text-white">Tia S.</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Master Technician & Trainer</p>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
              <h2 className="text-3xl font-extrabold mb-4">Ready to Shift Your Career into High Gear?</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">Join thousands of learners and professionals who are leveling up their automotive skills with AutoLearnPro.</p>
              <Link to="/signup" className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Get Started Now
              </Link>
          </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 bg-gray-100 dark:bg-gray-800">
=======
      {/* Featured Courses Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Get In Touch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                  <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                      <MapPinIcon className="h-10 w-10 mb-3 text-blue-600 dark:text-blue-400"/>
                      <h3 className="text-xl font-semibold dark:text-white">Our Workshop</h3>
                      <p className="text-gray-600 dark:text-gray-300">123 Piston Ave, Gearhead City, 54321</p>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                      <EnvelopeIcon className="h-10 w-10 mb-3 text-blue-600 dark:text-blue-400"/>
                      <h3 className="text-xl font-semibold dark:text-white">Email Us</h3>
                      <a href="mailto:contact@autolearnpro.com" className="text-blue-600 dark:text-blue-400 hover:underline">contact@autolearnpro.com</a>
                  </div>
                  <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
                      <PhoneIcon className="h-10 w-10 mb-3 text-blue-600 dark:text-blue-400"/>
                      <h3 className="text-xl font-semibold dark:text-white">Call Us</h3>
                      <p className="text-gray-600 dark:text-gray-300">(123) 456-7890</p>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;