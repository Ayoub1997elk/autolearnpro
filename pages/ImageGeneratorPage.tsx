
import React, { useState } from 'react';
import { generateImageFromPrompt } from '../services/geminiService';
import { PhotoIcon, SparklesIcon } from '../components/icons/Icons';

const ImageGeneratorPage: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a prompt.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const imageBytes = await generateImageFromPrompt(prompt);
            setGeneratedImage(`data:image/png;base64,${imageBytes}`);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">AI Image Generator</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Create stunning visuals for your course materials with a simple text prompt.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                    <form onSubmit={handleGenerateImage} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Left Side: Prompt Input */}
                        <div className="flex flex-col h-full">
                             <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Describe the image you want to create:
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A futuristic electric car engine, glowing with blue neon lights, cinematic style"
                                className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm"
                                rows={6}
                                disabled={loading}
                            />
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                                {loading ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                        
                        {/* Right Side: Image Display */}
                        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                            {loading ? (
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-2">Generating your image...</p>
                                </div>
                            ) : generatedImage ? (
                                <img src={generatedImage} alt="AI generated" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                                    <PhotoIcon className="h-12 w-12 mx-auto mb-2" />
                                    <p>Your generated image will appear here.</p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ImageGeneratorPage;
