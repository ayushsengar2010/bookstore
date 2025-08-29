"use client";
import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import BookCard from './BookCard';
import UploadBook from './UploadBook';
import EditBook from './EditBook';
import BackButton from './BackButton';
import { getCurrentUser } from '../utils/auth';
import { libraryBackground } from '../constants/backgrounds';
import Image from 'next/image';
import { useToast } from '../context/ToastContext';
import { storageService } from '../utils/storageService';

const AdminPanel = () => {
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [stats, setStats] = useState({
    totalBooks: 0,
    categories: {} as Record<string, number>
  });

  // Load books from storage service
  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Try to load books from IndexedDB
        let bookList: Book[] = [];
        
        if (storageService.isSupported()) {
          // Try to migrate existing books first
          await storageService.migrateFromLocalStorage();
          
          // Then get all books
          bookList = await storageService.getAllBooks();
        } else {
          // Fall back to localStorage if IndexedDB is not supported
          const savedBooks = localStorage.getItem('books');
          bookList = savedBooks ? JSON.parse(savedBooks) : [];
        }
        
        setBooks(bookList);
        
        // Calculate stats
        const categories: Record<string, number> = {};
        bookList.forEach((book: Book) => {
          const category = book.category || 'uncategorized';
          categories[category] = (categories[category] || 0) + 1;
        });
        
        setStats({
          totalBooks: bookList.length,
          categories
        });
      } catch (error) {
        console.error('Error loading books:', error);
        showToast('Error loading books', 'error');
      }
    };
    
    loadBooks();
  }, [showToast]);

  // Filter books based on search query and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteBook = async (id: string) => {
    try {
      const bookToDelete = books.find(book => book.id === id);
      
      if (storageService.isSupported()) {
        // Delete from IndexedDB
        await storageService.deleteBook(id);
        
        // Update state
        setBooks(books.filter(book => book.id !== id));
      } else {
        // Fall back to localStorage
        const updatedBooks = books.filter(book => book.id !== id);
        setBooks(updatedBooks);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
      }
      
      // Return to the main admin panel view after deletion
      setSelectedBook(null);
      
      // Show toast notification
      showToast(`${bookToDelete?.title} has been deleted successfully`, 'success');
    } catch (error) {
      console.error('Error deleting book:', error);
      showToast('Error deleting book. Please try again.', 'error');
    }
  };
  
  const handleUpdateBook = async (updatedBook: Book) => {
    try {
      if (storageService.isSupported()) {
        // Update in IndexedDB
        await storageService.updateBook(updatedBook);
        
        // Update state
        setBooks(prevBooks => prevBooks.map(book => 
          book.id === updatedBook.id ? updatedBook : book
        ));
      } else {
        // Fall back to localStorage
        const updatedBooks = books.map(book => 
          book.id === updatedBook.id ? updatedBook : book
        );
        
        setBooks(updatedBooks);
        localStorage.setItem('books', JSON.stringify(updatedBooks));
      }
      
      // Update the selected book with the new data
      setSelectedBook(updatedBook);
      setEditingBook(null);
      
      // Show toast notification
      showToast(`${updatedBook.title} has been updated successfully`, 'success');
    } catch (error) {
      console.error('Error updating book:', error);
      showToast('Error updating book. Please try again.', 'error');
    }
  };

  const [selectedBookContent, setSelectedBookContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  
  // Load book content when a book is selected
  useEffect(() => {
    if (selectedBook && storageService.isSupported()) {
      // Check if the book has fileUrl in the book object already
      if (selectedBook.fileUrl) {
        setSelectedBookContent(selectedBook.fileUrl);
        return;
      }
      
      // Otherwise load content from IndexedDB
      setLoadingContent(true);
      storageService.getBookContent(selectedBook.id)
        .then(content => {
          setSelectedBookContent(content);
        })
        .catch(error => {
          console.error('Error loading book content:', error);
          showToast('Error loading book content', 'error');
        })
        .finally(() => {
          setLoadingContent(false);
        });
    }
  }, [selectedBook, showToast]);
  
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <BackButton 
            fallbackRoute="/admin"
            label="Back to Admin Panel"
            className="mb-4"
            onClick={() => {
              setSelectedBook(null);
              setSelectedBookContent(null);
            }}
          />
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="relative h-64 w-full md:h-96">
                <Image
                  src={selectedBook.coverUrl || '/images/placeholder-cover.svg'}
                  alt={selectedBook.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{selectedBook.title}</h2>
                <p className="text-gray-600">By {selectedBook.author}</p>
                {selectedBook.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {selectedBook.category}
                  </span>
                )}
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => setEditingBook(selectedBook)}
                    className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Edit Details
                  </button>
                  <button 
                    onClick={() => handleDeleteBook(selectedBook.id)}
                    className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Delete Book
                  </button>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 mt-6 md:mt-0">
              <div className="bg-gray-50 rounded-lg h-full">
                {loadingContent ? (
                  <div className="flex items-center justify-center h-[600px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="ml-2 text-gray-500">Loading book...</p>
                  </div>
                ) : selectedBookContent ? (
                  <iframe
                    src={selectedBookContent}
                    className="w-full h-[600px] rounded-lg"
                    title={selectedBook.title}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[600px]">
                    <p className="text-gray-500">No PDF file available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={libraryBackground}
          alt="Admin background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-blue-900/10" />
      </div>

      {/* Admin Header */}
      <header className="relative z-10 bg-white bg-opacity-95 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Manage your digital library
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem('currentUser');
                  showToast('You have been signed out', 'info');
                  window.location.href = '/';
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-all duration-200"
              >
                Sign Out
              </button>
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
        </div>
      </header>

      {/* Stats and Search Section */}
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Books</h3>
            <p className="text-3xl font-semibold text-gray-900">{stats.totalBooks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:col-span-3">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.categories).map(([category, count]) => (
                <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {category}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>

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
                  : "Get started by adding some books to your library"}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadBook
          onUpload={async (bookData) => {
            try {
              // Import fileToDataUrl only when needed to avoid SSR issues
              const { fileToDataUrl } = await import('../utils/fileUtils');
              
              // Convert cover image to data URL for quick preview
              const coverUrl = bookData.coverImage ? await fileToDataUrl(bookData.coverImage) : '';
              
              // Create book metadata without the file content
              const newBook: Book = {
                id: Date.now().toString(),
                title: bookData.title,
                author: bookData.author,
                coverUrl: coverUrl,
                fileName: bookData.file ? bookData.file.name : '',
                category: bookData.category
              };
              
              // Use storageService to save book and file content separately
              if (storageService.isSupported() && bookData.file) {
                // Convert file to data URL
                const fileContent = await fileToDataUrl(bookData.file);
                
                // Save book with content to IndexedDB
                await storageService.saveBook(newBook, fileContent);
                
                // Update state with the new book
                setBooks(prevBooks => [...prevBooks, newBook]);
              } else {
                // Fall back to the old method if IndexedDB is not supported
                const fileUrl = bookData.file ? await fileToDataUrl(bookData.file) : '';
                newBook.fileUrl = fileUrl;
                
                const updatedBooks = [...books, newBook];
                setBooks(updatedBooks);
                localStorage.setItem('books', JSON.stringify(updatedBooks));
              }
              
              setIsUploadModalOpen(false);
              showToast(`"${bookData.title}" has been added successfully`, 'success');
            } catch (error) {
              console.error('Error uploading book:', error);
              showToast('Error uploading book. Please try again.', 'error');
            }
          }}
          onCancel={() => setIsUploadModalOpen(false)}
        />
      )}
      
      {/* Edit Modal */}
      {editingBook && (
        <EditBook
          book={editingBook}
          onSave={handleUpdateBook}
          onCancel={() => setEditingBook(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
