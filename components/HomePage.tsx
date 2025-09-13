import React, { useState } from 'react';
import { GovIcon, BriefcaseIcon, WalletIcon, GraduationCapIcon, FamilyIcon, OneTimeGrantIcon, SectorsIcon } from './common/Icons';
import Button from './common/Button';

interface HomePageProps {
  onLogin: (role: 'STUDENT' | 'COMPANY' | 'ADMIN') => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; details?: React.ReactNode }> = ({ icon, title, subtitle, details }) => (
  <div className="bg-gray-100/50 dark:bg-gray-800/50 p-6 rounded-lg text-center flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="font-bold text-lg text-accent-500">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300 text-sm">{subtitle}</p>
    {details && <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{details}</div>}
  </div>
);

const LoginModal: React.FC<{ onLogin: HomePageProps['onLogin']; onClose: () => void }> = ({ onLogin, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center animate-fade-in-up" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
      <h2 className="text-2xl font-bold text-center mb-6 text-brand-700 dark:text-brand-400">Select Your Role</h2>
      <div className="space-y-4">
        <Button onClick={() => onLogin('STUDENT')} className="w-full" variant="primary">Login as Student</Button>
        <Button onClick={() => onLogin('COMPANY')} className="w-full" variant="primary">Login as Company</Button>
        <Button onClick={() => onLogin('ADMIN')} className="w-full" variant="light">Login as Admin</Button>
      </div>
    </div>
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900">
      {isModalOpen && <LoginModal onLogin={onLogin} onClose={() => setIsModalOpen(false)} />}
      
      {/* Header */}
      <header className="bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GovIcon className="h-10 w-10" />
              <div>
                 <span className="text-xl font-bold text-gray-800 dark:text-white block">PM AI Internship</span>
                 <span className="text-xs text-gray-500 dark:text-gray-400">Ministry of Corporate Affairs</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="secondary">Youth Registration</Button>
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>Login</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="bg-brand-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Find Your Future</h1>
              <h2 className="text-3xl sm:text-4xl font-semibold text-accent-400">AI-Powered Internship Matching.</h2>
              <p className="mt-4 text-lg text-brand-100">Discover the perfect internship based on your skills and career goals. Our AI ensures a fair and transparent allocation process.</p>
              <Button size="lg" variant="secondary" className="mt-8" onClick={() => setIsModalOpen(true)}>Explore Internships</Button>
            </div>
            <div className="mt-12 md:mt-0 md:w-1/2 flex justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.jpg" alt="PM Narendra Modi" className="rounded-lg shadow-2xl max-w-sm w-full object-cover" />
            </div>
          </div>
        </div>

        {/* Info Sections */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Eligibility Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Are you <span className="text-accent-500">Eligible?</span></h2>
              <div className="grid grid-cols-2 gap-6">
                <InfoCard icon={<div className="text-5xl font-bold text-red-500 bg-red-100 dark:bg-red-900/50 rounded-full h-20 w-20 flex items-center justify-center">21</div>} title="Age" subtitle="21-24 Years" />
                <InfoCard icon={<BriefcaseIcon className="h-20 w-20 text-brand-700 dark:text-brand-300"/>} title="Job Status" subtitle="Not Employed Full Time" />
                <InfoCard icon={<GraduationCapIcon className="h-20 w-20 text-brand-700 dark:text-brand-300"/>} title="Education" subtitle="Not Enrolled Full Time" />
                <InfoCard icon={<FamilyIcon className="h-20 w-20 text-green-500 dark:text-green-400"/>} title="Family (Self/ Spouse / Parents)" subtitle="" details="No one is Earning more than 1LPA" />
              </div>
            </div>

            {/* Core Benefits Section */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Core Benefits for <span className="text-accent-500">PM Internship Scheme</span></h2>
              <div className="grid grid-cols-2 gap-6">
                <InfoCard icon={<BriefcaseIcon className="h-16 w-16 text-blue-500"/>} title="Real-life Experience" subtitle="12 months in India's top companies" />
                <InfoCard icon={<WalletIcon className="h-16 w-16 text-yellow-600"/>} title="Monthly Assistance" subtitle="₹4500 by Govt and ₹500 by Industry" />
                <InfoCard icon={<OneTimeGrantIcon className="h-16 w-16 text-green-600"/>} title="One-time Grant" subtitle="₹6000 for transport & lodging" />
                <InfoCard icon={<SectorsIcon className="h-16 w-16 text-purple-600"/>} title="Various Sectors" subtitle="Select from a wide range of industries" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;