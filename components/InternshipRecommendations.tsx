import React, { useState, useMemo } from 'react';
import { Student, Notification, Internship } from '../types';
import { getTopMatches } from '../services/matchingService';
import InternshipCard from './InternshipCard';
import Button from './common/Button';
import { ArrowPathIcon } from './common/Icons';
import Spinner from './common/Spinner';
import ConfirmationModal from './common/ConfirmationModal';

interface InternshipRecommendationsProps {
  student: Student;
  addNotification: (notification: Omit<Notification, 'id' | 'userType' | 'read'>) => void;
}

const InternshipRecommendations: React.FC<InternshipRecommendationsProps> = ({ student, addNotification }) => {
  const [dislikedIds, setDislikedIds] = useState<number[]>([]);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [internshipToWithdraw, setInternshipToWithdraw] = useState<Internship | null>(null);

  const topMatches = useMemo(() => {
    const matches = getTopMatches(student, 6, dislikedIds);
    // Simulate a dynamic refresh by shuffling the results.
    // In a real app, this would be a new fetch.
    for (let i = matches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matches[i], matches[j]] = [matches[j], matches[i]];
    }
    return matches;
  }, [student, dislikedIds, refreshKey]);

  const handleDislike = (internshipId: number) => {
    setDislikedIds(prev => [...prev, internshipId]);
  };

  const handleApply = (internshipId: number, internshipTitle: string) => {
    setAppliedIds(prev => [...prev, internshipId]);
    addNotification({
      message: `Successfully applied for the "${internshipTitle}" internship!`,
      type: 'success',
    });
  };

  const handleWithdraw = (internship: Internship) => {
    setInternshipToWithdraw(internship);
  };

  const handleConfirmWithdrawal = () => {
    if (internshipToWithdraw) {
      setAppliedIds(prev => prev.filter(id => id !== internshipToWithdraw.id));
      addNotification({
        message: `Your application for "${internshipToWithdraw.title}" has been withdrawn.`,
        type: 'info',
      });
      setInternshipToWithdraw(null);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
        setRefreshKey(prev => prev + 1);
        setIsRefreshing(false);
    }, 1000); // Simulate network delay
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Top Recommendations</h2>
            <Button onClick={handleRefresh} variant="light" size="sm" disabled={isRefreshing} className="min-w-[100px]">
                {isRefreshing ? (
                    <Spinner />
                ) : (
                    <>
                        <ArrowPathIcon className="h-4 w-4" />
                        <span className="ml-2">Refresh</span>
                    </>
                )}
            </Button>
        </div>
        
        {topMatches.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">No More Recommendations</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    You've reviewed all top matches for now. Check back later for new opportunities!
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topMatches.map(internship => (
                    <InternshipCard 
                        key={internship.id} 
                        internship={internship} 
                        student={student}
                        onDislike={handleDislike}
                        onApply={handleApply}
                        onWithdraw={handleWithdraw}
                        isApplied={appliedIds.includes(internship.id)}
                    />
                ))}
            </div>
        )}

        <ConfirmationModal
            isOpen={!!internshipToWithdraw}
            onClose={() => setInternshipToWithdraw(null)}
            onConfirm={handleConfirmWithdrawal}
            title="Confirm Application Withdrawal"
            message={`Are you sure you want to withdraw your application for "${internshipToWithdraw?.title}"? This action cannot be undone.`}
            confirmText="Withdraw"
            variant="danger"
        />
    </div>
  );
};

export default InternshipRecommendations;