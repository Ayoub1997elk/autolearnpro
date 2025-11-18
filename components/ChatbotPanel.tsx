import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { Lesson, ChatMessage } from '../types';
import { XMarkIcon, SparklesIcon } from './icons/Icons';

interface ChatbotPanelProps {
  lessons: Lesson[];
  courseTitle: string;
  onClose: () => void;
}

const ChatbotPanel: React.FC<ChatbotPanelProps> = ({ lessons, courseTitle, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session when the component mounts
    const initializeChat = async () => {
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        setMessages([{ role: 'model', text: 'AI Assistant is offline. API key is missing.' }]);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const courseContent = lessons.map(l => `Lesson: ${l.title}\n${l.content}`).join('\n\n---\n\n');
        
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are an expert AI Learning Assistant for an automotive course titled "${courseTitle}". Your role is to answer student questions based ONLY on the provided course material. Be friendly, encouraging, and clear in your explanations. If a question is outside the scope of the provided content, politely state that you can only answer questions related to the course material. The course content is as follows:\n\n${courseContent}`,
          },
        });
        setChat(newChat);
        setMessages([{ role: 'model', text: `Hi! I'm your AI assistant for "${courseTitle}". Ask me anything about the course content!` }]);
      } catch (error) {
        console.error("Failed to initialize AI chat:", error);
        setMessages([{ role: 'model', text: 'Sorry, I am having trouble connecting right now.' }]);
      }
    };

    initializeChat();
  }, [courseTitle, lessons]);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const modelMessage: ChatMessage = { role: 'model', text: response.text };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error sending message to AI:", error);
      const errorMessage: ChatMessage = { role: 'model', text: 'I seem to be having trouble responding. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div 
      className="absolute inset-0 bg-white dark:bg-gray-800 flex flex-col z-10 animate-slide-in-right"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chatbot-title"
    >
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center" id="chatbot-title">
          <SparklesIcon className="w-6 h-6 mr-2 text-blue-500" />
          AI Learning Assistant
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          aria-label="Close chat"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-lg">
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
            disabled={isLoading || !chat}
          />
          <button
            type="submit"
            disabled={isLoading || !chat || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed font-semibold"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatbotPanel;
