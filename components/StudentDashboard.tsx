import React, { useState } from 'react';
import { Student, Notification } from '../types';
import Profile from './Profile';
import InternshipRecommendations from './InternshipRecommendations';
import Upskilling from './Upskilling';
import MentorChat from './MentorChat';
import Simulator from './Simulator';
import CertificatesPage from './CertificatesPage';
import AIMockInterview from './AIMockInterview';

interface StudentDashboardProps {
  student: Student;
  addNotification: (notification: Omit<Notification, 'id' | 'userType' | 'read'>) => void;
  activeView: string;
  onUpdateStudent: (student: Student) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, addNotification, activeView, onUpdateStudent }) => {
    
    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return <InternshipRecommendations student={student} addNotification={addNotification} />;
            case 'profile':
                return <Profile student={student} onUpdateStudent={onUpdateStudent} />;
            case 'upskilling':
                return <Upskilling student={student} />;
            case 'mentor':
                return <MentorChat student={student} />;
            case 'simulator':
                return <Simulator student={student} addNotification={addNotification} />;
            case 'interview':
                return <AIMockInterview student={student} />;
            case 'certificates':
                return <CertificatesPage />;
            default:
                return <InternshipRecommendations student={student} addNotification={addNotification} />;
        }
    }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {renderContent()}
    </div>
  );
};

export default StudentDashboard;