import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import Card from './common/Card';
import CustomSelect from './common/CustomSelect';
import { Internship } from '../types';

interface PostInternshipFormProps {
    onSave: (internshipData: Omit<Internship, 'id' | 'company' | 'sector' | 'deadline' | 'companySize'>) => void;
    onCancel: () => void;
    internshipToEdit: Internship | null;
}

const PostInternshipForm: React.FC<PostInternshipFormProps> = ({ onSave, onCancel, internshipToEdit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        requiredSkills: '',
        seats: '',
        duration: '',
        stipend: '',
    });
    
    useEffect(() => {
        if (internshipToEdit) {
            setFormData({
                title: internshipToEdit.title,
                description: internshipToEdit.description,
                location: internshipToEdit.location,
                requiredSkills: internshipToEdit.requiredSkills.join(', '),
                seats: String(internshipToEdit.seats),
                duration: internshipToEdit.duration,
                stipend: internshipToEdit.stipend || '',
            });
        }
    }, [internshipToEdit]);

    const [errors, setErrors] = useState<Partial<typeof formData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: Partial<typeof formData> = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required.';
        if (!formData.description.trim()) newErrors.description = 'Description is required.';
        if (!formData.location.trim()) newErrors.location = 'Location is required.';
        if (!formData.requiredSkills.trim()) newErrors.requiredSkills = 'At least one skill is required.';
        if (!formData.seats.trim() || isNaN(Number(formData.seats)) || Number(formData.seats) <= 0) {
            newErrors.seats = 'Please enter a valid number of seats.';
        }
        if (!formData.duration.trim()) newErrors.duration = 'Duration is required.';
        if (!formData.stipend.trim()) newErrors.stipend = 'Stipend is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSave({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            requiredSkills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
            seats: Number(formData.seats),
            duration: formData.duration,
            stipend: formData.stipend,
        });
        
        setIsSubmitting(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        {internshipToEdit ? 'Edit Internship' : 'Post a New Internship'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Internship Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" placeholder="e.g. Product Management Intern" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" placeholder="Describe the role responsibilities and requirements..."></textarea>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Location</label>
                  <CustomSelect
                      options={[
                          'Remote', 'Bangalore', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'
                      ]}
                      value={formData.location}
                      onChange={(value) => setFormData(prev => ({ ...prev, location: value as string }))}
                      placeholder="Select Location"
                      error={errors.location}
                  />
                </div>
                 <div>
                  <label htmlFor="duration" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Duration</label>
                  <CustomSelect
                      options={['3 Months', '6 Months']}
                      value={formData.duration}
                      onChange={(value) => setFormData(prev => ({ ...prev, duration: value as string }))}
                      placeholder="Select Duration"
                      error={errors.duration}
                  />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label htmlFor="requiredSkills" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Required Skills</label>
                   <CustomSelect
                      options={[
                          'Python', 'Java', 'React', 'Node.js', 'Data Analysis',
                          'Project Management', 'Marketing', 'Communication',
                          'Design', 'SQL'
                      ].filter(skill => !formData.requiredSkills.includes(skill))}
                      value=""
                      onChange={(value) => {
                          const val = value as string;
                          if (val && !formData.requiredSkills.includes(val)) {
                              const newSkills = formData.requiredSkills ? `${formData.requiredSkills}, ${val}` : val;
                              const cleanSkills = newSkills.replace(/^, /, '');
                              setFormData(prev => ({ ...prev, requiredSkills: cleanSkills }));
                          }
                      }}
                      placeholder="Add a Skill..."
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                      {formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean).map(skill => (
                          <span key={skill} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-100 dark:border-brand-800">
                              {skill}
                              <button
                                  type="button"
                                  onClick={() => {
                                      const currentSkills = formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
                                      const newSkills = currentSkills.filter(s => s !== skill).join(', ');
                                      setFormData(prev => ({ ...prev, requiredSkills: newSkills }));
                                  }}
                                  className="ml-1.5 text-brand-400 hover:text-brand-600 dark:text-brand-500 dark:hover:text-brand-300 focus:outline-none"
                              >
                                  &times;
                              </button>
                          </span>
                      ))}
                  </div>
                  {errors.requiredSkills && <p className="text-red-500 text-xs mt-1">{errors.requiredSkills}</p>}
                </div>
                <div>
                  <label htmlFor="seats" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Number of Seats</label>
                  <CustomSelect
                      options={[...Array(20)].map((_, i) => ({ label: String(i + 1), value: i + 1 }))}
                      value={formData.seats ? Number(formData.seats) : ''}
                      onChange={(value) => setFormData(prev => ({ ...prev, seats: String(value) }))}
                      placeholder="Select Seats"
                      error={errors.seats}
                  />
                </div>
                <div>
                  <label htmlFor="stipend" className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Stipend (e.g., ₹20,000 / month)</label>
                  <input type="text" id="stipend" name="stipend" value={formData.stipend} onChange={handleChange} className="block w-full rounded-xl border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 text-sm" placeholder="₹20,000 / month" />
                  {errors.stipend && <p className="text-red-500 text-xs mt-1">{errors.stipend}</p>}
                </div>
            </div>
            
            <div className="pt-6 flex justify-end gap-3 border-t border-gray-50 dark:border-gray-700/50">
                <Button type="button" onClick={onCancel} variant="light" className="!rounded-2xl px-8">
                    Cancel
                </Button>
                <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="!rounded-2xl px-8 shadow-brand-200">
                    {internshipToEdit ? 'Save Changes' : 'Post Internship'}
                </Button>
            </div>
        </div>
      </form>
    </Card>
  );
};

export default PostInternshipForm;
