import React, { useState } from 'react';
import { generateImageFromPrompt } from '../services/geminiService';
import { PhotoIcon, SparklesIcon, XMarkIcon } from './icons/Icons';

interface ImageGenerationModalProps {
  onClose: () => void;
  onImageSelect: (base64Data: string) => void;
}

const ImageGenerationModal: React.FC<ImageGenerationModalProps> = ({ onClose, onImageSelect }) => {
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
      setGeneratedImage(imageBytes); // Store raw base64 bytes
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageSelect(generatedImage);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-gen-title"
    >
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col relative transform transition-all">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate flex items-center" id="image-gen-title">
            <SparklesIcon className="w-5 h-5 mr-2 text-blue-500" />
            Find Media with AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close image generator"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6">
          <form onSubmit={handleGenerateImage} className="space-y-4">
            <div>
              <label htmlFor="modal-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image Description
              </label>
              <textarea
                id="modal-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A clean engine bay of a classic muscle car"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 sm:text-sm"
                rows={3}
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          <div className="mt-6 w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
            {loading ? (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm">Generating...</p>
              </div>
            ) : generatedImage ? (
              <img src={`data:image/png;base64,${generatedImage}`} alt="AI generated" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                <PhotoIcon className="h-10 w-10 mx-auto mb-2" />
                <p className="text-sm">Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </main>

        <footer className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUseImage}
            disabled={!generatedImage || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-green-400"
          >
            Use this Image
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ImageGenerationModal;
