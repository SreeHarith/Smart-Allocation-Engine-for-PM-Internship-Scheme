import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import Card from './common/Card';
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
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Internship Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500"></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
             <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (e.g., 3 Months)</label>
              <input type="text" id="duration" name="duration" value={formData.duration} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Required Skills (comma-separated)</label>
              <input type="text" id="requiredSkills" name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              {errors.requiredSkills && <p className="text-red-500 text-xs mt-1">{errors.requiredSkills}</p>}
            </div>
            <div>
              <label htmlFor="seats" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Number of Seats</label>
              <input type="number" id="seats" name="seats" value={formData.seats} onChange={handleChange} min="1" className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              {errors.seats && <p className="text-red-500 text-xs mt-1">{errors.seats}</p>}
            </div>
            <div>
              <label htmlFor="stipend" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stipend (e.g., ₹20,000 / month)</label>
              <input type="text" id="stipend" name="stipend" value={formData.stipend} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500" />
              {errors.stipend && <p className="text-red-500 text-xs mt-1">{errors.stipend}</p>}
            </div>
        </div>
        <div className="pt-5 flex justify-end gap-3">
            <Button type="button" onClick={onCancel} variant="light">
                Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                {internshipToEdit ? 'Save Changes' : 'Post Internship'}
            </Button>
        </div>
      </form>
    </Card>
  );
};

export default PostInternshipForm;
