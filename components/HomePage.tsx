import React, { useState } from 'react';
import { GovIcon, BriefcaseIcon, WalletIcon, GraduationCapIcon, FamilyIcon, OneTimeGrantIcon, SectorsIcon, BuildingLibraryIcon, CheckCircleIcon, UserGroupIcon, ChartPieIcon, BeakerIcon } from './common/Icons';
import Button from './common/Button';

interface HomePageProps {
  onLogin: (role: 'STUDENT' | 'COMPANY' | 'ADMIN') => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; details?: React.ReactNode }> = ({ icon, title, subtitle, details }) => (
  <div className="bg-white/70 backdrop-blur-md dark:bg-gray-800/70 p-8 rounded-2xl flex flex-col items-center text-center shadow-premium hover:shadow-premium-hover transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
    <div className="mb-6 p-4 bg-brand-50 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400">
      {icon}
    </div>
    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{subtitle}</p>
    {details && <div className="mt-4 px-4 py-1.5 bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300 text-xs font-medium rounded-full">{details}</div>}
  </div>
);

const HomePage: React.FC<HomePageProps> = ({ onLogin }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen selection:bg-brand-100 selection:text-brand-900">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-600 p-2 rounded-xl shadow-lg shadow-brand-200">
                <GovIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-extrabold text-gray-900 dark:text-white tracking-tight italic">PM Internship <span className="text-brand-600">AI</span></span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Govt of India Initiative</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a href="#" className="hover:text-brand-600 transition-colors">Eligibility</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Benefits</a>
              <a href="#" className="hover:text-brand-600 transition-colors">Guidelines</a>
              <Button size="sm" variant="primary" onClick={() => onLogin('STUDENT')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-20 lg:pt-12 lg:pb-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-900/20 -z-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold mb-8 border border-brand-100 dark:border-brand-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                <span>Applications are now open for 2026</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-6">
                Bridge your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">ambition</span> with opportunity.
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
                Experience the next generation of career placement. Our AI-driven engine matches your unique potential with India's top industry leaders.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button size="lg" variant="primary" onClick={() => onLogin('STUDENT')}>Apply Now</Button>
                <Button size="lg" variant="light" className="group">
                  Learn How it works
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" /></svg>
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 relative flex justify-center">
              <div className="relative animate-float">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-400 to-accent-300 rounded-[2.5rem] blur-3xl opacity-20 -z-10" />
                <div className="bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md">
                  <img
                    src="/hero-image.png"
                    alt="PM Internship Opportunity"
                    className="rounded-[2rem] w-full aspect-[4/5] object-cover"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-50 flex items-center space-x-4">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold dark:text-white">1.25 Cr+</div>
                      <div className="text-xs text-gray-500">Internships Targeted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section className="py-24 bg-white dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">Start your journey today.</h2>
              <p className="text-gray-500 dark:text-gray-400">Simple eligibility requirements to get you matched faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <InfoCard icon={<span className="text-3xl font-display font-bold">21-24</span>} title="Age Group" subtitle="Candidates between 21 and 24 years of age" border />
              <InfoCard icon={<BriefcaseIcon className="h-8 w-8" />} title="Employment" subtitle="Not currently employed in a full-time role" />
              <InfoCard icon={<GraduationCapIcon className="h-8 w-8" />} title="Education" subtitle="Not currently enrolled in full-time education" />
              <InfoCard icon={<FamilyIcon className="h-8 w-8" />} title="Household Income" subtitle="Family income under the specified limit" details="≤ ₹1.0 Lakh PA" />
            </div>
          </div>
        </section>


        {/* Core Benefits Section */}
        <section className="pb-24 lg:pb-32 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-[3rem] p-8 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 border border-slate-100 shadow-2xl shadow-slate-200/50">
              
              <div className="lg:w-1/2 relative z-10 text-center lg:text-left">
                <div className="inline-block px-4 py-1.5 bg-brand-50 rounded-full text-xs font-bold uppercase tracking-widest mb-6 text-brand-600">
                  Why join us?
                </div>
                <h2 className="text-4xl lg:text-5xl font-display font-black mb-6 leading-tight text-slate-900">
                  More than just an <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">internship</span>.
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                   Launch your career with financial independence and real-world skills. We've got your back every step of the way.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  {[
                    { label: 'Monthly Stipend', value: '₹4,500', icon: <WalletIcon className="w-6 h-6" />, details: 'Directly to your bank', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Industry Top-up', value: '+ ₹500', icon: <BuildingLibraryIcon className="w-6 h-6" />, details: 'From your company', color: 'bg-emerald-50 text-emerald-600' },
                    { label: 'Kickstart Grant', value: '₹6,000', icon: <OneTimeGrantIcon className="w-6 h-6" />, details: 'For books & travel', color: 'bg-purple-50 text-purple-600' },
                    { label: 'Experience', value: '1 Year', icon: <BriefcaseIcon className="w-6 h-6" />, details: 'Real projects', color: 'bg-orange-50 text-orange-600' },
                  ].map((benefit, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all group duration-300">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${benefit.color}`}>
                        {benefit.icon}
                      </div>
                      <div className="text-2xl font-bold mb-1 text-slate-900">{benefit.value}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{benefit.label}</div>
                      <div className="mt-2 text-[11px] text-slate-500 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">{benefit.details}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 relative flex justify-center w-full">
                <div className="relative animate-float-slow w-full max-w-lg">
                  {/* Abstract blob background */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-brand-100 to-accent-100 rounded-full blur-3xl -z-10 opacity-60" />
                  
                  <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 lg:p-10 shadow-xl relative">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8">Your Growth Journey</h3>
                    <div className="space-y-8">
                      {[
                        { title: 'Build Your Network', desc: 'Connect with mentors & leaders.', icon: <UserGroupIcon className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
                        { title: 'Fast-track Career', desc: 'Skip the entry-level struggle.', icon: <ChartPieIcon className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600' },
                        { title: 'Master AI Tools', desc: 'Learn skills for the future.', icon: <BeakerIcon className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center space-x-5 group/item">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color} group-hover/item:scale-110 transition-transform`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold text-slate-900 mb-0.5">{item.title}</div>
                            <div className="text-sm text-slate-500">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 bg-brand-600 p-5 rounded-2xl shadow-lg shadow-brand-200 flex items-center space-x-4 transform translate-x-4 translate-y-4">
                        <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                          <CheckCircleIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-base font-bold text-white">Govt. Recognized</div>
                          <div className="text-xs text-brand-100 opacity-90">Certificate of Experience</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-3 grayscale opacity-60">
              <GovIcon className="h-8 w-8" />
              <span className="font-display font-bold text-gray-900 dark:text-white">Ministry of Corporate Affairs</span>
            </div>
            <p className="text-sm text-gray-500">© 2026 PM Internship AI Scheme. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-brand-600">Privacy Policy</a>
              <a href="#" className="hover:text-brand-600">Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;