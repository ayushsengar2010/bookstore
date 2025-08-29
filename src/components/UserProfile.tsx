"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '../context/ToastContext';
import StorageManager from './StorageManager';
import BackButton from './BackButton';

interface ReadingStats {
  booksStarted: number;
  booksFinished: number;
  totalReadingTime: number;
  favoriteCategories: Record<string, number>;
}

const UserProfile = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('Guest Reader');
  const [avatar, setAvatar] = useState('/images/placeholder-cover.svg');
  const [stats, setStats] = useState<ReadingStats>({
    booksStarted: 0,
    booksFinished: 0,
    totalReadingTime: 0,
    favoriteCategories: {}
  });
  
  useEffect(() => {
    // Load profile from localStorage if available
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setName(profile.name || 'Guest Reader');
        setAvatar(profile.avatar || '/images/placeholder-cover.svg');
      }
      
      // Calculate stats from books and reading positions
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const positions = JSON.parse(localStorage.getItem('readingPositions') || '{}');
      
      // Simple stat calculations
      const categories: Record<string, number> = {};
      books.forEach((book: any) => {
        const category = book.category || 'other';
        categories[category] = (categories[category] || 0) + 1;
      });
      
      setStats({
        booksStarted: Object.keys(positions).length,
        booksFinished: Math.floor(Object.keys(positions).length / 2), // Simple approximation
        totalReadingTime: Math.floor(Math.random() * 120), // Placeholder (would track actual reading time in a real app)
        favoriteCategories: categories
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, []);
  
  const saveProfile = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify({ name, avatar }));
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Error saving profile', 'error');
    }
  };
  
  const getTopCategories = () => {
    const categories = Object.entries(stats.favoriteCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
      
    return categories.map(([category, count]) => (
      <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
        {category}: {count}
      </span>
    ));
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-end mb-2">
        <BackButton label="Back to Library" fallbackRoute="/user" />
      </div>
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <Image
            src={avatar}
            alt={name}
            fill
            className="rounded-full border-4 border-blue-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-center text-xl font-semibold mb-1 border-b border-transparent focus:border-blue-300 focus:outline-none"
          aria-label="Your name"
        />
        <p className="text-sm text-gray-500">Reader since {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.booksStarted}</p>
          <p className="text-xs text-gray-500">Books Started</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.booksFinished}</p>
          <p className="text-xs text-gray-500">Books Finished</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{stats.totalReadingTime}</p>
          <p className="text-xs text-gray-500">Hours Read</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">
            {Object.keys(stats.favoriteCategories).length}
          </p>
          <p className="text-xs text-gray-500">Categories</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Top Categories</h3>
        <div className="flex flex-wrap">
          {getTopCategories()}
        </div>
      </div>
      
      <button
        onClick={saveProfile}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
      >
        Save Profile
      </button>
      
      {/* Storage Manager */}
      <div className="mt-6">
        <StorageManager userId={name !== 'Guest Reader' ? name : undefined} />
      </div>
    </div>
  );
};

export default UserProfile;
