import React, { useState } from 'react';
import Button from '../common/Button';
import { GovIcon, EyeIcon, EyeSlashIcon } from '../common/Icons';

interface SignupPageProps {
    onSignup: (role: 'STUDENT' | 'COMPANY' | 'ADMIN') => void;
    onSwitchToLogin: () => void;
    onBackToHome: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin, onBackToHome }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        onSignup(role);
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
                    Create <span className="text-brand-600">Account</span>
                </h2>
                <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Start your professional journey today
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="bg-white dark:bg-gray-800 py-10 px-8 shadow-premium rounded-[2.5rem] border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-400" />

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Register As</label>
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
                            <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="block w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder-gray-400 text-sm"
                                placeholder="Full Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
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

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2">
                                Create Password
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

                        <div className="text-xs text-gray-500 font-medium leading-relaxed">
                            By creating an account, you agree to our <a href="#" className="text-brand-600 hover:underline">Terms of Service</a> and <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>.
                        </div>

                        <Button type="submit" className="w-full !py-4 !rounded-2xl shadow-brand-100" isLoading={isLoading}>
                            Register and Continue
                        </Button>
                    </form>

                    <div className="mt-10">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-gray-700"></div></div>
                            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest"><span className="px-4 bg-white dark:bg-gray-800 text-gray-400">Already a member?</span></div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={onSwitchToLogin}
                                className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center group"
                            >
                                <svg className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                Sign in instead
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

export default SignupPage;
