"use client";
import React, { useEffect, useState } from 'react';
import { Book } from '../types/book';
import Link from 'next/link';
import Image from 'next/image';

const RecentBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Load books from localStorage
      const savedBooks = localStorage.getItem('books');
      const parsedBooks = savedBooks ? JSON.parse(savedBooks) : [];
      
      // Take the 4 most recent books
      const recentBooks = parsedBooks.slice(-4).reverse();
      setBooks(recentBooks);
    } catch (error) {
      console.error('Error loading recent books:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-600">Loading books...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No books available yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Visit the admin panel to add some books to the library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {books.map((book) => (
        <Link key={book.id} href={`/user?book=${book.id}`} className="group">
          <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-40 md:h-56">
              <Image
                src={book.coverUrl || '/images/placeholder-cover.svg'}
                alt={book.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{book.author}</p>
              
              {/* Progress bar */}
              {book.progress !== undefined && (
                <div className="flex items-center mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div 
                      className="bg-blue-600 h-1 rounded-full"
                      style={{ width: `${book.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {book.progress > 0 ? `${book.progress}%` : 'New'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentBooks;
