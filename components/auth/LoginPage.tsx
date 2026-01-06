import React, { useState } from 'react';
import Button from '../common/Button';
import { GovIcon, EyeIcon, EyeSlashIcon } from '../common/Icons';
import { DEMO_CREDENTIALS } from '../../constants';

interface LoginPageProps {
    onLogin: (role: 'STUDENT' | 'COMPANY' | 'ADMIN') => void;
    onSwitchToSignup: () => void;
    onBackToHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup, onBackToHome }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDemoLogin = (demoRole: 'STUDENT' | 'COMPANY' | 'ADMIN') => {
        const creds = DEMO_CREDENTIALS[demoRole];
        setEmail(creds.email);
        setPassword(creds.password);
        setRole(demoRole);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        onLogin(role);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in-up">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div onClick={onBackToHome} className="flex justify-center cursor-pointer group">
                    <div className="bg-brand-600 p-3 rounded-2xl shadow-xl shadow-brand-100 group-hover:scale-110 transition-transform">
                        <GovIcon className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-display font-black text-gray-900 dark:text-white">
                    Welcome <span className="text-brand-600">Back</span>
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Bridge your ambition with opportunity
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white dark:bg-gray-800 py-10 px-8 shadow-premium rounded-[2.5rem] border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-400" />

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Login As</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['STUDENT', 'COMPANY', 'ADMIN'] as const).map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${role === r
                                            ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-900/20 dark:border-brand-800 dark:text-brand-400'
                                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                                            }`}
                                    >
                                        {r.charAt(0) + r.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700" />
                                <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-xs font-bold">
                                <a href="#" className="text-brand-600 hover:text-brand-500 uppercase tracking-widest">Forgot password?</a>
                            </div>
                        </div>

                        <Button type="submit" className="w-full !py-4 !rounded-2xl shadow-brand-100" isLoading={isLoading}>
                            Sign In to Portal
                        </Button>
                    </form>

                    <div className="mt-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700"></div></div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="px-4 bg-white dark:bg-gray-800 text-gray-400">Quick Demo Access</span></div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            <button
                                onClick={() => handleDemoLogin('STUDENT')}
                                className="py-2.5 px-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-[10px] font-bold rounded-xl transition-all border border-brand-100 dark:border-brand-800 flex flex-col items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                                Student
                            </button>
                            <button
                                onClick={() => handleDemoLogin('COMPANY')}
                                className="py-2.5 px-2 bg-accent-50 hover:bg-accent-100 dark:bg-accent-900/20 dark:hover:bg-accent-900/30 text-accent-700 dark:text-accent-400 text-[10px] font-bold rounded-xl transition-all border border-accent-100 dark:border-accent-800 flex flex-col items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                Organization
                            </button>
                            <button
                                onClick={() => handleDemoLogin('ADMIN')}
                                className="py-2.5 px-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-xl transition-all border border-gray-100 dark:border-gray-600 flex flex-col items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Admin
                            </button>
                        </div>
                    </div>

                    <div className="mt-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700"></div></div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="px-4 bg-white dark:bg-gray-800 text-gray-400">New around here?</span></div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={onSwitchToSignup}
                                className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center group"
                            >
                                Create an account
                                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
                    Official Portal • Govt of India Initiative
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
