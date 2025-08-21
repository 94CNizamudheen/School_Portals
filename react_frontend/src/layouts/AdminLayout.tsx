import { useState } from 'react';
import Header from '../admin/components/Header';
import Sidebar from '../admin/components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
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
        <main className='bg-gradient-to-br from-gray-950 via-gray-400 to-gray-900'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
