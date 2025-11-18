import { User, UserRole, Course, Lesson, AnalyticsData, Badge, ForumPost, ForumReply, TrainerAnalyticsData } from '../types';

// MOCK DATA
// =============================================

export const MOCK_BADGES: { [key: string]: Badge } = {
  FIRST_COURSE: { id: 'FIRST_COURSE', name: 'First Lap', description: 'Congratulations on completing your first course!', icon: 'AcademicCapIcon' },
  FIVE_COURSES: { id: 'FIVE_COURSES', name: 'Master Mechanic', description: 'You have completed 5 courses. Impressive!', icon: 'TrophyIcon' },
};

export let MOCK_USERS: User[] = [
  { id: 1, name: 'Admin Adam', email: 'admin@test.com', password: 'password', role: UserRole.ADMIN, enrolledCourseIds: [], badges: [], learningStreak: { current: 0, lastLogin: '' } },
  { id: 2, name: 'Trainer Tia', email: 'trainer@test.com', password: 'password', role: UserRole.TRAINER, enrolledCourseIds: [3], createdCourseIds: [1, 2, 5], progress: { '3': [31, 32] }, bio: 'A certified master technician with over 15 years of experience in engine diagnostics and electrical systems. Tia is passionate about making complex topics easy to understand for the next generation of mechanics.', badges: [], learningStreak: { current: 2, lastLogin: '2024-07-20' } },
  { id: 3, name: 'Learner Leo', email: 'learner@test.com', password: 'password', role: UserRole.LEARNER, enrolledCourseIds: [1, 4], progress: { '1': [1, 2, 3, 4, 5], '4': [41, 42, 43, 44, 45] }, badges: [MOCK_BADGES.FIRST_COURSE], learningStreak: { current: 5, lastLogin: '2024-07-21' } },
  { id: 4, name: 'Trainer Tom', email: 'trainer2@test.com', password: 'password', role: UserRole.TRAINER, enrolledCourseIds: [], createdCourseIds: [3, 4], bio: 'Specializing in drivetrain and chassis systems, Tom has rebuilt countless transmissions and aligned hundreds of vehicles. His hands-on approach brings real-world workshop experience directly to his courses.', badges: [], learningStreak: { current: 0, lastLogin: '' } },
];

const createLessons = (courseId: number, titles: string[]): Lesson[] => {
    return titles.map((title, index) => ({
        id: (courseId * 10) + index + 1, // Make IDs globally unique
        title: title,
        content: `This is the detailed content for the lesson "${title}". It covers various aspects and practical examples related to the topic.`,
        duration: Math.floor(Math.random() * 20) + 10, // Random duration between 10 and 29 minutes
    }));
};

