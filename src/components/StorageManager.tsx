"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useBooksSync, isServiceWorkerSupported, registerServiceWorker } from '../utils/syncUtils';
import { useToast } from '../context/ToastContext';
import BackButton from './BackButton';

interface StorageManagerProps {
  userId?: string; // Optional user ID for cloud sync
}

const StorageManager: React.FC<StorageManagerProps> = ({ userId }) => {
  const { showToast } = useToast();
  const { pushToCloud, pullFromCloud, exportBooksToFile, importBooksFromFile } = useBooksSync();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if service worker is supported
    const checkOfflineSupport = async () => {
      const supported = isServiceWorkerSupported();
      setIsOfflineAvailable(supported);
      
      if (supported) {
        const registered = await registerServiceWorker();
        if (registered) {
          showToast('Offline reading is available', 'info');
        }
      }
    };
    
    // Get last sync time
    const lastSync = localStorage.getItem('lastSync');
    if (lastSync) {
      setLastSyncDate(new Date(lastSync).toLocaleString());
    }
    
    // Check online status
    const handleOnline = () => {
      setIsOnline(true);
      showToast('You are back online', 'success');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      showToast('You are offline. Limited functionality available.', 'info');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    checkOfflineSupport();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  const handlePushToCloud = async () => {
    if (!userId) {
      showToast('Please sign in to sync your books', 'error');
      return;
    }
    
    if (!isOnline) {
      showToast('You are offline. Cannot sync to cloud.', 'error');
      return;
    }
    
    setSyncStatus('syncing');
    const success = await pushToCloud(userId);
    setSyncStatus(success ? 'success' : 'error');
    
    if (success) {
      const now = new Date().toISOString();
      localStorage.setItem('lastSync', now);
      setLastSyncDate(new Date(now).toLocaleString());
    }
  };
  
  const handlePullFromCloud = async () => {
    if (!userId) {
      showToast('Please sign in to download your books', 'error');
      return;
    }
    
    if (!isOnline) {
      showToast('You are offline. Cannot download from cloud.', 'error');
      return;
    }
    
    setSyncStatus('syncing');
    const books = await pullFromCloud(userId);
    setSyncStatus(books.length > 0 ? 'success' : 'error');
    
    if (books.length > 0) {
      const now = new Date().toISOString();
      localStorage.setItem('lastSync', now);
      setLastSyncDate(new Date(now).toLocaleString());
      showToast(`Downloaded ${books.length} books from cloud`, 'success');
    }
  };
  
  const handleExport = () => {
    exportBooksToFile();
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const books = await importBooksFromFile(file);
      showToast(`Imported ${books.length} books successfully`, 'success');
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const getStorageEstimate = async () => {
    if (!navigator.storage || !navigator.storage.estimate) {
      return { usage: 'Unknown', quota: 'Unknown' };
    }
    
    try {
      const estimate = await navigator.storage.estimate();
      const usageInMB = Math.round(estimate.usage! / (1024 * 1024));
      const quotaInMB = Math.round(estimate.quota! / (1024 * 1024));
      return {
        usage: `${usageInMB} MB`,
        quota: `${quotaInMB} MB`,
      };
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return { usage: 'Unknown', quota: 'Unknown' };
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Storage & Sync</h2>
        <BackButton label="Back" fallbackRoute="/user" />
      </div>
      
      <div className="mb-5 space-y-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">Status: {isOnline ? 'Online' : 'Offline'}</span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isOfflineAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm">Offline Reading: {isOfflineAvailable ? 'Available' : 'Not Available'}</span>
        </div>
        
        {lastSyncDate && (
          <div className="text-sm text-gray-500">
            Last synced: {lastSyncDate}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={handlePushToCloud}
          disabled={!isOnline || syncStatus === 'syncing' || !userId}
          className={`px-3 py-2 text-sm rounded-md text-white ${
            !isOnline || !userId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {syncStatus === 'syncing' ? 'Uploading...' : 'Upload to Cloud'}
        </button>
        
        <button
          onClick={handlePullFromCloud}
          disabled={!isOnline || syncStatus === 'syncing' || !userId}
          className={`px-3 py-2 text-sm rounded-md text-white ${
            !isOnline || !userId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {syncStatus === 'syncing' ? 'Downloading...' : 'Download from Cloud'}
        </button>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h3 className="font-medium text-sm mb-2">Local Backup</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Export Books
          </button>
          
          <button
            onClick={handleImportClick}
            className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800"
          >
            Import Books
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>Note: Cloud sync requires an account.</p>
        <p>Offline mode allows reading without internet.</p>
      </div>
    </div>
  );
};

export default StorageManager;
