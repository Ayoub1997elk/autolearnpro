import React, { useState, useEffect, useCallback } from 'react';
import { Lesson } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from './icons/Icons';
import ChatbotPanel from './ChatbotPanel';
import { useAuth } from '../contexts/AuthContext';

interface CourseSlidesViewerProps {
  lessons: Lesson[];
  courseTitle: string;
  courseId: number;
  onClose: () => void;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    let videoId = null;
    // Regex to capture video ID from various YouTube URL formats
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu.be\/)([^&?]+)/;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
        videoId = match[1];
    }
    
    if (videoId) {
        // Reverting to the simplest possible embed URL. The sandbox environment might be
        // interfering with more complex URLs that include parameters or special domains.
        // A direct, clean embed link is the most likely to bypass these restrictions and fix Error 153.
        return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
};


const CourseSlidesViewer: React.FC<CourseSlidesViewerProps> = ({ lessons, courseTitle, courseId, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { updateLessonProgress } = useAuth();

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex(prevIndex => Math.min(prevIndex + 1, lessons.length - 1));
  }, [lessons.length]);

  const goToPreviousSlide = () => {
    setCurrentSlideIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  useEffect(() => {
    // Mark the current lesson as completed when it's viewed
    const currentLesson = lessons[currentSlideIndex];
    if (currentLesson) {
        updateLessonProgress(courseId, currentLesson.id);
    }
  }, [currentSlideIndex, lessons, courseId, updateLessonProgress]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousSlide();
      } else if (event.key === 'Escape') {
        if (isChatOpen) {
          setIsChatOpen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextSlide, goToPreviousSlide, onClose, isChatOpen]);
  
  const currentLesson = lessons[currentSlideIndex];
  const embedUrl = currentLesson.videoUrl ? getYouTubeEmbedUrl(currentLesson.videoUrl) : null;
  
  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="slide-title"
    >
      <div className="w-full max-w-4xl h-full max-h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col relative">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" id="slide-title">{currentLesson.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{courseTitle}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close slide viewer"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        {/* Content */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
            {embedUrl ? (
                 <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden bg-black">
                    <iframe
                        src={embedUrl}
                        title={currentLesson.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            ) : currentLesson.imageUrl && (
                <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={currentLesson.imageUrl} alt={currentLesson.title} className="w-full max-h-80 object-contain mx-auto" />
                </div>
            )}
            <div className="prose dark:prose-invert max-w-none">
                <p>{currentLesson.content}</p>
            </div>
        </main>
        
        {/* Footer / Navigation */}
        <footer className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2"/>
            Previous
          </button>
          
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Lesson {currentSlideIndex + 1} of {lessons.length}
          </div>

          <button
            onClick={goToNextSlide}
            disabled={currentSlideIndex === lessons.length - 1}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            aria-label="Next slide"
          >
            Next
            <ChevronRightIcon className="w-5 h-5 ml-2"/>
          </button>
        </footer>
        
        {/* Chatbot FAB */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-20 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-110 transition-all duration-200"
          aria-label="Open AI Learning Assistant"
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
        </button>

        {isChatOpen && (
          <ChatbotPanel
            courseTitle={courseTitle}
            lessons={lessons}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CourseSlidesViewer;