let MOCK_COURSES: Course[] = [
  {
    id: 1,
    title: 'Engine Fundamentals & Diagnostics',
    description: 'A deep dive into the heart of the vehicle. Learn how engines work, from basic principles to advanced diagnostics.',
    longDescription: 'This comprehensive course covers everything you need to know about internal combustion engines. We start with the basics of the four-stroke cycle, move on to component identification, and finish with advanced electronic diagnostics using modern tools. Perfect for aspiring mechanics and enthusiasts.',
    imageUrl: 'https://i.imgur.com/Q09bf2M.jpeg',
    trainerId: 2,
    trainerName: 'Trainer Tia',
    lessons: createLessons(1, ['Introduction to Engine Components', 'The Four-Stroke Cycle', 'Fuel & Ignition Systems', 'Using Diagnostic Scanners', 'Common Engine Problems']),
    category: 'Engine Systems',
    level: 'Beginner',
    enrollmentCount: 1,
  },
  {
    id: 2,
    title: 'Automotive Electrical Systems',
    description: 'Master the complexities of modern vehicle electronics, from simple circuits to complex CAN bus networks.',
    longDescription: 'Unlock the secrets of automotive wiring and electronics. This course teaches you how to read wiring diagrams, diagnose electrical faults with a multimeter, understand battery and charging systems, and troubleshoot sensors and actuators. A must-have skill for any modern technician.',
    imageUrl: 'https://images.unsplash.com/photo-1622226819723-5037d54524ac?q=80&w=870',
    trainerId: 2,
    trainerName: 'Trainer Tia',
    lessons: createLessons(2, ['Ohm\'s Law & Basic Circuits', 'Reading Wiring Diagrams', 'Battery & Starting Systems', 'Charging Systems (Alternators)', 'Troubleshooting Sensors']),
    category: 'Electronics',
    level: 'Intermediate',
    enrollmentCount: 0,
  },
  {
    id: 3,
    title: 'Advanced Transmission Repair',
    description: 'Explore the mechanics of automatic and manual transmissions, including teardown and rebuild procedures.',
    longDescription: 'Go beyond simple fluid changes and learn to diagnose and repair complex transmission issues. This course covers torque converters, planetary gear sets, valve bodies, and dual-clutch systems. Includes hands-on video demonstrations of a complete transmission rebuild.',
    imageUrl: 'https://images.unsplash.com/photo-1599422891383-f773574de9a1?q=80&w=870',
    trainerId: 4,
    trainerName: 'Trainer Tom',
    lessons: createLessons(3, ['Automatic vs. Manual Transmissions', 'Torque Converters Explained', 'Planetary Gearsets', 'Hydraulic Systems & Solenoids', 'Rebuild Project: 4L60E']),
    category: 'Drivetrain',
    level: 'Advanced',
    enrollmentCount: 1,
  },
  {
    id: 4,
    title: 'Suspension & Steering Systems',
    description: 'Learn to diagnose and repair suspension components, perform wheel alignments, and ensure vehicle safety.',
    longDescription: 'A smooth ride and precise handling are critical for vehicle safety and performance. This course covers struts, shocks, control arms, and steering systems. You\'ll learn how to perform a professional four-wheel alignment and diagnose common issues like pulling, vibrations, and uneven tire wear.',
    imageUrl: 'https://images.unsplash.com/photo-1614055198825-5f778a48b577?q=80&w=870',
    trainerId: 4,
    trainerName: 'Trainer Tom',
    lessons: createLessons(4, ['Suspension Types', 'Diagnosing Worn Components', 'Strut & Shock Replacement', 'Principles of Wheel Alignment', 'Power Steering Systems']),
    category: 'Chassis',
    level: 'Intermediate',
    enrollmentCount: 1,
  },
   {
    id: 5,
    title: 'Introduction to Hybrid & EV Technology',
    description: 'Get up to speed with the future of automotive: high-voltage systems, battery tech, and electric motors.',
    longDescription: 'The automotive industry is electrifying. This introductory course provides a safe and comprehensive overview of hybrid and electric vehicle technology. Learn about high-voltage safety, battery management systems (BMS), electric motor types, and regenerative braking. Essential knowledge for the technician of tomorrow.',
    imageUrl: 'https://images.unsplash.com/photo-1617886322207-6f504e7472c5?q=80&w=870',
    trainerId: 2,
    trainerName: 'Trainer Tia',
    lessons: createLessons(5, ['High-Voltage Safety', 'Battery Pack Fundamentals', 'AC vs. DC Motors', 'Regenerative Braking', 'On-Board Chargers']),
    category: 'Future Tech',
    level: 'Beginner',
    enrollmentCount: 0,
  },
];

let MOCK_FORUM_POSTS: ForumPost[] = [
    { id: 1, courseId: 1, authorId: 3, authorName: 'Learner Leo', title: "Confused about the 'Compression' stroke", content: "The lesson says air and fuel are compressed, but where does the spark happen? Is it during or after this stroke? A bit confused on the timing.", createdAt: "2024-07-21T10:00:00Z", replies: [
        { id: 1, postId: 1, authorId: 2, authorName: 'Trainer Tia', content: "Great question, Leo! The spark happens right at the end of the compression stroke, just as the piston reaches the top. This timing is crucial to get the most power out of the combustion.", createdAt: "2024-07-21T11:30:00Z" }
    ]},
    { id: 2, courseId: 1, authorId: 3, authorName: 'Learner Leo', title: "What's the best tool for checking fuel pressure?", content: "The lesson mentions checking fuel pressure, but doesn't recommend a specific tool. Are there any affordable options for DIYers?", createdAt: "2024-07-22T14:00:00Z", replies: []},
];

const SIMULATED_DELAY = 500; // in milliseconds

// MOCK API FUNCTIONS
// =============================================

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


