import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, Course, User, TrainerAnalyticsData } from '../types';

export const generateCourseOutline = async (topic: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // This is a fallback for development if the API key is not set.
    // In a real environment, this should be handled more gracefully.
    console.error("API_KEY environment variable not set.");
    return Promise.resolve(JSON.stringify(
        {
          title: `Course Outline for ${topic}`,
          modules: [
            {
              title: "Module 1: Introduction",
              lessons: ["Lesson 1.1: Overview", "Lesson 1.2: Key Concepts"]
            },
            {
              title: "Module 2: Core Principles",
              lessons: ["Lesson 2.1: Principle A", "Lesson 2.2: Principle B"]
            }
          ]
        }, null, 2
    ));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a detailed course outline for the topic: "${topic}". The topic is related to the automotive industry. The outline should be in JSON format. It should include a main title for the course, and a list of modules. Each module should have a title and a list of lesson titles.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  lessons: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['title', 'lessons']
              }
            }
          },
          required: ['title', 'modules']
        }
      },
    });
    // FIX: Trim whitespace from the response before returning, as it can interfere with JSON parsing.
    return response.text.trim();
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw new Error("Failed to generate course outline from AI.");
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Fallback for development: return a placeholder image as base64
    const placeholderSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#cccccc"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">AI Image Placeholder</text></svg>`;
    return btoa(placeholderSvg);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    } else {
        throw new Error("No image was generated.");
    }

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image from AI.");
  }
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Fallback for development: return a placeholder image as base64
    const placeholderSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#cccccc"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">AI Edited Image</text></svg>`;
    return btoa(placeholderSvg);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("No edited image was generated.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw new Error("Failed to edit image with AI.");
  }
};


export const generateQuiz = async (courseTitle: string, courseContent: string): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Fallback for development
    return Promise.resolve([
      { question: "What is the first stroke of a four-stroke engine?", options: ["Intake", "Compression", "Power", "Exhaust"], correctAnswer: "Intake" },
      { question: "What does Ohm's law state?", options: ["V = I/R", "V = I*R", "R = V*I", "I = V+R"], correctAnswer: "V = I*R" },
      { question: "Which component converts torque in an automatic transmission?", options: ["Planetary Gear Set", "Valve Body", "Torque Converter", "Clutch Pack"], correctAnswer: "Torque Converter" },
    ]);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Generate a 5-question multiple-choice quiz for an automotive course titled "${courseTitle}". The quiz should test knowledge from the following content. For each question, provide 4 options and clearly indicate the correct answer. The content is: \n\n${courseContent}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING }
                },
                required: ['question', 'options', 'correctAnswer']
              }
            }
          },
          required: ['quiz']
        }
      },
    });
    // FIX: Trim whitespace from the response before parsing, as it can interfere with JSON parsing.
    const quizData = JSON.parse(response.text.trim());
    return quizData.quiz;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz from AI.");
  }
};


export const generateLessonContent = async (courseTitle: string, lessonTitle: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Fallback for development
    return Promise.resolve(`This is AI-generated placeholder content for the lesson "${lessonTitle}" in the course "${courseTitle}".\n\nIt would normally contain a detailed explanation of the topic, including key concepts, examples, and practical applications relevant to the automotive industry. Since the API key is not available, this is a simulated response.`);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are an expert curriculum developer for the automotive industry. Write detailed and engaging lesson content for a lesson titled "${lessonTitle}". This lesson is part of a larger course called "${courseTitle}". The content should be clear, informative, and suitable for someone learning this topic. Break down complex concepts into easy-to-understand explanations. Include practical examples where applicable. The output should be plain text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating lesson content:", error);
    throw new Error("Failed to generate lesson content from AI.");
  }
};


export const generateCourseRecommendations = async (user: User, allCourses: Course[]): Promise<{ recommendations: { courseId: number; justification: string }[] }> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return Promise.resolve({ recommendations: [] });
  }

  const enrolledCourses = allCourses.filter(c => user.enrolledCourseIds.includes(c.id));
  const unenrolledCourses = allCourses.filter(c => !user.enrolledCourseIds.includes(c.id));

  if (unenrolledCourses.length === 0) {
    return Promise.resolve({ recommendations: [] });
  }

  const prompt = `
    You are an academic advisor for an online automotive learning platform.
    A learner named ${user.name} needs course recommendations.
    
    Here are the courses they have already enrolled in:
    ${enrolledCourses.map(c => `- ${c.title} (Level: ${c.level}, Category: ${c.category})`).join('\n')}
    
    Here are the available courses they have NOT enrolled in:
    ${unenrolledCourses.map(c => `- ID: ${c.id}, Title: ${c.title} (Level: ${c.level}, Category: ${c.category})`).join('\n')}
    
    Based on their enrolled courses, please recommend up to 3 courses from the available list. For each recommendation, provide a short, encouraging justification (one sentence) explaining why it's a good next step for them.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  courseId: { type: Type.NUMBER },
                  justification: { type: Type.STRING }
                },
                required: ['courseId', 'justification']
              }
            }
          },
          required: ['recommendations']
        }
      },
    });
    // FIX: Trim whitespace from the response before parsing, as it can interfere with JSON parsing.
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to generate course recommendations.");
  }
};


export const generateTrainerInsights = async (analytics: TrainerAnalyticsData, trainerName: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return Promise.resolve("AI insights are currently unavailable.");
  }

  const prompt = `
    You are a data analyst and instructional design coach for an online learning platform.
    You are analyzing the performance of courses created by a trainer named ${trainerName}.
    
    Here is their data:
    - Total Enrollments across all courses: ${analytics.totalEnrollments}
    - Average Completion Rate: ${analytics.avgCompletionRate.toFixed(1)}%
    - Most common lesson drop-off points:
    ${analytics.lessonDropOffs.map(item => `  - "${item.label}": ${item.value} learners stopped here`).join('\n')}
    
    Based on this data, provide 2-3 actionable, encouraging, and concise insights for ${trainerName}. The tone should be helpful and constructive. Start each insight with a clear heading (e.g., "**High Engagement!**" or "**Opportunity Area:**").
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating trainer insights:", error);
    throw new Error("Failed to generate trainer insights.");
  }
};

export const getAIForumResponse = async (postTitle: string, postContent: string, courseContent: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return Promise.resolve("I'm sorry, the AI assistant is currently offline.");
  }

  const prompt = `
    You are an AI Teaching Assistant for an automotive course. A student has asked a question in the course discussion forum.
    Your task is to provide a helpful and accurate answer based *only* on the provided course content.
    Do not use any external knowledge. If the answer isn't in the provided material, state that you can't find the information within the course content.
    
    **Course Content:**
    ---
    ${courseContent}
    ---
    
    **Student's Question:**
    - Title: "${postTitle}"
    - Question: "${postContent}"
    
    Please provide your answer below.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating AI forum response:", error);
    throw new Error("Failed to generate AI forum response.");
  }
};