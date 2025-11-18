
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { PhotoIcon, SparklesIcon } from '../components/icons/Icons';

// Helper to convert file to base64
const fileToBase64 = (file: File): Promise<{ data: string, type: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const [header, data] = result.split(',');
            const mimeType = header.split(';')[0].split(':')[1];
            resolve({ data, type: mimeType });
        };
        reader.onerror = error => reject(error);
    });
};

const ImageStudioPage: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<{ file: File, previewUrl: string, base64: string, mimeType: string } | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditedImage(null);
            const previewUrl = URL.createObjectURL(file);
            const { data, type } = await fileToBase64(file);
            setOriginalImage({ file, previewUrl, base64: data, mimeType: type });
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalImage) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please enter a prompt to edit the image.');
            return;
        }

        setLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const imageBytes = await editImage(originalImage.base64, originalImage.mimeType, prompt);
            setEditedImage(`data:image/png;base64,${imageBytes}`);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred while editing the image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-blue-600 dark:text-blue-500" />
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">AI Image Studio</h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Edit your images with the power of AI. Upload an image and describe your changes.
                </p>
            </div>

            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
                <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                        <label htmlFor="prompt" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Describe your edits
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Add a retro filter, make the car red..."
                                className="flex-grow w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm"
                                rows={3}
                                disabled={loading || !originalImage}
                            />
                            <button
                                type="submit"
                                disabled={loading || !originalImage || !prompt}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                <SparklesIcon className="w-5 h-5 mr-2 -ml-1" />
                                {loading ? 'Applying...' : 'Apply Edits'}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center py-2">{error}</p>}
                </form>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Original Image */}
                    <div>
                        <h3 className="text-xl font-semibold text-center mb-4">Original</h3>
                        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                             <label htmlFor="image-upload" className="w-full h-full cursor-pointer hover:opacity-80 transition-opacity">
                                {originalImage ? (
                                    <img src={originalImage.previewUrl} alt="Original upload" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-500 dark:text-gray-400 p-4 flex flex-col items-center justify-center h-full">
                                        <PhotoIcon className="h-12 w-12 mx-auto mb-2" />
                                        <p className="font-semibold">Click to upload an image</p>
                                        <p className="text-sm">PNG, JPG, WEBP</p>
                                    </div>
                                )}
                            </label>
                            <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                        </div>
                    </div>

                    {/* Edited Image */}
                     <div>
                        <h3 className="text-xl font-semibold text-center mb-4">Edited</h3>
                        <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
                             {loading ? (
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-2">Applying AI edits...</p>
                                </div>
                            ) : editedImage ? (
                                <img src={editedImage} alt="AI edited result" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 p-4 flex flex-col items-center justify-center h-full">
                                    <PhotoIcon className="h-12 w-12 mx-auto mb-2" />
                                    <p>Your edited image will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageStudioPage;
