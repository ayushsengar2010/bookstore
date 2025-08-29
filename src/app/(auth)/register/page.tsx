"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../components/AuthForm';

const RegisterPage = () => {
  const router = useRouter();
  
  const handleAuth = (user: { email: string }) => {
    // Redirect based on user role
    if (user.email.includes('admin')) {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Digital Library</h1>
        <AuthForm onAuth={handleAuth} />
      </div>
    </div>
  );
};

export default RegisterPage;
