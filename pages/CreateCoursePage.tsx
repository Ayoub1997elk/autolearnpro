import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Course, Lesson, UserRole } from '../types';
<<<<<<< HEAD
import { createCourse } from '../services/mockApiService';
=======
import { createCourse } from '../services/apiService';
>>>>>>> a912287 (Added Firebase Cloud Functions backend and integrated course creation)
import { generateCourseOutline, generateLessonContent } from '../services/geminiService';
import { PlusIcon, TrashIcon, SparklesIcon, SaveIcon, ArrowUpIcon, ArrowDownIcon, AdjustmentsHorizontalIcon, PhotoIcon, VideoCameraIcon, WandSparklesIcon } from '../components/icons/Icons';
import ImageGenerationModal from '../components/ImageGenerationModal';

// Helper function to convert file to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Sub-components defined in the same file ---

interface SlideThumbnailProps {
  lesson: Omit<Lesson, 'id'>;
  index: number;
  isActive: boolean;
  lessonCount: number;
  onClick: () => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onDelete: (index: number) => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  lesson,
  index,
  isActive,
  lessonCount,
  onClick,
  onMove,
  onDelete,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group border-2 rounded-md p-2 cursor-pointer transition-colors duration-200 aspect-[16/9] flex flex-col justify-center items-center text-center ${
        isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-400'
      }`}
    >
      <span className="text-sm text-gray-500 dark:text-gray-400">{index + 1}</span>
      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 mt-1">
        {lesson.title}
      </p>
      {lesson.imageUrl && <PhotoIcon className="absolute bottom-1 left-1 w-4 h-4 text-gray-400 dark:text-gray-500" />}
      {lesson.videoUrl && <VideoCameraIcon className="absolute bottom-1 right-1 w-4 h-4 text-gray-400 dark:text-gray-500" />}
      <div className="absolute top-1 right-1 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'up'); }} disabled={index === 0} className="p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30" aria-label="Move slide up"><ArrowUpIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" /></button>
        <button onClick={(e) => { e.stopPropagation(); onMove(index, 'down'); }} disabled={index === lessonCount - 1} className="p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30" aria-label="Move slide down"><ArrowDownIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(index); }} className="p-1 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-red-100 dark:hover:bg-red-900" aria-label="Delete slide"><TrashIcon className="w-3 h-3 text-red-500" /></button>
      </div>
    </div>
  );
};

interface SlideEditorProps {
  lesson: Omit<Lesson, 'id'>;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (newContent: string) => void;
  onImageUpload: (base64Url: string) => void;
  onImageRemove: () => void;
  onGenerateContent: () => void;
  onOpenImageGenerator: () => void;
  isGeneratingContent: boolean;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ lesson, onTitleChange, onContentChange, onImageUpload, onImageRemove, onGenerateContent, onOpenImageGenerator, isGeneratingContent }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onImageUpload(base64);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const base64 = await fileToBase64(file);
      onImageUpload(base64);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col p-4 max-w-4xl mx-auto aspect-video">
      <div className="flex-grow w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex flex-col">
        <input type="text" value={lesson.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Lesson Title" className="w-full bg-transparent text-2xl md:text-3xl font-bold text-center outline-none border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 transition-colors pb-2 mb-4 dark:text-white flex-shrink-0" />
        <div className="flex-grow flex flex-col overflow-y-auto custom-scrollbar space-y-4">
          
          <div className="w-full h-48 flex-shrink-0">
             {lesson.videoUrl ? (
                <div className="w-full h-full rounded-md border-2 border-dashed flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                    <VideoCameraIcon className="w-12 h-12 mx-auto mb-2 text-blue-500"/>
                    <p className="font-semibold">Video Content</p>
                    <p className="text-xs truncate max-w-full px-4">{lesson.videoUrl}</p>
                    <p className="text-xs mt-2">Edit URL in the properties panel</p>
                </div>
             ) : lesson.imageUrl ? (
                <div className="relative group w-full h-full">
                    <img src={lesson.imageUrl} alt={lesson.title} className="w-full h-full object-contain rounded-md bg-gray-100 dark:bg-gray-700" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={triggerFileSelect} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Change</button>
                        <button onClick={onImageRemove} className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">Remove</button>
                    </div>
                </div>
             ) : (
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`w-full h-full rounded-md border-2 border-dashed flex items-center justify-center text-center text-gray-500 dark:text-gray-400 transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                >
                    <div className="flex flex-col items-center">
                        <div onClick={triggerFileSelect} className="cursor-pointer p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                            <PhotoIcon className="w-10 h-10 mx-auto mb-2"/>
                            <p className="font-semibold">Drag & drop or click to upload</p>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 my-2">or</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenImageGenerator();
                            }}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
                        >
                            <WandSparklesIcon className="w-4 h-4 mr-2" />
                            Find Media with AI
                        </button>
                    </div>
                </div>
             )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

           <div className="flex items-center justify-end -mb-2">
                <button 
                    onClick={onGenerateContent}
                    disabled={isGeneratingContent}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait"
                >
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    {isGeneratingContent ? 'Generating...' : 'Generate Content with AI'}
                </button>
            </div>
            
          <textarea value={lesson.content} onChange={(e) => onContentChange(e.target.value)} placeholder="Start writing your lesson content here..." className="w-full flex-grow bg-transparent outline-none resize-none text-gray-700 dark:text-gray-300 md:text-lg leading-relaxed mt-4" />
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---

