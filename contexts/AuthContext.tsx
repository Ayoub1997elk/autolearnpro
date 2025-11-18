<<<<<<< HEAD
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { login as apiLogin, signup as apiSignup, enrollInCourse as apiEnrollInCourse, updateLessonProgress as apiUpdateLessonProgress } from '../services/mockApiService';
=======
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { login as apiLogin, signup as apiSignup, enrollInCourse as apiEnrollInCourse, updateLessonProgress as apiUpdateLessonProgress, getMe } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  signup: (name: string, email: string, password: string, role: UserRole.LEARNER | UserRole.TRAINER) => Promise<User>;
  enrollInCourse: (courseId: number) => Promise<void>;
  updateLessonProgress: (courseId: number, lessonId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    // Persist login state
    const storedUser = sessionStorage.getItem('autolearnpro_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
=======
    // Check if user is logged in via token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Try to get current user from API
      getMe().then((user) => {
        if (user) {
          setUser(user);
          sessionStorage.setItem('autolearnpro_user', JSON.stringify(user));
        }
      }).catch(() => {
        // Token invalid, clear it
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('autolearnpro_user');
      });
    } else {
      // Fallback to stored user (for backward compatibility)
      const storedUser = sessionStorage.getItem('autolearnpro_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<User | null> => {
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
    try {
      const loggedInUser = await apiLogin(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        sessionStorage.setItem('autolearnpro_user', JSON.stringify(loggedInUser));
        return loggedInUser;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
<<<<<<< HEAD
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole.LEARNER | UserRole.TRAINER): Promise<User> => {
=======
  };

  const signup = async (name: string, email: string, password: string, role: UserRole.LEARNER | UserRole.TRAINER): Promise<User> => {
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
    try {
        const newUser = await apiSignup(name, email, password, role);
        setUser(newUser);
        sessionStorage.setItem('autolearnpro_user', JSON.stringify(newUser));
        return newUser;
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
<<<<<<< HEAD
  }, []);

  const enrollInCourse = useCallback(async (courseId: number) => {
=======
  };

  const enrollInCourse = async (courseId: number) => {
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
    if (!user) {
        throw new Error("You must be logged in to enroll in a course.");
    }
    try {
        const updatedUser = await apiEnrollInCourse(user.id, courseId);
        setUser(updatedUser);
        sessionStorage.setItem('autolearnpro_user', JSON.stringify(updatedUser));
    } catch (error) {
        console.error("Enrollment in context failed:", error);
        throw error;
    }
<<<<<<< HEAD
  }, [user]);

  const updateLessonProgress = useCallback(async (courseId: number, lessonId: number) => {
    if (!user) return;
    try {
      const updatedUser = await apiUpdateLessonProgress(user.id, courseId, lessonId);
      // Only update state if the API reports an actual change
      if (updatedUser) {
        setUser(updatedUser);
        sessionStorage.setItem('autolearnpro_user', JSON.stringify(updatedUser));
      }
=======
  };

  const updateLessonProgress = async (courseId: number, lessonId: number) => {
    if (!user) return;
    try {
      const updatedUser = await apiUpdateLessonProgress(user.id, courseId, lessonId);
      setUser(updatedUser);
      sessionStorage.setItem('autolearnpro_user', JSON.stringify(updatedUser));
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
    } catch (error) {
      console.error("Failed to update progress in context:", error);
      // Don't throw, as this is a background task
    }
<<<<<<< HEAD
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('autolearnpro_user');
  }, []);
  
  const value = { isAuthenticated: !!user, user, login, logout, signup, enrollInCourse, updateLessonProgress };

  return (
    <AuthContext.Provider value={value}>
=======
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('autolearnpro_user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, signup, enrollInCourse, updateLessonProgress }}>
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
