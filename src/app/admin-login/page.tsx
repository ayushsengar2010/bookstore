"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';
import Image from 'next/image';
import Link from 'next/link';
import { libraryBackground } from '../../constants/backgrounds';
import BackButton from '../../components/BackButton';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      showToast('Please enter both email and password', 'error');
      return;
    }
    
    // Check if this is an admin account (contains 'admin')
    if (!email.includes('admin')) {
      setError('Not an admin account');
      showToast('Not an admin account', 'error');
      return;
    }
    
    try {
      // Check if admin exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: { email: string; password: string }) => 
        u.email === email && u.password === password
      );
      
      if (user) {
        // Save current user session
        localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
        showToast(`Welcome back, ${user.email}`, 'success');
        router.push('/admin');
      } else {
        // Create admin if not exists (for demo purposes)
        if (email.includes('admin') && password === 'admin') {
          const newUser = { email, password };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));
          localStorage.setItem('currentUser', JSON.stringify({ email }));
          showToast('Admin account created and logged in!', 'success');
          router.push('/admin');
        } else {
          setError('Invalid admin credentials');
          showToast('Invalid admin credentials', 'error');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      showToast('Authentication error', 'error');
      console.error('Auth error:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src={libraryBackground}
          alt="Library background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-blue-900/40" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <div className="mt-2 text-center text-sm text-blue-200 flex flex-col items-center">
            <Link href="/" className="font-medium text-blue-300 hover:text-white">
              Return to homepage
            </Link>
          </div>
          <div className="mt-2 flex justify-center">
            <BackButton
              label="Back"
              className="text-blue-300 hover:text-white"
            />
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 mb-4">
                  <strong>Hint:</strong> Use any email containing "admin" and password "admin" for demo access.
                </p>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