// FIX: Corrected WritableCourse type to handle lessons without IDs during creation.
type WritableCourse = Omit<Course, 'id' | 'trainerId' | 'trainerName' | 'enrollmentCount' | 'lessons'> & { lessons: WritableLesson[] };
type WritableLesson = Omit<Lesson, 'id'>;

const initialCourseState: WritableCourse = {
  title: '',
  description: '',
  longDescription: '',
  imageUrl: '',
  lessons: [],
  category: 'Engine Systems',
  level: 'Beginner',
};

const CreateCoursePage: React.FC = () => {
  const [course, setCourse] = useState<WritableCourse>(initialCourseState);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [outlineTopic, setOutlineTopic] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isImageGenerationModalOpen, setIsImageGenerationModalOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCourseDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };
  
  const handleLessonDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (activeLessonIndex === null) return;
     const newLessons = [...course.lessons];
     let value: string | number = e.target.value;

     if (e.target.name === 'duration') {
        value = parseInt(e.target.value, 10) || 0;
     }

     const lessonToUpdate = { ...newLessons[activeLessonIndex], [e.target.name]: value };
     
     newLessons[activeLessonIndex] = lessonToUpdate;
     setCourse({ ...course, lessons: newLessons });
  }

  const handleLessonContentChange = (field: 'title' | 'content', value: string) => {
    if (activeLessonIndex === null) return;
    const newLessons = [...course.lessons];
    const lessonToUpdate = { ...newLessons[activeLessonIndex], [field]: value };
    newLessons[activeLessonIndex] = lessonToUpdate;
    setCourse({ ...course, lessons: newLessons });
  };

  const handleLessonImageUpload = (base64Url: string) => {
    if (activeLessonIndex === null) return;
    const newLessons = [...course.lessons];
    const lessonToUpdate = { ...newLessons[activeLessonIndex], imageUrl: base64Url, videoUrl: '' }; // Clear video if image is uploaded
    newLessons[activeLessonIndex] = lessonToUpdate;
    setCourse({ ...course, lessons: newLessons });
  };
  
  const handleSelectGeneratedImage = (base64Data: string) => {
    handleLessonImageUpload(`data:image/png;base64,${base64Data}`);
    setIsImageGenerationModalOpen(false);
  };

  const handleLessonImageRemove = () => {
    if (activeLessonIndex === null) return;
    const newLessons = [...course.lessons];
    const lessonToUpdate = { ...newLessons[activeLessonIndex], imageUrl: '' };
    newLessons[activeLessonIndex] = lessonToUpdate;
    setCourse({ ...course, lessons: newLessons });
  };
  
  const addLesson = () => {
    const newLesson: WritableLesson = { title: 'New Slide', content: 'Click to edit content...', duration: 10, imageUrl: '', videoUrl: '' };
    const newLessons = [...course.lessons, newLesson];
    setCourse({ ...course, lessons: newLessons });
    setActiveLessonIndex(newLessons.length - 1);
  };

  const deleteLesson = (index: number) => {
    const newLessons = course.lessons.filter((_, i) => i !== index);
    setCourse({ ...course, lessons: newLessons });
    if (activeLessonIndex === index) {
      setActiveLessonIndex(newLessons.length > 0 ? 0 : null);
    } else if (activeLessonIndex !== null && activeLessonIndex > index) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };
  
  const moveLesson = (index: number, direction: 'up' | 'down') => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === course.lessons.length - 1)) {
        return;
      }

      const newLessons = [...course.lessons];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];

      setCourse({ ...course, lessons: newLessons });
      setActiveLessonIndex(targetIndex);
  }

  const handleGenerateOutline = async () => {
      if (!outlineTopic) return;
      setIsGeneratingOutline(true);
      try {
          const outlineJson = await generateCourseOutline(outlineTopic);
          const outline = JSON.parse(outlineJson);
          const newLessons: WritableLesson[] = outline.modules.flatMap((module: any) => 
              module.lessons.map((lessonTitle: string) => ({
                  title: `${module.title}: ${lessonTitle}`,
                  content: 'Add your detailed lesson content here.',
                  duration: 15,
                  imageUrl: '',
                  videoUrl: '',
              }))
          );
           setCourse(prev => {
              const updatedLessons = [...prev.lessons, ...newLessons];
              if (activeLessonIndex === null && newLessons.length > 0) {
                  setActiveLessonIndex(prev.lessons.length);
              }
              return { ...prev, title: outline.title || prev.title, lessons: updatedLessons};
          });
      } catch (error) {
          console.error("Failed to generate and apply outline:", error);
          alert("Could not generate outline. Please check the topic and try again.");
      } finally {
          setIsGeneratingOutline(false);
      }
  };

  const handleGenerateLessonContent = async () => {
    if (activeLessonIndex === null || !course.lessons[activeLessonIndex]) return;

    const currentLesson = course.lessons[activeLessonIndex];
    if (!course.title || !currentLesson.title) {
        alert("Please provide a course title and a lesson title before generating content.");
        return;
    }

    setIsGeneratingContent(true);
    try {
        const content = await generateLessonContent(course.title, currentLesson.title);
        handleLessonContentChange('content', content);
    } catch (error) {
        console.error("Failed to generate lesson content:", error);
        alert("An error occurred while generating lesson content. Please try again.");
    } finally {
        setIsGeneratingContent(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || user.role !== UserRole.TRAINER) {
      alert("You must be logged in as a trainer to create a course.");
      return;
    }
    if (!course.title || !course.description || course.lessons.length === 0) {
        alert("Please fill in the course title, description, and add at least one lesson.");
        return;
    }

    setLoading(true);
    try {
      // FIX: The mock API expects lessons to have an ID, even though it re-assigns them.
      // We create a payload with temporary IDs to match the expected type.
      const coursePayload = {
        ...course,
        lessons: course.lessons.map((l, index) => ({ ...l, id: -(index + 1) })) // Assign temporary negative IDs
      };
      await createCourse(coursePayload, user);
      alert('Course created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to create course:", error);
      alert('An error occurred while creating the course. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const currentLesson = activeLessonIndex !== null ? course.lessons[activeLessonIndex] : null;

  return (
    <>
    <div className="flex h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Left Panel: Thumbnails */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-4 flex-shrink-0">Lessons</h2>
        <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {course.lessons.map((lesson, index) => (
            <SlideThumbnail
              key={index}
              lesson={lesson}
              index={index}
              isActive={index === activeLessonIndex}
              lessonCount={course.lessons.length}
              onClick={() => setActiveLessonIndex(index)}
              onMove={moveLesson}
              onDelete={deleteLesson}
            />
          ))}
        </div>
        <button
          onClick={addLesson}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Slide
        </button>
      </div>

      {/* Center Panel: Editor */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-200 dark:bg-gray-900">
        {currentLesson ? (
          <SlideEditor
            lesson={currentLesson}
            onTitleChange={(newTitle) => handleLessonContentChange('title', newTitle)}
            onContentChange={(newContent) => handleLessonContentChange('content', newContent)}
            onImageUpload={handleLessonImageUpload}
            onImageRemove={handleLessonImageRemove}
            onGenerateContent={handleGenerateLessonContent}
            onOpenImageGenerator={() => setIsImageGenerationModalOpen(true)}
            isGeneratingContent={isGeneratingContent}
          />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <h3 className="text-2xl font-semibold">Select a slide to edit</h3>
            <p>Or add a new slide to get started.</p>
          </div>
        )}
      </main>

      {/* Right Panel: Properties */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-between items-center">
             <h2 className="text-lg font-semibold flex items-center"><AdjustmentsHorizontalIcon className="w-5 h-5 mr-2"/>Properties</h2>
             <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium disabled:bg-green-400"
              >
                <SaveIcon className="w-5 h-5 mr-2" />
                {loading ? 'Saving...' : 'Save Course'}
              </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {/* Course Details */}
            <div>
              <h3 className="font-semibold mb-2">Course Details</h3>
              <div className="space-y-3">
                <input type="text" name="title" placeholder="Course Title" value={course.title} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"/>
                <textarea name="description" placeholder="Short Description" value={course.description} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm" rows={2}/>
                <textarea name="longDescription" placeholder="Long Description" value={course.longDescription} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm" rows={4}/>
                <input type="text" name="imageUrl" placeholder="Course Cover Image URL" value={course.imageUrl} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"/>
                <select name="category" value={course.category} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm">
                    <option>Engine Systems</option>
                    <option>Electronics</option>
                    <option>Drivetrain</option>
                    <option>Chassis</option>
                    <option>Future Tech</option>
                </select>
                <select name="level" value={course.level} onChange={handleCourseDetailChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
              </div>
            </div>
            
            {/* AI Outline Generator */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
               <h3 className="font-semibold mb-2 flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-blue-500" /> AI Outline Generator</h3>
               <div className="flex space-x-2">
                 <input type="text" placeholder="e.g., 'Hybrid Battery Systems'" value={outlineTopic} onChange={(e) => setOutlineTopic(e.target.value)} className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"/>
                 <button onClick={handleGenerateOutline} disabled={isGeneratingOutline} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 text-sm">{isGeneratingOutline ? '...' : 'Go'}</button>
               </div>
            </div>

            {/* Lesson Details */}
            {currentLesson && (
               <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="font-semibold mb-2">Lesson Details</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (minutes)</label>
                        <input type="number" name="duration" value={currentLesson.duration} onChange={handleLessonDetailChange} className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL (e.g., YouTube)</label>
                        <input type="text" name="videoUrl" value={currentLesson.videoUrl || ''} onChange={handleLessonDetailChange} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 text-sm"/>
                    </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
    {isImageGenerationModalOpen && (
        <ImageGenerationModal 
            onClose={() => setIsImageGenerationModalOpen(false)}
            onImageSelect={handleSelectGeneratedImage}
        />
    )}
    </>
  );
};

export default CreateCoursePage;