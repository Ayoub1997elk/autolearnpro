
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
<<<<<<< HEAD
=======
import CoursesPage from './pages/CoursesPage';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import CourseDetailPage from './pages/CourseDetailPage';
import DashboardPage from './pages/DashboardPage';
import ImageGeneratorPage from './pages/ImageGeneratorPage';
import CreateCoursePage from './pages/CreateCoursePage';
import { UserRole } from './types';
import TrainerProfilePage from './pages/TrainerProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const TrainerRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === UserRole.TRAINER ? children : <Navigate to="/dashboard" />;
};

const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === UserRole.ADMIN ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
<<<<<<< HEAD
=======
              <Route path="/courses" element={<CoursesPage />} />
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
              <Route path="/course/:id" element={<CourseDetailPage />} />
              <Route path="/trainer/:id" element={<TrainerProfilePage />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
               <Route
                path="/analytics"
                element={
                  <AdminRoute>
                    <AnalyticsPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/image-generator"
                element={
                  <TrainerRoute>
                    <ImageGeneratorPage />
                  </TrainerRoute>
                }
              />
              <Route
                path="/create-course"
                element={
                  <TrainerRoute>
                    <CreateCoursePage />
                  </TrainerRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;