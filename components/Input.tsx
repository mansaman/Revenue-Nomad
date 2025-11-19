import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        className={`
          appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
          bg-white text-gray-900
          focus:outline-none focus:ring-[#70A25B] focus:border-[#70A25B] sm:text-sm transition-colors
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        className={`
          block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-[#70A25B] focus:border-[#70A25B] sm:text-sm
          bg-white text-gray-900
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      >
        <option value="" className="text-gray-500">Select an option</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-gray-900">{opt}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};