/**
 * Simulates a login request.
 * @param email The user's email.
 * @param password The user's password.
 * @returns A promise that resolves to the User object or null if credentials are invalid.
 */
export const login = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(
        (u) => u.email === email && u.password === password
      );
      if (userIndex !== -1) {
        const user = MOCK_USERS[userIndex];
        
        // --- Gamification: Learning Streak Logic ---
        if (user.role === UserRole.LEARNER) {
            const today = getTodayDateString();
            const yesterday = getYesterdayDateString();
            if (user.learningStreak) {
                if (user.learningStreak.lastLogin === yesterday) {
                    user.learningStreak.current += 1; // Continue streak
                } else if (user.learningStreak.lastLogin !== today) {
                    user.learningStreak.current = 1; // Reset streak
                }
                user.learningStreak.lastLogin = today;
            } else {
                 user.learningStreak = { current: 1, lastLogin: today };
            }
        }
        
        MOCK_USERS[userIndex] = user;

        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword as User);
      } else {
        resolve(null);
      }
    }, SIMULATED_DELAY);
  });
};

/**
 * Simulates a user signup request.
 * @param name The user's name.
 * @param email The user's email.
 * @param password The user's password.
 * @param role The user's role (Learner or Trainer).
 * @returns A promise that resolves to the new User object or throws an error if email exists.
 */
export const signup = (name: string, email: string, password: string, role: UserRole.LEARNER | UserRole.TRAINER): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const emailExists = MOCK_USERS.some(u => u.email === email);
            if (emailExists) {
                reject(new Error('An account with this email already exists.'));
                return;
            }

            const newUser: User = {
                id: Math.max(...MOCK_USERS.map(u => u.id), 0) + 1,
                name,
                email,
                password,
                role,
                enrolledCourseIds: [],
                progress: {},
                badges: [],
                learningStreak: { current: 0, lastLogin: '' },
                ...(role === UserRole.TRAINER && { createdCourseIds: [] }),
            };

            MOCK_USERS.push(newUser);
            const { password: pw, ...userWithoutPassword } = newUser;
            resolve(userWithoutPassword as User);

        }, SIMULATED_DELAY);
    });
};

/**
 * Fetches all users.
 * @returns A promise that resolves to an array of all users.
 */
export const getUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_USERS.map(u => {
                const { password, ...user } = u;
                return user as User;
            }));
        }, SIMULATED_DELAY);
    });
};

/**
 * Fetches a single trainer by their ID.
 * @param id The ID of the trainer to fetch.
 * @returns A promise that resolves to the User object or null if not found.
 */
export const getTrainerById = (id: number): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = MOCK_USERS.find(
                (u) => u.id === id && u.role === UserRole.TRAINER
            );
            if (user) {
                const { password, ...userWithoutPassword } = user;
                resolve(userWithoutPassword as User);
            } else {
                resolve(null);
            }
        }, SIMULATED_DELAY);
    });
};

/**
 * Fetches all courses.
 * @returns A promise that resolves to an array of all courses.
 */
export const getCourses = (): Promise<Course[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_COURSES);
        }, SIMULATED_DELAY);
    });
};

/**
 * Fetches a single course by its ID.
 * @param id The ID of the course to fetch.
 * @returns A promise that resolves to the Course object or null if not found.
 */
export const getCourseById = (id: number): Promise<Course | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const course = MOCK_COURSES.find((c) => c.id === id) || null;
            resolve(course);
        }, SIMULATED_DELAY);
    });
};

/**
 * Creates a new course.
 * @param courseData The course data to be saved.
 * @param trainer The user object of the trainer creating the course.
 * @returns A promise that resolves to the newly created Course object.
 */
