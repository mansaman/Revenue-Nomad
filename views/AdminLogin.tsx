import React, { useState } from 'react';
import { ViewState } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { loginAdmin } from '../services/authService';
import { Shield } from 'lucide-react';

interface AdminLoginProps {
  onChangeView: (view: ViewState) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onChangeView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (loginAdmin(username, password)) {
      onChangeView(ViewState.ADMIN_DASHBOARD);
    } else {
      setError('Invalid credentials');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#70A25B] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Portal</h2>
        <p className="text-center text-gray-500 mb-8">Restricted access for system administrators</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            error={error}
          />
          
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
          >
            Access Dashboard
          </Button>

          <button
            type="button"
            onClick={() => onChangeView(ViewState.LANDING)}
            className="w-full text-sm text-gray-500 hover:text-gray-900 mt-4"
          >
            Return to Website
          </button>
        </form>
      </div>
    </div>
  );
};