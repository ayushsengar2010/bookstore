"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '../../../components/AdminPanel';
import { isAuthenticated, isAdmin as checkIsAdmin } from '../../../utils/auth';
import { useToast } from '../../../context/ToastContext';

export default function AdminPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      showToast('Please login as admin to access this page', 'error');
      router.push('/admin-login');
      return;
    }
    
    // Check if the user is admin
    if (checkIsAdmin()) {
      setIsAdmin(true);
    } else {
      showToast('Access denied. Admin privileges required.', 'error');
      router.push('/user');
    }
    
    setLoading(false);
  }, [router, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Access denied. Redirecting...</div>
      </div>
    );
  }

  return <AdminPanel />;
}
