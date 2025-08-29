"use client";
import React, { useState } from 'react';
import { Book } from '../types/book';
import { useToast } from '../context/ToastContext';
import BackButton from './BackButton';

interface EditBookProps {
  book: Book;
  onSave: (updatedBook: Book) => void;
  onCancel: () => void;
}

const EditBook: React.FC<EditBookProps> = ({ book, onSave, onCancel }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [category, setCategory] = useState(book.category || 'other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !author) {
      showToast('Title and author are required', 'error');
      return;
    }
    
    const updatedBook: Book = {
      ...book,
      title,
      author,
      category
    };
    
    onSave(updatedBook);
    showToast(`"${title}" has been updated successfully`, 'success');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Book Details</h2>
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
            >
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="technical">Technical</option>
              <option value="business">Business</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="pt-4 flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <BackButton
              label="Cancel"
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
              onClick={onCancel}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
