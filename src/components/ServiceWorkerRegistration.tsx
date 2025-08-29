"use client";

import { useEffect } from 'react';
import { storageService } from '@/utils/storageService';
import { useToast } from '@/context/ToastContext';

export default function ServiceWorkerRegistration() {
  const { showToast } = useToast();
  
  useEffect(() => {
    // Initialize storage service and migrate data
    if (storageService.isSupported()) {
      storageService.migrateFromLocalStorage()
        .then(() => {
          console.log('Storage migration completed');
        })
        .catch((error) => {
          console.error('Storage migration error:', error);
        });
    }
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(
          function(registration) {
            console.log('Service Worker registration successful with scope: ', registration.scope);
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
    
    // Handle storage quota errors
    window.addEventListener('error', (event) => {
      if (
        event.error instanceof DOMException &&
        (event.error.name === 'QuotaExceededError' || event.error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      ) {
        console.warn('Storage quota exceeded');
        showToast('Storage space limit reached. Try removing some books first.', 'error');
      }
    });
  }, [showToast]);

  return null;
}
