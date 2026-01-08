import React, { useState, useMemo } from 'react';
import { Student, Notification, Internship } from '../types';
import { getTopMatches } from '../services/matchingService';
import { api } from '../services/api';
import InternshipCard from './InternshipCard';
import Button from './common/Button';
import { ArrowPathIcon, BriefcaseIcon } from './common/Icons';
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

  const [topMatches, setTopMatches] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const matches = await getTopMatches(student, 6, dislikedIds);
      setTopMatches(matches);
      setLoading(false);
    };
    fetchMatches();
  }, [student, dislikedIds, refreshKey]);

  const handleDislike = (internshipId: number) => {
    setDislikedIds(prev => [...prev, internshipId]);
  };

  const handleApply = async (internshipId: number, internshipTitle: string) => {
    try {
      await api.applyToInternship(internshipId, student.id);
      setAppliedIds(prev => [...prev, internshipId]);
      addNotification({
        message: `Successfully applied for the "${internshipTitle}" internship!`,
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      addNotification({
        message: `Failed to apply for "${internshipTitle}". Please try again.`,
        type: 'error',
      });
    }
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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Recommended for You</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Based on your skills and preferences</p>
        </div>
        <Button onClick={handleRefresh} variant="light" size="md" disabled={isRefreshing} className="!rounded-2xl border-gray-100">
          {isRefreshing ? (
            <Spinner />
          ) : (
            <>
              <ArrowPathIcon className="h-4 w-4 text-brand-500" />
              <span className="ml-2">Refresh Matches</span>
            </>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : topMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-premium border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-500 mb-6">
            <BriefcaseIcon className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">No More Recommendations</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            You've reviewed all top matches for now. We'll notify you when new opportunities that match your profile arrive!
          </p>
          <Button variant="light" className="mt-8" onClick={() => setDislikedIds([])}>Reset Preferences</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {topMatches.map(internship => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              student={student}
              onDislike={handleDislike}
              onApply={handleApply}
              onWithdraw={handleWithdraw}
              isApplied={appliedIds.includes(internship.id)}
              score={(internship as any).score}
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