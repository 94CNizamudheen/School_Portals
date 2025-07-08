'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import {  useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
// import { RootState } from '../store/store';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // If token and role exist, assume user is authenticated initially
    if (token && role === 'ADMIN') {
      try {
        const response = await axios.get(`${API}/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const {user,access_token} = response.data;

        if (user?.role !== 'ADMIN') {
          dispatch(logout());
          router.replace('/unauthorized');
        } else {
          // Dispatch login to update Redux state
         dispatch(login({ access_token: access_token, role: user.role, userId: user.id }))
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        dispatch(logout());
        router.replace('/admin/login');
      }
    } else {
      dispatch(logout());
      router.replace('/admin/login');
    }

    setLoading(false);
  };

  checkAdminAuth();
}, [dispatch, router]);

  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 transition-all">
        <Header
          header="Admin Panel"
          onMenuClick={() => setSidebarOpen(true)}
          notificationCount={0}
        />
        <main className="p-4 sm:p-6 lg:p-8 space-y-10">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;