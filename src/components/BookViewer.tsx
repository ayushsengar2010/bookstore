"use client";
import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '../context/ToastContext';
import BackButton from './BackButton';
import { storageService } from '../utils/storageService';

interface BookViewerProps {
  bookId?: string;
  onBack: () => void;
}

const BookViewer: React.FC<BookViewerProps> = ({ bookId, onBack }) => {
  const { showToast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [readingPosition, setReadingPosition] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [notes, setNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState(false);
  
  const [bookContent, setBookContent] = useState<string | null>(null);
  
  useEffect(() => {
    if (!bookId) return;
    
    async function loadBook() {
      try {
        let foundBook: Book | null = null;
        
        if (storageService.isSupported() && bookId) {
          // Try to get book from IndexedDB
          const bookWithContent = await storageService.getBook(bookId);
          
          if (bookWithContent) {
            foundBook = bookWithContent.metadata;
            setBookContent(bookWithContent.content || null);
          }
        }
        
        // Fall back to localStorage if not found in IndexedDB
        if (!foundBook) {
          const savedBooks = localStorage.getItem('books');
          const parsedBooks = savedBooks ? JSON.parse(savedBooks) : [];
          foundBook = parsedBooks.find((b: Book) => b.id === bookId);
          
          if (foundBook && foundBook.fileUrl) {
            setBookContent(foundBook.fileUrl);
          }
        }
        
        if (foundBook) {
          setBook(foundBook);
          
          // Retrieve last reading position if available
          const positions = localStorage.getItem('readingPositions');
          const parsedPositions = positions ? JSON.parse(positions) : {};
          if (bookId && parsedPositions[bookId]) {
            setReadingPosition(parsedPositions[bookId]);
          }
          
          // Retrieve notes if available
          if (bookId) {
            const savedNotes = localStorage.getItem(`notes_${bookId}`);
            if (savedNotes) {
              setNotes(savedNotes);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        showToast('Error loading book', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    loadBook();
  }, [bookId, showToast]);
  
  // Save reading position when unloading and track progress
  useEffect(() => {
    if (!book) return;
    
    const iframe = document.getElementById('pdf-viewer') as HTMLIFrameElement;
    
    const updateProgress = () => {
      if (iframe && iframe.contentWindow) {
        const scrollPosition = iframe.contentWindow.scrollY || 0;
        const scrollHeight = iframe.contentDocument?.documentElement.scrollHeight || 0;
        const clientHeight = iframe.contentWindow.innerHeight || 0;
        
        // Calculate progress percentage
        if (scrollHeight > 0) {
          const maxScroll = scrollHeight - clientHeight;
          const progress = Math.min(Math.round((scrollPosition / maxScroll) * 100), 100);
          setReadingProgress(progress);
          
          // Update book progress in localStorage
          const savedBooks = localStorage.getItem('books');
          const parsedBooks = savedBooks ? JSON.parse(savedBooks) : [];
          const updatedBooks = parsedBooks.map((b: Book) => {
            if (b.id === book.id) {
              return {
                ...b,
                progress: progress,
                lastRead: new Date().toISOString()
              };
            }
            return b;
          });
          
          localStorage.setItem('books', JSON.stringify(updatedBooks));
        }
      }
    };
    
    const savePosition = () => {
      if (book && iframe && iframe.contentWindow) {
        const scrollPosition = iframe.contentWindow.scrollY || 0;
        
        // Store in localStorage
        const positions = localStorage.getItem('readingPositions');
        const parsedPositions = positions ? JSON.parse(positions) : {};
        parsedPositions[book.id] = scrollPosition;
        localStorage.setItem('readingPositions', JSON.stringify(parsedPositions));
        
        // Update progress one last time
        updateProgress();
      }
    };
    
    // Set up scroll event listener to track progress
    const handleScroll = () => {
      if (iframe?.contentWindow) {
        // Use debounce/throttle for better performance
        if (iframe.contentWindow.scrollY % 20 === 0) { // update every 20px of scrolling
          updateProgress();
        }
      }
    };
    
    // Add event listener to iframe once it's loaded
    const addScrollListener = () => {
      if (iframe?.contentWindow) {
        iframe.contentWindow.addEventListener('scroll', handleScroll);
      }
    };
    
    // Check if iframe is loaded
    if (iframe) {
      iframe.onload = addScrollListener;
    }
    
    // Set up unload event listener
    window.addEventListener('beforeunload', savePosition);
    
    return () => {
      savePosition();
      window.removeEventListener('beforeunload', savePosition);
      if (iframe?.contentWindow) {
        iframe.contentWindow.removeEventListener('scroll', handleScroll);
      }
    };
  }, [book]);
  
  const handleChangeFontSize = (size: string) => {
    setFontSize(size);
    // This would ideally change the font size in the PDF viewer
    // For a real implementation, we would need to use a PDF.js library with text extraction
  };
  
  const handleSaveNotes = () => {
    if (book) {
      localStorage.setItem(`notes_${book.id}`, notes);
      showToast('Notes saved successfully', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading book...</div>
      </div>
    );
  }
  
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 text-center mb-4">
          Book not found or has been removed.
        </div>
        <BackButton
          fallbackRoute="/user"
          label="Back to Library"
          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm transition-colors"
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <BackButton
            fallbackRoute="/user"
            label="Back to Library"
          />
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Text Size:</span>
              <button
                onClick={() => handleChangeFontSize('small')}
                className={`p-1 text-xs border rounded-md ${fontSize === 'small' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              >
                A
              </button>
              <button
                onClick={() => handleChangeFontSize('medium')}
                className={`p-1 text-sm border rounded-md ${fontSize === 'medium' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              >
                A
              </button>
              <button
                onClick={() => handleChangeFontSize('large')}
                className={`p-1 text-base border rounded-md ${fontSize === 'large' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
              >
                A
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Book Info Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-gray-50 rounded-lg p-4 sticky top-4">
              <div className="relative h-60 w-full">
                <Image
                  src={book.coverUrl || '/images/placeholder-cover.svg'}
                  alt={book.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg shadow-md"
                />
              </div>
              
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900">{book.title}</h2>
                <p className="text-gray-600">By {book.author}</p>
                {book.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {book.category}
                  </span>
                )}
              </div>
              
              <hr className="my-4 border-gray-200" />
              
              <div className="text-sm text-gray-500">
                <p>Filename: {book.fileName}</p>
                
                {/* Reading Progress */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Reading Progress</span>
                    <span className="text-xs font-semibold text-blue-600">{readingProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${readingProgress}%` }}
                    ></div>
                  </div>
                  {book.lastRead && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last read: {new Date(book.lastRead).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    // Get iframe element and scroll to top
                    const iframe = document.getElementById('pdf-viewer') as HTMLIFrameElement;
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.scrollTo(0, 0);
                    }
                    showToast('Returned to beginning of book', 'info');
                  }}
                  className="w-full text-blue-600 hover:bg-blue-50 border border-blue-300 px-4 py-2 rounded-md text-sm transition-colors"
                >
                  Return to Start
                </button>
                
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                >
                  {showNotes ? 'Hide Notes' : 'View Notes'}
                </button>
              </div>
              
              {showNotes && (
                <div className="mt-6 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">My Notes</h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-32 p-2 text-sm border border-yellow-300 rounded-md bg-white text-gray-900"
                    placeholder="Add your notes about this book here..."
                  />
                  <button
                    onClick={handleSaveNotes}
                    className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className="md:w-3/4">
            <div className="bg-gray-50 rounded-lg h-full">
              {bookContent ? (
                <iframe
                  id="pdf-viewer"
                  src={bookContent}
                  className="w-full h-[800px] rounded-lg"
                  title={book.title}
                />
              ) : (
                <div className="flex items-center justify-center h-[800px]">
                  <p className="text-gray-500">Loading PDF or no file available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;
