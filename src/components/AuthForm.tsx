"use client";
import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';

interface AuthFormProps {
  onAuth: (user: { email: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');

    try {
      if (isLogin) {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: { email: string; password: string }) => 
          u.email === email && u.password === password
        );

        if (user) {
          // Save current user session
          localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
          showToast(`Welcome back, ${user.email}`, 'success');
          onAuth({ email: user.email });
        } else {
          setError('Invalid email or password');
          showToast('Invalid email or password', 'error');
        }
      } else {
        // Registration
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if user already exists
        if (users.some((u: { email: string }) => u.email === email)) {
          setError('Email already registered');
          return;
        }

        // Add new user
        const newUser = { email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        localStorage.setItem('currentUser', JSON.stringify({ email }));
        showToast('Account created successfully! Welcome!', 'success');
        onAuth({ email });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md mx-auto mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
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
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          {isLogin ? 'Sign in' : 'Create account'}
        </button>
      </form>
      <div className="mt-6">
        <button
          className="w-full text-sm text-gray-600 hover:text-blue-500 transition-colors text-center"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
