import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  fullWidth = false,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-[#70A25B] hover:bg-[#598248] focus:ring-[#70A25B] shadow-lg hover:shadow-[#70A25B]/30",
    secondary: "border-transparent text-[#70A25B] bg-[#70A25B]/10 hover:bg-[#70A25B]/20 focus:ring-[#70A25B]",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-[#70A25B]",
    ghost: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};