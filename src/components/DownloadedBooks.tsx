"use client";
import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { useToast } from '../context/ToastContext';

interface DownloadedBooksProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const DownloadedBooks: React.FC<DownloadedBooksProps> = ({ books, onSelectBook }) => {
  const { showToast } = useToast();
  const [downloadedBooks, setDownloadedBooks] = useState<Book[]>([]);
  const [estimatedStorage, setEstimatedStorage] = useState<number>(0);
  
  useEffect(() => {
    // In a real implementation, we would check which books are available offline
    // For this demo, we'll simulate that all books with fileUrl are "downloaded"
    const downloaded = books.filter(book => book.fileUrl);
    setDownloadedBooks(downloaded);
    
    // Estimate storage used by books
    let totalSize = 0;
    downloaded.forEach(book => {
      // Rough estimation based on PDF data URLs
      if (book.fileUrl) {
        // Estimate based on length of data URL
        totalSize += book.fileUrl.length * 0.75; // data URLs are about 25% larger than the original file
      }
    });
    
    // Convert to MB
    setEstimatedStorage(Math.round(totalSize / (1024 * 1024) * 100) / 100);
  }, [books]);
  
  const handleRemoveDownload = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering book selection
    
    // In a real implementation, this would remove the cached file
    // For this demo, we'll just show a message
    showToast(`${book.title} would be removed from offline storage`, 'info');
  };
  
  if (downloadedBooks.length === 0) {
    return (
      <div className="p-4">
        <p className="text-gray-500 text-sm">No books have been downloaded for offline reading.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-4">
        <h3 className="text-sm font-medium">Downloaded Books</h3>
        <span className="text-xs text-gray-500">{estimatedStorage} MB used</span>
      </div>
      
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {downloadedBooks.map(book => (
          <div 
            key={book.id}
            onClick={() => onSelectBook(book)}
            className="flex items-center p-2 hover:bg-blue-50 rounded-md cursor-pointer"
          >
            <div 
              className="w-10 h-14 bg-cover bg-center rounded mr-2"
              style={{ backgroundImage: `url(${book.coverUrl || '/images/placeholder-cover.svg'})` }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{book.title}</p>
              <p className="text-xs text-gray-500 truncate">{book.author}</p>
            </div>
            <button 
              onClick={(e) => handleRemoveDownload(book, e)}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadedBooks;
