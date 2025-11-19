import React, { useState } from 'react';
import { ViewState, REVENUE_RANGES, LeadFormData } from '../types';
import { Input, Select } from '../components/Input';
import { Button } from '../components/Button';
import { submitLead } from '../services/leadService';
import { saveToken } from '../services/authService';
import { Lock, ArrowLeft } from 'lucide-react';

interface DemoFormProps {
  onChangeView: (view: ViewState) => void;
}

export const DemoForm: React.FC<DemoFormProps> = ({ onChangeView }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    companyName: '',
    revenueRange: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await submitLead(formData);
      if (response.success && response.token) {
        saveToken(response.token);
        onChangeView(ViewState.PROTECTED);
      }
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit. Please check your email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <button 
            onClick={() => onChangeView(ViewState.LANDING)}
            className="self-start mb-6 text-gray-500 hover:text-gray-900 flex items-center"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-[#70A25B]/10 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-[#70A25B]" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Unlock the Report
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Complete the secure form below to access the 2024 Industry Analysis.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            
            <Input
              label="Work Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@company.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                label="Company"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                />
                
                <Input
                label="Phone (Optional)"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                />
            </div>

            <Select
              label="Annual Revenue"
              name="revenueRange"
              required
              options={REVENUE_RANGES}
              value={formData.revenueRange}
              onChange={handleChange}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message / Inquiry
              </label>
              <textarea
                name="message"
                rows={3}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 bg-white text-gray-900 focus:outline-none focus:ring-[#70A25B] focus:border-[#70A25B] sm:text-sm"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your needs..."
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              {isLoading ? 'Verifying & Submitting...' : 'Get Instant Access'}
            </Button>
            <p className="mt-4 text-xs text-center text-gray-400">
              By clicking above, you agree to our Terms. Your data is encrypted and sent securely.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};