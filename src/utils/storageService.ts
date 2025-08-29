"use client";

import { Book } from "@/types/book";

// Interface representing a book with content separated from metadata
interface BookWithContent {
  metadata: Book;
  content?: string;
}

class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'bookstoreDB';
  private readonly DB_VERSION = 1;
  private readonly BOOKS_STORE = 'books';
  private readonly CONTENT_STORE = 'bookContent';
  
  constructor() {
    // Initialize the database
    this.initDB();
  }
  
  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      // Only initialize in browser environment
      if (typeof window === 'undefined') {
        reject('IndexedDB not available in this environment');
        return;
      }
      
      if (this.db) {
        resolve(this.db);
        return;
      }
      
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = (event) => {
        console.error('Error opening IndexedDB', event);
        reject('Error opening IndexedDB');
      };
      
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains(this.BOOKS_STORE)) {
          db.createObjectStore(this.BOOKS_STORE, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(this.CONTENT_STORE)) {
          db.createObjectStore(this.CONTENT_STORE, { keyPath: 'id' });
        }
      };
    });
  }
  
  /**
   * Saves a book with its content
   */
  async saveBook(book: Book, content?: string): Promise<void> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.BOOKS_STORE, this.CONTENT_STORE], 'readwrite');
        
        transaction.onerror = (event) => {
          console.error('Transaction error:', event);
          reject('Error saving book');
        };
        
        // Save book metadata
        const booksStore = transaction.objectStore(this.BOOKS_STORE);
        booksStore.put(book);
        
        // Save content separately if provided
        if (content) {
          const contentStore = transaction.objectStore(this.CONTENT_STORE);
          contentStore.put({ id: book.id, content });
        }
        
        transaction.oncomplete = () => {
          // Update localStorage with just the list of books (without content)
          this.updateLocalStorage();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error saving book:', error);
      throw error;
    }
  }
  
  /**
   * Gets all books without content
   */
  async getAllBooks(): Promise<Book[]> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.BOOKS_STORE], 'readonly');
        const store = transaction.objectStore(this.BOOKS_STORE);
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting books:', event);
          reject('Error getting books');
        };
      });
    } catch (error) {
      console.error('Error getting books:', error);
      // Fall back to localStorage if IndexedDB fails
      const books = localStorage.getItem('books');
      return books ? JSON.parse(books) : [];
    }
  }
  
  /**
   * Gets a book's content
   */
  async getBookContent(bookId: string): Promise<string | null> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.CONTENT_STORE], 'readonly');
        const store = transaction.objectStore(this.CONTENT_STORE);
        const request = store.get(bookId);
        
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result.content);
          } else {
            resolve(null);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error getting book content:', event);
          reject('Error getting book content');
        };
      });
    } catch (error) {
      console.error('Error getting book content:', error);
      return null;
    }
  }
  
  /**
   * Gets a single book with its content
   */
  async getBook(bookId: string): Promise<BookWithContent | null> {
    try {
      const db = await this.initDB();
      
      const metadata = await new Promise<Book | null>((resolve, reject) => {
        const transaction = db.transaction([this.BOOKS_STORE], 'readonly');
        const store = transaction.objectStore(this.BOOKS_STORE);
        const request = store.get(bookId);
        
        request.onsuccess = () => {
          resolve(request.result || null);
        };
        
        request.onerror = (event) => {
          console.error('Error getting book:', event);
          reject('Error getting book');
        };
      });
      
      if (!metadata) return null;
      
      const content = await this.getBookContent(bookId);
      
      return {
        metadata,
        content: content || undefined
      };
    } catch (error) {
      console.error('Error getting book with content:', error);
      return null;
    }
  }
  
  /**
   * Deletes a book and its content
   */
  async deleteBook(bookId: string): Promise<void> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.BOOKS_STORE, this.CONTENT_STORE], 'readwrite');
        
        transaction.onerror = (event) => {
          console.error('Transaction error:', event);
          reject('Error deleting book');
        };
        
        // Delete book metadata
        const booksStore = transaction.objectStore(this.BOOKS_STORE);
        booksStore.delete(bookId);
        
        // Delete content
        const contentStore = transaction.objectStore(this.CONTENT_STORE);
        contentStore.delete(bookId);
        
        transaction.oncomplete = () => {
          // Update localStorage
          this.updateLocalStorage();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }
  
  /**
   * Updates a book's metadata
   */
  async updateBook(book: Book): Promise<void> {
    try {
      const db = await this.initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.BOOKS_STORE], 'readwrite');
        const store = transaction.objectStore(this.BOOKS_STORE);
        
        const request = store.put(book);
        
        request.onsuccess = () => {
          // Update localStorage
          this.updateLocalStorage();
          resolve();
        };
        
        request.onerror = (event) => {
          console.error('Error updating book:', event);
          reject('Error updating book');
        };
      });
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }
  
  /**
   * Updates localStorage with the current list of books (metadata only)
   * This keeps localStorage in sync with IndexedDB for compatibility
   */
  private async updateLocalStorage(): Promise<void> {
    try {
      const books = await this.getAllBooks();
      localStorage.setItem('books', JSON.stringify(books));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
  }
  
  /**
   * Migrates existing books from localStorage to IndexedDB
   */
  async migrateFromLocalStorage(): Promise<void> {
    try {
      // Check if we have books in localStorage
      const booksJson = localStorage.getItem('books');
      if (!booksJson) return;
      
      const books: Book[] = JSON.parse(booksJson);
      
      // For each book, save it to IndexedDB
      for (const book of books) {
        // Extract content from the book if it exists
        let content: string | undefined;
        if (book.fileUrl && book.fileUrl.startsWith('data:')) {
          content = book.fileUrl;
          // Remove content from the book object to avoid storing it twice
          delete book.fileUrl;
        }
        
        await this.saveBook(book, content);
      }
      
      console.log('Migration complete');
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
    }
  }
  
  /**
   * Check if IndexedDB is available and working
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'indexedDB' in window;
  }
}

// Create a singleton instance
export const storageService = new StorageService();
