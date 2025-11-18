
import React, { useRef } from 'react';
import { XMarkIcon, LogoIcon } from './icons/Icons';

interface CertificateModalProps {
  courseTitle: string;
  userName: string;
  completionDate: string;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ courseTitle, userName, completionDate, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // A simplified approach to render HTML to a canvas without external libraries
  const drawHtmlToCanvas = (element: HTMLElement, canvas: HTMLCanvasElement) => {
    const { width, height } = element.getBoundingClientRect();
    canvas.width = width * 2; // Increase resolution for better quality
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    ctx.scale(2, 2);

    const htmlString = new XMLSerializer().serializeToString(element);

    // Create an SVG with a foreignObject to embed the HTML, then draw it to the canvas
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color: black; font-size: 16px;">
            ${htmlString}
          </div>
        </foreignObject>
      </svg>
    `;

    const img = new Image();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `Certificate-${courseTitle.replace(/\s/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  };


  const handleDownload = () => {
    const certificateElement = certificateRef.current;
    if (certificateElement) {
        // Create a temporary canvas
        const canvas = document.createElement('canvas');
        drawHtmlToCanvas(certificateElement, canvas);
    }
  };


  return (
    <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="certificate-title"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col relative">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate" id="certificate-title">
            Certificate of Completion
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close certificate"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>

        <main className="p-4 md:p-8">
            <div ref={certificateRef} className="bg-slate-50 dark:bg-slate-900 p-8 border-4 border-double border-yellow-600 dark:border-yellow-400 aspect-[4/3] flex flex-col items-center justify-center text-center text-gray-800 dark:text-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                    <LogoIcon className="h-12" />
                    <span className="text-2xl font-bold">AutoLearnPro</span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-yellow-700 dark:text-yellow-400 mb-2">Certificate of Completion</h1>
                <p className="text-lg mb-6">This certificate is proudly presented to</p>
                <p className="text-5xl font-extrabold font-['cursive'] text-blue-800 dark:text-blue-300 mb-6 tracking-wide">{userName}</p>
                <p className="text-lg mb-2">for successfully completing the course</p>
                <p className="text-3xl font-bold mb-8">{courseTitle}</p>
                <p className="text-sm">Completed on: {completionDate}</p>
            </div>
        </main>
        
        <footer className="p-4 flex justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Download Certificate
            </button>
        </footer>

      </div>
    </div>
  );
};

export default CertificateModal;