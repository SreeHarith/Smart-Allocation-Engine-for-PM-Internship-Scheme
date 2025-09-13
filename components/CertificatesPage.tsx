import React, { useState } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { verifyCredential } from '../services/blockchainService';
import { CheckBadgeIcon, GraduationCapIcon } from './common/Icons';

const CertificatesPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);

  const completedInternship = {
    title: 'AI Product Management Intern',
    company: 'InnovateAI Corp',
  };

  const handleGenerateCertificate = async () => {
    setIsVerifying(true);
    setVerificationHash(null);
    const credential = `${completedInternship.title} at ${completedInternship.company}`;
    const hash = await verifyCredential(credential);
    setVerificationHash(hash);
    setIsVerifying(false);
  };

  return (
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Certificates</h1>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="bg-brand-100 dark:bg-brand-900/50 p-3 rounded-full">
                    <GraduationCapIcon className="h-10 w-10 text-brand-700 dark:text-brand-300" />
                </div>
                <div className="flex-grow">
                    <h2 className="font-bold text-lg text-gray-800 dark:text-white">{completedInternship.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{completedInternship.company}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">COMPLETED</p>
                </div>
                <div className="w-full sm:w-auto">
                    <Button onClick={handleGenerateCertificate} isLoading={isVerifying} disabled={isVerifying || !!verificationHash}>
                        {verificationHash ? 'Certificate Generated' : 'Generate Blockchain Certificate'}
                    </Button>
                </div>
            </div>

            {verificationHash && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-md border border-green-200 dark:border-green-700">
                    <div className="flex items-center">
                        <CheckBadgeIcon className="h-6 w-6 mr-3 text-green-500" />
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-200">Verified on Blockchain (Mock)</p>
                            <p className="font-mono text-xs text-green-700 dark:text-green-300 break-all mt-1">Tx Hash: {verificationHash}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </Card>
  );
};

export default CertificatesPage;
