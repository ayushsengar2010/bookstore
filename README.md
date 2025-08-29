
# Digital Library App

A modern web application for uploading, managing, and reading PDF books, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Register and login functionality with role-based access (admin/user)
- **Admin Panel**: Upload and manage books, view statistics, and organize content
- **User Library**: Browse, search, and read books in a clean interface
- **PDF Viewing**: Integrated PDF viewer with responsive design
- **Book Management**: Upload PDF files with cover images, categorize books
- **Search & Filter**: Find books by title, author, or category
- **Responsive UI**: Modern UI design that works on desktop and mobile devices

## Tech Stack

- **Next.js 15.5.2** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React 19.1.0**
- **Client-side storage** using localStorage (can be extended with backend APIs)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/digital-library.git
   cd digital-library
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Authentication

- Register a new account using email and password
- Login to access your personal library

### Admin Features

- Access the admin panel for book management
- Upload new books with PDF files and cover images
- View book statistics and categories
- Delete or manage existing books

### User Features

- Browse the book library
- Filter books by category or search by title/author
- Read books in the integrated PDF viewer
- Simple, intuitive interface for browsing and reading

## Project Structure

```
/src
  /app           # App Router pages
    /library     # Main library page
    /(auth)      # Authentication routes
      /login
      /register
      /admin     # Admin panel
      /user      # User panel
  /components    # Reusable components
  /types         # TypeScript type definitions
  /utils         # Utility functions
  /constants     # Constants like backgrounds
/public          # Static assets
```

## Roadmap

- [x] Project scaffolding with Next.js
- [x] PDF upload and viewing
- [x] Authentication system
- [x] Book management
- [x] Admin and user panels
- [x] Search and filter functionality
- [x] Responsive UI design
- [ ] Server-side persistence (database)
- [ ] PDF annotation and highlighting
- [ ] Reading progress tracking
- [ ] Cloud storage for books
- [ ] Social features (sharing, recommendations)

## License

This project is licensed under the MIT License - see the LICENSE file for details.


