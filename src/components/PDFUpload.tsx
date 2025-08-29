"use client";
import React, { useRef, useState } from 'react';

interface PDFUploadProps {
  onUpload: (file: File) => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onUpload(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <p className="text-lg font-semibold mb-2">Drag & drop your PDF here, or click to select</p>
      <p className="text-sm text-gray-500">Only PDF files are supported</p>
    </div>
  );
};

export default PDFUpload;
