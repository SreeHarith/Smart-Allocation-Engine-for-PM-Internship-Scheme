import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CandidateProfileView from './CandidateProfileView';
import { Student } from '../types';
import Button from './common/Button';
import { ChevronLeftIcon } from './common/Icons';

const CandidateDetailsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [student, setStudent] = useState<Student | null>(location.state?.student || null);

    // Initial check (if navigated directly without state, we might need to fetch - not implemented here for MVP without API)
    useEffect(() => {
        if (!student && id) {
            // Ideally fetchUser(id) here. For now, redirect back if no data.
            console.warn("No student data passed to details page.");
            // navigate('/company/dashboard');
        }
    }, [student, id, navigate]);

    if (!student) {
        return (
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Student details not found.</p>
                <Button onClick={() => navigate('/company/dashboard')} variant="secondary">Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="text"
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Applicants
                </Button>

                {/* Reuse the Profile Component but ensure it takes full width/height naturally */}
                <div className="shadow-2xl rounded-2xl overflow-hidden">
                    <CandidateProfileView student={student} />
                </div>
            </div>
        </div>
    );
};

export default CandidateDetailsPage;
