import React from 'react';
import { InterviewReport } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { HandThumbUpIcon, HandThumbDownIcon, SpeakerWaveIcon, PlayCircleIcon } from './common/Icons';

interface InterviewReportDisplayProps {
  report: InterviewReport;
  onRetake: () => void;
  onViewRecording: () => void;
  recordingUrl: string | null;
}

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    const color = score > 80 ? 'text-green-500' : score > 65 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative h-40 w-40">
            <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${color}`}>{score}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
            </div>
        </div>
    );
};

const FeedbackList: React.FC<{ title: string; items: string[]; iconType: 'strength' | 'improvement' }> = ({ title, items, iconType }) => (
    <div>
        <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">{title}</h4>
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                        {iconType === 'strength' ? 
                            <HandThumbUpIcon className="h-5 w-5 text-green-500" /> : 
                            <HandThumbDownIcon className="h-5 w-5 text-yellow-500" />
                        }
                    </div>
                    <span className="ml-3 text-gray-600 dark:text-gray-300">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const InterviewReportDisplay: React.FC<InterviewReportDisplayProps> = ({ report, onRetake, onViewRecording, recordingUrl }) => {
  return (
    <Card className="animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Interview Performance Report</h2>
      <div className="flex flex-col items-center justify-center mb-6">
        <ScoreCircle score={report.overallScore} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <FeedbackList 
            title="Strengths"
            items={report.strengths}
            iconType="strength"
        />
        <FeedbackList 
            title="Areas for Improvement"
            items={report.areasForImprovement}
            iconType="improvement"
        />
      </div>

      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Detailed Analysis</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {Object.entries(report.detailedFeedback).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-start space-x-3">
                    <div className="flex-shrink-0 bg-brand-100 dark:bg-brand-900/50 p-2 rounded-full mt-1">
                      <SpeakerWaveIcon className="h-5 w-5 text-brand-700 dark:text-brand-300"/>
                    </div>
                    <div>
                      <p className="font-semibold capitalize text-gray-700 dark:text-gray-200">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-gray-600 dark:text-gray-300">{value}</p>
                    </div>
                </div>
            ))}
          </div>
      </div>

       <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button onClick={onRetake} variant="light">
                Take Interview Again
            </Button>
            {recordingUrl && (
                <Button onClick={onViewRecording} variant="primary">
                    <PlayCircleIcon className="h-5 w-5 mr-2"/>
                    View Your Recording
                </Button>
            )}
      </div>
    </Card>
  );
};

export default InterviewReportDisplay;