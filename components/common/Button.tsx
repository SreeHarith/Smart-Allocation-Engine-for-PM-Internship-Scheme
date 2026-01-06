import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'light' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  size = 'md',
  variant = 'primary',
  disabled = false,
  isLoading = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantClasses = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-premium hover:shadow-premium-hover focus:ring-brand-500',
    secondary: 'bg-accent-500 text-white hover:bg-accent-600 shadow-premium hover:shadow-premium-hover focus:ring-accent-500',
    light: 'bg-white text-gray-700 border border-gray-100 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-gray-200',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-premium hover:shadow-premium-hover focus:ring-rose-500',
  };
  
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button className={combinedClasses} disabled={disabled || isLoading} {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
