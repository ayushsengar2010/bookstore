"use client";
import React from 'react';
import BookCard from '../../components/BookCard';
import { Book } from '../../types/book';
import UploadBook from '../../components/UploadBook';
import Image from 'next/image';
import { libraryBackground, paperBackground } from '../../constants/backgrounds';

const LibraryPage = () => {
  const [books, setBooks] = React.useState<Book[]>([]);
  
  // Load books from localStorage when component mounts (client-side only)
  React.useEffect(() => {
    const savedBooks = localStorage.getItem('books');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Filter books based on search query and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Header */}
      <header className="relative z-10 bg-white bg-opacity-95 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Book
            </button>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadBook
          onUpload={async (bookData) => {
            // Import fileToDataUrl only when needed to avoid SSR issues
            const { fileToDataUrl } = await import('../../utils/fileUtils');
            
            // Convert files to data URLs that can persist in localStorage
            const coverUrl = bookData.coverImage ? await fileToDataUrl(bookData.coverImage) : '';
            const fileUrl = bookData.file ? await fileToDataUrl(bookData.file) : '';
            
            const newBook: Book = {
              id: Date.now().toString(),
              title: bookData.title,
              author: bookData.author,
              coverUrl: coverUrl,
              fileUrl: fileUrl,
              fileName: bookData.file ? bookData.file.name : '',
              category: 'other'
            };
            const updatedBooks = [...books, newBook];
            setBooks(updatedBooks);
            localStorage.setItem('books', JSON.stringify(updatedBooks));
            setIsUploadModalOpen(false);
          }}
          onCancel={() => setIsUploadModalOpen(false)}
        />
      )}

      {/* Search and Filter Bar */}
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-95 p-4 rounded-lg shadow-lg">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white bg-opacity-95 rounded-lg shadow-lg p-6">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <BookCard 
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  coverUrl={book.coverUrl}
                  onSelect={() => {
                    // Handle book selection - use the persistent data URL
                    if (book.fileUrl) {
                      // For data URLs, we can open them directly
                      window.open(book.fileUrl, '_blank');
                    }
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
                  : "Get started by adding some books to your library"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;
