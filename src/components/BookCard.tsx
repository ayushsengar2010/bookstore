"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { placeholderCover } from '../constants/images';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  progress?: number;
  lastRead?: string;
  onSelect: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ title, author, coverUrl, progress = 0, lastRead, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Book cover with 3D effect */}
      <div className="relative h-64 w-full">
        <div className={`absolute inset-0 bg-gradient-to-r from-black/10 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
        <Image
          src={coverUrl || placeholderCover}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-all duration-500"
          onError={() => {
            // If the image fails to load, it will automatically fall back to the placeholder
            const imgElement = document.querySelector(`[alt="${title}"]`) as HTMLImageElement;
            if (imgElement) {
              imgElement.src = placeholderCover;
            }
          }}
        />
        <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            Read Now
          </div>
        </div>
      </div>

      {/* Book info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate">{title}</h3>
        <p className="text-sm text-gray-600">{author}</p>
        <div className="flex items-center mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {progress > 0 ? `${progress}%` : 'New'}
          </span>
        </div>
        {lastRead && progress > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            Last read: {new Date(lastRead).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
