import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostInternshipForm from './PostInternshipForm';
import PostedInternshipsList from './PostedInternshipsList';
import { Company, Internship } from '../types';
import ApplicantTable from './ApplicantTable';
import Button from './common/Button';
import ConfirmationModal from './common/ConfirmationModal';

import { api } from '../services/api';

interface CompanyDashboardProps {
    company: Company;
    activeView: string;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ company, activeView }) => {
    const navigate = useNavigate();
    const [selectedInternshipForApplicants, setSelectedInternshipForApplicants] = useState<Internship | null>(null);
    const [internshipToEdit, setInternshipToEdit] = useState<Internship | null>(null);
    const [internshipToWithdraw, setInternshipToWithdraw] = useState<Internship | null>(null);
    const [isPosting, setIsPosting] = useState(false);

    // Manage internships in state so they can be modified
    const [postedInternships, setPostedInternships] = useState<Internship[]>([]);

    useEffect(() => {
        const fetchInternships = async () => {
             try {
                const allInternships = await api.getInternships();
                // Filter for this company's internships
                const myInternships = allInternships.filter(i => i.company === company.name);
                setPostedInternships(myInternships);
             } catch (e) {
                 console.error("Failed to fetch internships", e);
             }
        }
        fetchInternships();
    }, [company.name, activeView]); // Re-fetch when view changes (e.g. after posting)

    // Reset view when sidebar navigation changes
    useEffect(() => {
        setIsPosting(activeView === 'post');
        setInternshipToEdit(null);
        setSelectedInternshipForApplicants(null);
    }, [activeView]);


    const handleSaveInternship = async (internshipData: Omit<Internship, 'id' | 'company' | 'sector' | 'deadline' | 'companySize'> & { id?: number }) => {
        if (internshipToEdit) {
            // Update existing internship - API update logic would go here (not yet implemented in backend)
            // setPostedInternships(prev => prev.map(i => i.id === internshipToEdit.id ? { ...i, ...internshipData } as Internship : i));
            console.warn("Update not yet implemented in backend");
        } else {
            // Add new internship
            const newInternshipBase: Internship = {
                ...internshipData,
                id: Date.now(), // specific ID logic might be handled by backend, but we send a placeholder or 0
                company: company.name,
                sector: 'Tech', // Placeholder
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
                companySize: 'Mid-size', // Placeholder
            };
            
            try {
                const createdInternship = await api.createInternship(newInternshipBase);
                setPostedInternships(prev => [createdInternship, ...prev]);
                // Redirect to dashboard to see the new internship
                navigate('/company/dashboard');
            } catch (e) {
                console.error("Failed to create internship", e);
            }
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

                <div></div>
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
