"use client";
import React from 'react';
import BookCard from './BookCard';

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  file?: File;
}

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

const Library: React.FC<LibraryProps> = ({ books, onSelectBook }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={book.author}
          coverUrl={book.coverUrl}
          onSelect={() => onSelectBook(book)}
        />
      ))}
    </div>
  );
};

export default Library;
