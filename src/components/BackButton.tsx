"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  fallbackRoute?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  fallbackRoute = '/',
  label = 'Back',
  className = '',
  onClick,
}) => {
  const router = useRouter();
  
  const handleBack = () => {
    // If custom onClick is provided, use that
    if (onClick) {
      onClick();
      return;
    }
    
    // Otherwise use standard back navigation
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to fallback route
      router.push(fallbackRoute);
    }
  };
  
  return (
    <button
      onClick={handleBack}
      className={`flex items-center text-blue-600 hover:text-blue-800 transition-colors ${className}`}
      aria-label="Go back"
    >
      <svg 
        className="w-5 h-5 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
      {label}
    </button>
  );
};

export default BackButton;
