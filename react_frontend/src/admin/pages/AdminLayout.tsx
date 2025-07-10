
// src/admin/AdminLayout.tsx
import React, {  useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';


const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  const [sidebarOpen, setSidebarOpen] = useState(false);



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
         <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
