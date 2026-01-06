import React, { useState, useEffect } from 'react';
import PostInternshipForm from './PostInternshipForm';
import PostedInternshipsList from './PostedInternshipsList';
import { Company, Internship } from '../types';
import ApplicantTable from './ApplicantTable';
import Button from './common/Button';
import { INTERNSHIPS } from '../constants'; // Need to manage internships in state
import ConfirmationModal from './common/ConfirmationModal';

interface CompanyDashboardProps {
    company: Company;
    activeView: string;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ company, activeView }) => {
    const [selectedInternshipForApplicants, setSelectedInternshipForApplicants] = useState<Internship | null>(null);
    const [internshipToEdit, setInternshipToEdit] = useState<Internship | null>(null);
    const [internshipToWithdraw, setInternshipToWithdraw] = useState<Internship | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    // Manage internships in state so they can be modified
    const [postedInternships, setPostedInternships] = useState<Internship[]>(
        () => INTERNSHIPS.filter(i => i.company === 'InnovateAI Corp' || i.company === 'WebSolutions Ltd.')
    );

    // Reset view when sidebar navigation changes
    useEffect(() => {
        setIsPosting(activeView === 'post');
        setInternshipToEdit(null);
        setSelectedInternshipForApplicants(null);
    }, [activeView]);


    const handleSaveInternship = (internshipData: Omit<Internship, 'id' | 'company' | 'sector' | 'deadline' | 'companySize'> & { id?: number }) => {
        if (internshipToEdit) {
            // Update existing internship
            setPostedInternships(prev => prev.map(i => i.id === internshipToEdit.id ? { ...i, ...internshipData } as Internship : i));
        } else {
            // Add new internship
            const newInternship: Internship = {
                ...internshipData,
                id: Date.now(),
                company: company.name,
                sector: 'Tech', // Placeholder
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                companySize: 'Mid-size', // Placeholder
            };
            setPostedInternships(prev => [newInternship, ...prev]);
        }
        setInternshipToEdit(null);
        setIsPosting(false);
    };

    const handleWithdrawConfirm = () => {
        if (internshipToWithdraw) {
            setPostedInternships(prev => prev.filter(i => i.id !== internshipToWithdraw.id));
            setInternshipToWithdraw(null);
        }
    };

    const handleCancelEdit = () => {
        setInternshipToEdit(null);
        setIsPosting(false);
    };

    const renderContent = () => {
        if (selectedInternshipForApplicants) {
            return (
                <div>
                    <Button onClick={() => setSelectedInternshipForApplicants(null)} variant="light" size="sm" className="mb-4">
                        &larr; Back to All Internships
                    </Button>
                    <ApplicantTable internship={selectedInternshipForApplicants} />
                </div>
            );
        }

        if (isPosting || internshipToEdit) {
            return (
                <PostInternshipForm
                    onSave={handleSaveInternship}
                    onCancel={handleCancelEdit}
                    internshipToEdit={internshipToEdit}
                />
            );
        }

        return (
            <PostedInternshipsList
                internships={postedInternships}
                onViewApplicants={setSelectedInternshipForApplicants}
                onEdit={setInternshipToEdit}
                onWithdraw={setInternshipToWithdraw}
            />
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white leading-tight">
                        Hello, <span className="text-brand-600">{company.name}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage your active internship postings and applicants</p>
                </div>

                <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="px-4 py-2 text-center border-r border-gray-100 dark:border-gray-700">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active</div>
                        <div className="text-xl font-display font-black text-gray-900 dark:text-white">{postedInternships.length}</div>
                    </div>
                    <div className="px-4 py-2 text-center">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">New Applied</div>
                        <div className="text-xl font-display font-black text-emerald-500">24</div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {renderContent()}
            </div>

            <ConfirmationModal
                isOpen={!!internshipToWithdraw}
                onClose={() => setInternshipToWithdraw(null)}
                onConfirm={handleWithdrawConfirm}
                title="Withdraw Posting"
                message={`Are you sure you want to withdraw "${internshipToWithdraw?.title}"? All current applications will be archived.`}
                confirmText="Withdraw Posting"
                variant="danger"
            />
        </div>
    );
};

export default CompanyDashboard;