export const createCourse = (courseData: Omit<Course, 'id' | 'trainerId' | 'trainerName' | 'enrollmentCount'>, trainer: User): Promise<Course> => {
    return new Promise((resolve, reject) => {
        if (trainer.role !== UserRole.TRAINER) {
            reject(new Error("Only trainers can create courses."));
            return;
        }
        setTimeout(() => {
            const newCourse: Course = {
                ...courseData,
                id: Math.max(...MOCK_COURSES.map(c => c.id), 0) + 1,
                trainerId: trainer.id,
                trainerName: trainer.name,
                enrollmentCount: 0,
                lessons: courseData.lessons.map((lesson, index) => ({ ...lesson, id: Date.now() + index })) // Assign temporary unique IDs
            };

            MOCK_COURSES.push(newCourse);
            
            // Update the trainer's created courses list
            const trainerIndex = MOCK_USERS.findIndex(u => u.id === trainer.id);
            if (trainerIndex !== -1 && MOCK_USERS[trainerIndex].createdCourseIds) {
                 MOCK_USERS[trainerIndex].createdCourseIds?.push(newCourse.id);
            }

            resolve(newCourse);
        }, SIMULATED_DELAY);
    });
};

/**
 * Enrolls a user in a course.
 * @param userId The ID of the user.
 * @param courseId The ID of the course.
 * @returns A promise that resolves to the updated User object.
 */
export const enrollInCourse = (userId: number, courseId: number): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                return reject(new Error("User not found."));
            }

            const courseIndex = MOCK_COURSES.findIndex(c => c.id === courseId);
            if (courseIndex === -1) {
                return reject(new Error("Course not found."));
            }
            
            const user = MOCK_USERS[userIndex];
            
            if (!user.enrolledCourseIds.includes(courseId)) {
                user.enrolledCourseIds.push(courseId);
                MOCK_COURSES[courseIndex].enrollmentCount += 1; // Increment enrollment count
            }

            MOCK_USERS[userIndex] = user;

            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword as User);
        }, SIMULATED_DELAY);
    });
};

/**
 * Updates a user's progress for a specific lesson in a course.
 * @param userId The ID of the user.
 * @param courseId The ID of the course.
 * @param lessonId The ID of the lesson completed.
 * @returns A promise that resolves to the updated User object if a change occurred, otherwise null.
 */
export const updateLessonProgress = (userId: number, courseId: number, lessonId: number): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
        if (userIndex === -1) return reject(new Error("User not found."));
        
        const course = MOCK_COURSES.find(c => c.id === courseId);
        if (!course) return reject(new Error("Course not found."));

        const user = MOCK_USERS[userIndex];
        let wasUpdated = false;
        
        if (!user.progress) user.progress = {};
        if (!user.progress[courseId]) user.progress[courseId] = [];
        
        if (!user.progress[courseId].includes(lessonId)) {
            user.progress[courseId].push(lessonId);
            wasUpdated = true;
        }

        const completedCoursesCount = Object.keys(user.progress).filter(cId => {
            const courseToCheck = MOCK_COURSES.find(c => c.id === Number(cId));
            return courseToCheck && user.progress![Number(cId)].length === courseToCheck.lessons.length;
        }).length;

        if (!user.badges) user.badges = [];
        const hasFirstCourseBadge = user.badges.some(b => b.id === 'FIRST_COURSE');
        const hasFiveCoursesBadge = user.badges.some(b => b.id === 'FIVE_COURSES');
        
        if (completedCoursesCount >= 1 && !hasFirstCourseBadge) {
            user.badges.push(MOCK_BADGES.FIRST_COURSE);
            wasUpdated = true;
        }
        if (completedCoursesCount >= 5 && !hasFiveCoursesBadge) {
            user.badges.push(MOCK_BADGES.FIVE_COURSES);
            wasUpdated = true;
        }

        if (wasUpdated) {
            MOCK_USERS[userIndex] = user;
            const { password, ...userWithoutPassword } = user;
            resolve(userWithoutPassword as User);
        } else {
            resolve(null);
        }
    });
};


/**
 * Fetches and aggregates analytics data for the admin dashboard.
 * @returns A promise that resolves to the AnalyticsData object.
 */
