import React from 'react';

interface RecordingPlayerModalProps {
  videoUrl: string;
  onClose: () => void;
}

const RecordingPlayerModal: React.FC<RecordingPlayerModalProps> = ({ videoUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in-up" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your Interview Recording</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        <div className="p-4">
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            className="w-full h-auto max-h-[75vh] rounded-md"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default RecordingPlayerModal;
