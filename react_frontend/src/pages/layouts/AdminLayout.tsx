// src/admin/pages/AdminLayout.tsx
import React, { useState } from 'react';
import { Outlet, useLocation, } from 'react-router-dom';
import { useAuthCheck } from '../../store/hooks';
import Header from '../../admin/components/Header';
import Sidebar from '../../admin/components/Sidebar';

const AdminLayout: React.FC = () => {
  const { loading } = useAuthCheck();

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = location.pathname === '/admin/login';

  if (isLoginPage) {
    return <Outlet />;
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
        <main className="p-4 sm:p-6 lg:p-8 space-y-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;