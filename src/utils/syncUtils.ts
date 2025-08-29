"use client";

import { Book } from '../types/book';
import { useToast } from '../context/ToastContext';

// Mock server endpoint - in a real app, this would be your actual API endpoint
const API_ENDPOINT = 'https://api.yourbookstore.com';

/**
 * Synchronizes books between localStorage and cloud storage
 * @returns Methods for syncing, pushing, and pulling book data
 */
export const useBooksSync = () => {
  const { showToast } = useToast();

  /**
   * Push local books to the cloud
   */
  const pushToCloud = async (userId: string) => {
    try {
      showToast('Syncing books to cloud...', 'info');
      
      // Get local books
      const localBooks = JSON.parse(localStorage.getItem('books') || '[]');
      
      // In a real implementation, this would make an API call to your backend
      // For this demo, we'll simulate the API call
      // await fetch(`${API_ENDPOINT}/users/${userId}/books`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(localBooks)
      // });
      
      // Simulate a successful sync
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Store last sync timestamp
      localStorage.setItem('lastSync', new Date().toISOString());
      
      showToast('Books synced to cloud successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error syncing to cloud:', error);
      showToast('Failed to sync books to cloud', 'error');
      return false;
    }
  };
  
  /**
   * Pull books from the cloud to local storage
   */
  const pullFromCloud = async (userId: string) => {
    try {
      showToast('Downloading books from cloud...', 'info');
      
      // In a real implementation, this would make an API call to fetch from your backend
      // const response = await fetch(`${API_ENDPOINT}/users/${userId}/books`);
      // const cloudBooks = await response.json();
      
      // For this demo, we'll just use what's already in localStorage
      const localBooks = JSON.parse(localStorage.getItem('books') || '[]');
      
      // Simulate a download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here we would merge cloud and local data with conflict resolution
      // For demo, we just use local data
      localStorage.setItem('books', JSON.stringify(localBooks));
      localStorage.setItem('lastSync', new Date().toISOString());
      
      showToast('Books downloaded from cloud successfully', 'success');
      return localBooks;
    } catch (error) {
      console.error('Error fetching from cloud:', error);
      showToast('Failed to download books from cloud', 'error');
      return [];
    }
  };
  
  /**
   * Export books to a JSON file for backup
   */
  const exportBooksToFile = () => {
    try {
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      const dataStr = JSON.stringify(books, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `bookstore_backup_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showToast('Books exported successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error exporting books:', error);
      showToast('Failed to export books', 'error');
      return false;
    }
  };
  
  /**
   * Import books from a JSON file
   */
  const importBooksFromFile = async (file: File): Promise<Book[]> => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const books = JSON.parse(e.target?.result as string);
            localStorage.setItem('books', JSON.stringify(books));
            showToast(`Imported ${books.length} books successfully`, 'success');
            resolve(books);
          } catch (parseError) {
            console.error('Error parsing import file:', parseError);
            showToast('Invalid backup file format', 'error');
            reject(parseError);
          }
        };
        
        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          showToast('Failed to read import file', 'error');
          reject(error);
        };
        
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing books:', error);
        showToast('Failed to import books', 'error');
        reject(error);
      }
    });
  };
  
  return {
    pushToCloud,
    pullFromCloud,
    exportBooksToFile,
    importBooksFromFile,
  };
};

// Check if we're in a web environment that supports service workers
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Register service worker for offline capabilities
export const registerServiceWorker = async () => {
  if (!isServiceWorkerSupported()) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('ServiceWorker registration successful with scope:', registration.scope);
    return true;
  } catch (error) {
    console.error('ServiceWorker registration failed:', error);
    return false;
  }
};
