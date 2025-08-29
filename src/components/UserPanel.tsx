"use client";
import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import BookCard from './BookCard';
import BookViewer from './BookViewer';
import UserProfile from './UserProfile';
import DownloadedBooks from './DownloadedBooks';
import { libraryBackground } from '../constants/backgrounds';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '../context/ToastContext';
import { storageService } from '../utils/storageService';

const UserPanel = () => {
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Load books from storage service
  useEffect(() => {
    async function loadBooks() {
      try {
        if (storageService.isSupported()) {
          // Get books from IndexedDB
          const bookList = await storageService.getAllBooks();
          setBooks(bookList);
        } else {
          // Fall back to localStorage
          const savedBooks = localStorage.getItem('books');
          const parsedBooks = savedBooks ? JSON.parse(savedBooks) : [];
          setBooks(parsedBooks);
        }
      } catch (error) {
        console.error('Error loading books:', error);
        showToast('Error loading books', 'error');
        
        // Fall back to localStorage on error
        const savedBooks = localStorage.getItem('books');
        const parsedBooks = savedBooks ? JSON.parse(savedBooks) : [];
        setBooks(parsedBooks);
      }
    }
    
    loadBooks();
  }, [showToast]);

  // Filter books based on search query and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedBook) {
    return (
      <BookViewer 
        bookId={selectedBook.id} 
        onBack={() => setSelectedBook(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={libraryBackground}
          alt="Library background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/10" />
      </div>

      {/* User Header */}
      <header className="relative z-10 bg-white bg-opacity-95 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Library</h1>
              <p className="text-sm text-gray-600">
                Browse and read your favorite books
              </p>
            </div>
            <Link href="/admin-login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserProfile />
            
            {/* Downloaded Books Section */}
            <div className="bg-white shadow rounded-lg p-4">
              <DownloadedBooks 
                books={books}
                onSelectBook={(book) => {
                  setSelectedBook(book);
                  showToast(`Opening "${book.title}"`, 'info');
                }}
              />
            </div>
          </div>
          
          {/* Search and Books */}
          <div className="lg:col-span-3">
            {/* Search Section */}
            <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-lg mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                      placeholder="Search by title or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900"
                  >
                    <option value="all">All Categories</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="technical">Technical</option>
                    <option value="business">Business</option>
                    <option value="science">Science</option>
                    <option value="history">History</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Book Grid */}
            <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-6">
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard 
                      key={book.id}
                      title={book.title}
                      author={book.author}
                      coverUrl={book.coverUrl}
                      progress={book.progress}
                      lastRead={book.lastRead}
                      onSelect={() => {
                        setSelectedBook(book);
                        showToast(`Opening "${book.title}"`, 'info');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "There are no books in the library yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
