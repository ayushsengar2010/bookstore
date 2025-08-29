"use client";
import { ToastProvider } from '@/context/ToastContext';
import ServiceWorkerRegistration from './ServiceWorkerRegistration';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ServiceWorkerRegistration />
      {children}
    </ToastProvider>
  );
}
