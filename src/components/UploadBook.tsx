"use client";
import React, { useRef, useState } from 'react';
import { useToast } from '../context/ToastContext';
import BackButton from './BackButton';

interface UploadBookProps {
  onUpload: (bookData: {
    title: string;
    author: string;
    category: string;
    file: File;
    coverImage: File | null;
  }) => void;
  onCancel: () => void;
}

const UploadBook: React.FC<UploadBookProps> = ({ onUpload, onCancel }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('other');
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !file) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    
    // Cover image is optional, but show a different message if not provided
    if (!coverImage) {
      showToast('No cover image provided. Using default cover.', 'info');
    }
    
    onUpload({ title, author, category, file, coverImage });
    showToast(`"${title}" has been added successfully`, 'success');
    
    // Reset form
    setTitle('');
    setAuthor('');
    setCategory('other');
    setFile(null);
    setCoverImage(null);
    setCoverPreview(null);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full p-6 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <div 
            onClick={() => coverInputRef.current?.click()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-blue-500"
          >
            {coverPreview ? (
              <img src={coverPreview} alt="Cover preview" className="h-48 object-contain" />
            ) : (
              <div className="space-y-1 text-center">
                <div className="text-gray-600">
                  <p>Click to upload cover image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">PDF File</label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <div className="space-y-1 text-center">
              <div className="text-gray-600">
                <p>{file ? file.name : 'Drag & drop PDF here, or click to select'}</p>
                <p className="text-xs text-gray-500">PDF up to 50MB</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Book
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

export default UploadBook;
