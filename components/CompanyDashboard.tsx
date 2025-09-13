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
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {company.name}
          </h1>
          {renderContent()}
        </div>
        <ConfirmationModal
            isOpen={!!internshipToWithdraw}
            onClose={() => setInternshipToWithdraw(null)}
            onConfirm={handleWithdrawConfirm}
            title="Confirm Withdrawal"
            message={`Are you sure you want to withdraw the internship posting for "${internshipToWithdraw?.title}"? This action cannot be undone.`}
            confirmText="Withdraw"
            variant="danger"
        />
    </div>
  );
};

export default CompanyDashboard;
