import React, { useState } from 'react';
import Button from './common/Button';
import Card from './common/Card';
import { api } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { COMPANY_DATA, ADMIN_DATA } from '../constants';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'STUDENT' | 'COMPANY' | 'ADMIN'>('STUDENT');
  const [formData, setFormData] = useState({
    phoneNumber: '', 
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validatePhone = (phone: string) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- STUDENT LOGIN (Real Backend) ---
    if (activeTab === 'STUDENT') {
        if (!validatePhone(formData.phoneNumber)) {
            setError('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9');
            return;
        }
        if (!formData.password) {
            setError('Please enter your password');
            return;
        }

        setLoading(true);
        try {
            const user = await api.login({ phoneNumber: formData.phoneNumber, password: formData.password });
            localStorage.setItem('pm_internship_user', JSON.stringify(user)); 
            onLogin(user); // Update global state
            
            navigate('/student/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.detail || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    } 
    // --- COMPANY/ADMIN LOGIN ---
    else {
         if (!formData.email || !formData.password) {
             setError('Please enter email and password');
             return;
         }

         if (activeTab === 'COMPANY') {
            setLoading(true);
            try {
                const user = await api.loginCompany({ email: formData.email, password: formData.password });
                localStorage.setItem('pm_internship_user', JSON.stringify(user));
                onLogin(user);
                navigate('/company/dashboard');
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Login failed');
            } finally {
                setLoading(false);
            }
         } else {
             // Admin Login
             setLoading(true);
             try {
                 const user = await api.loginAdmin({ email: formData.email, password: formData.password });
                 localStorage.setItem('pm_internship_user', JSON.stringify(user));
                 onLogin(user);
                 navigate('/admin/dashboard');
             } catch (err: any) {
                 setError(err.response?.data?.detail || 'Login failed');
             } finally {
                 setLoading(false);
             }
         }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-[url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/90 dark:bg-black/80">
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 overflow-visible">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Bridge your ambition with opportunity</p>
        </div>

        {/* Role Tabs */}
        <div className="flex p-1 mb-6 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            {(['STUDENT', 'COMPANY', 'ADMIN'] as const).map((role) => (
                <button
                    key={role}
                    onClick={() => { setActiveTab(role); setError(''); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === role 
                        ? 'bg-white dark:bg-gray-800 text-brand-600 shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                </button>
            ))}
        </div>
        
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'STUDENT' ? (
              // Student Phone Input
              <div>
                <label htmlFor="phoneNumber" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Phone Number</label>
                <input 
                    type="text" 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm transition-all" 
                />
              </div>
          ) : (
              // Company/Admin Email Input
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm transition-all" 
                />
              </div>
          )}

          <div>
            <label htmlFor="password"className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Password</label>
            <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm transition-all" 
            />
            <div className="flex justify-end mt-2">
                <a href="#" className="text-xs text-brand-600 hover:text-brand-500 font-medium">Forgot Password?</a>
            </div>
          </div>
          
          <Button type="submit" className="w-full py-3.5 text-base font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all transform hover:-translate-y-0.5">
            {loading ? 'Signing In...' : `Sign In as ${activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}`}
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to={activeTab === 'STUDENT' ? '/register?type=student' : activeTab === 'ADMIN' ? '/register?type=admin' : '/register?type=company'} className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
                    Create {activeTab === 'STUDENT' ? 'Student' : activeTab === 'ADMIN' ? 'Admin' : 'Company'} Account
                </Link>
            </p>
        </div>
      </Card>
    </div>
  );
};
export default Login;
