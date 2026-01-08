import React, { useState } from 'react';
import Button from './common/Button';
import Card from './common/Card';
import CustomSelect from './common/CustomSelect';
import { api } from '../services/api';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { XMarkIcon, ChevronLeftIcon } from './common/Icons';

const SKILL_OPTIONS = [
  'React', 'Node.js', 'Python', 'SQL', 'Data Analysis', 'Machine Learning', 
  'Product Management', 'Market Research', 'Agile Methodologies', 'Figma', 
  'TypeScript', 'AWS', 'Docker', 'Kubernetes', 'Java', 'C++', 'Go', 'Rust'
];

const LOCATION_OPTIONS = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Remote'
];

const INDUSTRY_OPTIONS = [
  'Artificial Intelligence', 'Web Development', 'Data Science', 'FinTech', 
  'EdTech', 'HealthTech', 'E-commerce', 'SaaS', 'Cybersecurity', 'Cloud Computing'
];

const COMPANY_SIZES = ['Startup', 'Mid-size', 'MNC'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCompany = searchParams.get('type') === 'company';
  const isAdmin = searchParams.get('type') === 'admin';

  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    // Shared
    name: '',
    password: '',
    confirmPassword: '',
    // Student Specific
    phoneNumber: '',
    careerGoals: '',
    skills: [] as string[],
    industryFocus: [] as string[],
    locationPreference: '',
    preferredCompanySize: '',
    preferredDuration: '',
    // Company/Admin Specific
    email: '',
    description: '',
    website: '',
    location: '',
    size: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to update fields
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateField(e.target.name, e.target.value);
  };

  const validatePhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleNext = () => {
    setError('');
    // STEP 1 VALIDATION
    if (step === 1) {
        if (!formData.name.trim()) return setError('Please enter full name');
        
        if (isCompany || isAdmin) {
            if (!validateEmail(formData.email)) return setError('Please enter a valid email address');
        } else {
            if (!validatePhone(formData.phoneNumber)) return setError('Please enter a valid 10-digit phone number');
        }

        if (formData.password.length < 6) return setError('Password must be at least 6 characters');
        if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
        
        // If Admin, direct submit (no step 2/3)
        if (isAdmin) {
            handleSubmit(new Event('submit') as any);
            return;
        }

        setStep(2);
    } 
    // STEP 2 VALIDATION
    else if (step === 2) {
        if (isCompany) {
             if (!formData.description.trim()) return setError('Please provide a brief company description');
             if (!formData.website.trim()) return setError('Please enter company website');
             setStep(3);
        } else {
            if (!formData.careerGoals.trim()) return setError('Please tell us a bit about your career goals');
            if (formData.skills.length === 0) return setError('Please add at least one skill');
            setStep(3);
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    
    // STEP 3 VALIDATION (Only for non-admin)
    if (!isAdmin) {
        if (isCompany) {
            if (!formData.location) return setError('Please select company location');
            if (!formData.size) return setError('Please select company size');
        } else {
            if (!formData.locationPreference) return setError('Please select a preferred location');
            if (!formData.preferredCompanySize) return setError('Please select a preferred company size');
            if (!formData.preferredDuration) return setError('Please select a preferred duration');
        }
    }

    setLoading(true);
    try {
      const { confirmPassword, ...data } = formData;
      
      if (isAdmin) {
          await api.registerAdmin({
              name: data.name,
              email: data.email,
              password: data.password
          });
      } else if (isCompany) {
          await api.registerCompany({
              name: data.name,
              email: data.email,
              password: data.password,
              description: data.description,
              website: data.website,
              location: data.location,
              size: data.size
          });
      } else {
          await api.register({
            name: data.name,
            phoneNumber: data.phoneNumber,
            password: data.password,
            careerGoals: data.careerGoals,
            skills: data.skills,
            industryFocus: data.industryFocus,
            locationPreference: data.locationPreference,
            preferredCompanySize: data.preferredCompanySize,
            preferredDuration: data.preferredDuration
          });
      }
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const removeArrayItem = (item: string, field: 'skills' | 'industryFocus') => {
      setFormData(prev => ({
          ...prev,
          [field]: prev[field].filter(i => i !== item)
      }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-blend-overlay bg-white/90 dark:bg-black/80 py-10">
      <Card className="max-w-2xl w-full backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 overflow-visible">
        
        {/* Progress Header */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                {isAdmin ? 'Create Admin Account' : isCompany ? 'Create Company Account' : 'Create Student Account'}
            </h2>
            {!isAdmin && (
                <>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    Step {step} of 3: {
                        step === 1 ? 'Basic Details' : 
                        step === 2 ? (isCompany ? 'Company Profile' : 'Professional Identity') : 
                        (isCompany ? 'Logistics' : 'Preferences')
                    }
                </p>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 overflow-hidden">
                    <div 
                        className="h-full bg-brand-500 transition-all duration-500 ease-out" 
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
                </>
            )}
            {isAdmin && (
                 <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    Enter your details to create an administrator account
                 </p>
            )}
        </div>
        
        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 animate-shake">
                {error}
            </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
           
           {/* STEP 1: Basic Account Info */}
           {step === 1 && (
               <div className="space-y-5 animate-slide-in-right">
                   <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">
                        {isCompany ? 'Company Name' : 'Full Name'}
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={isCompany ? "Acme Corp" : "John Doe"}
                        className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                    />
                  </div>
                  
                  {isCompany || isAdmin ? (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={isAdmin ? "admin@platform.com" : "careers@company.com"}
                            className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                        />
                      </div>
                  ) : (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Phone Number</label>
                        <input 
                            type="text" 
                            name="phoneNumber" 
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="9876543210"
                            className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                        />
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                        />
                      </div>
                  </div>
               </div>
           )}

           {/* STEP 2: Professional Details / Company Profile */}
           {step === 2 && !isAdmin && (
               <div className="space-y-6 animate-slide-in-right">
                   {isCompany ? (
                       <>
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Company Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Briefly describe what your company does..."
                                    className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm"
                                />
                           </div>
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Website URL</label>
                                <input 
                                    type="text" 
                                    name="website" 
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://company.com"
                                    className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm" 
                                />
                           </div>
                       </>
                   ) : (
                       // ... Student Step 2 (Unchanged logic, just re-rendered) ...
                       <>
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Professional Bio / Career Goals</label>
                                <textarea
                                    name="careerGoals"
                                    value={formData.careerGoals}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="I aspire to become a Product Manager..."
                                    className="block w-full rounded-xl border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 py-3 px-4 text-sm"
                                />
                           </div>
                           
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Skills</label>
                                <CustomSelect
                                    options={SKILL_OPTIONS.filter(s => !formData.skills.includes(s))}
                                    value=""
                                    onChange={(val) => {
                                        if (val && !formData.skills.includes(val as string)) {
                                            updateField('skills', [...formData.skills, val]);
                                        }
                                    }}
                                    placeholder="Select skills..."
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                                            {skill}
                                            <button type="button" onClick={() => removeArrayItem(skill, 'skills')} className="ml-1.5 hover:text-red-500"><XMarkIcon className="h-3 w-3" /></button>
                                        </span>
                                    ))}
                                </div>
                           </div>

                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Industry Focus</label>
                                <CustomSelect
                                    options={INDUSTRY_OPTIONS.filter(s => !formData.industryFocus.includes(s))}
                                    value=""
                                    onChange={(val) => {
                                        if (val && !formData.industryFocus.includes(val as string)) {
                                            updateField('industryFocus', [...formData.industryFocus, val]);
                                        }
                                    }}
                                    placeholder="Select industries..."
                                />
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.industryFocus.map(item => (
                                        <span key={item} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300 border border-accent-100 dark:border-accent-800">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem(item, 'industryFocus')} className="ml-1.5 hover:text-red-500"><XMarkIcon className="h-3 w-3" /></button>
                                        </span>
                                    ))}
                                </div>
                           </div>
                       </>
                   )}
               </div>
           )}

           {/* STEP 3: Preferences / Logistics */}
           {step === 3 && !isAdmin && (
               <div className="space-y-6 animate-slide-in-right">
                   {isCompany ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Headquarters Location</label>
                                    <CustomSelect
                                        options={LOCATION_OPTIONS}
                                        value={formData.location}
                                        onChange={(val) => updateField('location', val)}
                                        placeholder="Select Location"
                                    />
                            </div>
                            <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Company Size</label>
                                    <CustomSelect
                                        options={COMPANY_SIZES}
                                        value={formData.size}
                                        onChange={(val) => updateField('size', val)}
                                        placeholder="Select Size"
                                    />
                            </div>
                        </div>
                   ) : (
                       <>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Preferred Location</label>
                                    <CustomSelect
                                        options={LOCATION_OPTIONS}
                                        value={formData.locationPreference}
                                        onChange={(val) => updateField('locationPreference', val)}
                                        placeholder="Select Location"
                                    />
                               </div>
                               <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Internship Duration</label>
                                    <CustomSelect
                                        options={['Any', '3 Months', '6 Months']}
                                        value={formData.preferredDuration}
                                        onChange={(val) => updateField('preferredDuration', val)}
                                        placeholder="Select Duration"
                                    />
                               </div>
                           </div>
                           
                           <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Target Company Size</label>
                                <CustomSelect
                                    options={COMPANY_SIZES}
                                    value={formData.preferredCompanySize}
                                    onChange={(val) => updateField('preferredCompanySize', val)}
                                    placeholder="Select Size"
                                />
                           </div>
                       </>
                   )}
               </div>
           )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
              {step > 1 && !isAdmin ? (
                  <Button type="button" variant="light" onClick={() => setStep(prev => prev - 1)} className="!rounded-xl px-6">
                      <ChevronLeftIcon className="h-4 w-4 mr-2" />
                      Back
                  </Button>
              ) : (
                  <div className="text-sm text-gray-500 pt-2">
                    Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">Sign In</Link>
                  </div>
              )}

              {step < 3 && !isAdmin ? (
                  <Button type="button" onClick={handleNext} className="!rounded-xl px-8 shadow-lg shadow-brand-500/20">
                      Next Step
                  </Button>
              ) : (
                  <Button type="button" onClick={isAdmin ? handleNext : handleSubmit} disabled={loading} className="!rounded-xl px-8 shadow-lg shadow-brand-500/30">
                      {loading ? 'Creating Profile...' : 'Complete Registration'}
                  </Button>
              )}
          </div>
        </form>
      </Card>
    </div>
  );
};
export default Register;