export const getAnalyticsData = (): Promise<AnalyticsData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const totalUsers = MOCK_USERS.length;
            const totalLearners = MOCK_USERS.filter(u => u.role === UserRole.LEARNER).length;
            const totalTrainers = MOCK_USERS.filter(u => u.role === UserRole.TRAINER).length;
            const totalCourses = MOCK_COURSES.length;

            const coursePopularity = MOCK_COURSES.map(course => ({
                label: course.title,
                value: course.enrollmentCount
            })).sort((a, b) => b.value - a.value);

            const completionRates = MOCK_COURSES.map(course => {
                const enrolledUsers = MOCK_USERS.filter(u => u.enrolledCourseIds.includes(course.id));
                if (enrolledUsers.length === 0) {
                    return { label: course.title, value: 0 };
                }
                const completedUsers = enrolledUsers.filter(user => {
                    const progress = user.progress?.[course.id] || [];
                    return progress.length === course.lessons.length;
                }).length;
                const rate = (completedUsers / enrolledUsers.length) * 100;
                return { label: course.title, value: Math.round(rate) };
            }).sort((a, b) => b.value - a.value);

            resolve({
                totalUsers,
                totalLearners,
                totalTrainers,
                totalCourses,
                coursePopularity,
                completionRates,
            });
        }, SIMULATED_DELAY);
    });
};

// --- New Functions for Community, Trainer Analytics ---

export const getForumPosts = (courseId: number): Promise<ForumPost[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_FORUM_POSTS.filter(p => p.courseId === courseId));
        }, SIMULATED_DELAY);
    });
};

export const addForumPost = (courseId: number, author: User, title: string, content: string): Promise<ForumPost> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newPost: ForumPost = {
                id: Math.max(...MOCK_FORUM_POSTS.map(p => p.id), 0) + 1,
                courseId,
                authorId: author.id,
                authorName: author.name,
                title,
                content,
                createdAt: new Date().toISOString(),
                replies: [],
            };
            MOCK_FORUM_POSTS.unshift(newPost);
            resolve(newPost);
        }, SIMULATED_DELAY);
    });
};

export const addForumReply = (postId: number, author: User, content: string): Promise<ForumReply> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const postIndex = MOCK_FORUM_POSTS.findIndex(p => p.id === postId);
            if (postIndex === -1) {
                return reject(new Error("Post not found."));
            }
            const post = MOCK_FORUM_POSTS[postIndex];
            const newReply: ForumReply = {
                id: (post.replies.length > 0 ? Math.max(...post.replies.map(r => r.id)) : 0) + 1,
                postId,
                authorId: author.id,
                authorName: author.name,
                content,
                createdAt: new Date().toISOString(),
            };
            post.replies.push(newReply);
            MOCK_FORUM_POSTS[postIndex] = post;
            resolve(newReply);
        }, SIMULATED_DELAY);
    });
};

export const getTrainerAnalyticsData = (trainerId: number): Promise<TrainerAnalyticsData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const trainerCourses = MOCK_COURSES.filter(c => c.trainerId === trainerId);
            if (trainerCourses.length === 0) {
                resolve({ totalEnrollments: 0, avgCompletionRate: 0, totalCourses: 0, lessonDropOffs: [] });
                return;
            }

            const totalEnrollments = trainerCourses.reduce((sum, course) => sum + course.enrollmentCount, 0);
            const totalCourses = trainerCourses.length;

            let totalCompletionRate = 0;
            const lessonDropOffs: { [lessonTitle: string]: number } = {};

            trainerCourses.forEach(course => {
                const enrolledUsers = MOCK_USERS.filter(u => u.enrolledCourseIds.includes(course.id));
                if (enrolledUsers.length > 0) {
                    let completedCount = 0;
                    enrolledUsers.forEach(user => {
                        const progress = user.progress?.[course.id] || [];
                        const isCompleted = progress.length === course.lessons.length;
                        if (isCompleted) {
                            completedCount++;
                        } else if (progress.length > 0) {
                            // Find the last completed lesson ID
                            const lastCompletedLessonId = Math.max(...progress);
                            const lastLesson = course.lessons.find(l => l.id === lastCompletedLessonId);
                            if (lastLesson) {
                                lessonDropOffs[lastLesson.title] = (lessonDropOffs[lastLesson.title] || 0) + 1;
                            }
                        }
                    });
                    totalCompletionRate += (completedCount / enrolledUsers.length) * 100;
                }
            });

            const avgCompletionRate = totalCompletionRate / totalCourses;
            
            const sortedDropOffs = Object.entries(lessonDropOffs)
                .map(([label, value]) => ({ label, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5); // Top 5 drop-off points

            resolve({ totalEnrollments, avgCompletionRate, totalCourses, lessonDropOffs: sortedDropOffs });
        }, SIMULATED_DELAY);
    });
};