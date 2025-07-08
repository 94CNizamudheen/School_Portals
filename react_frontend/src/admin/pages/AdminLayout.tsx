
// src/admin/AdminLayout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../store/authSlice';
import Header from '@/admin/components/Header';
import Sidebar from '../components/Sidebar';

const API = import.meta.env.VITE_BACKEND_URL;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = location.pathname === '/admin/login';

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (token && role === 'ADMIN') {
        try {
          const response = await axios.get(`${API}/auth/verify-token`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { user, access_token } = response.data;

          if (user?.role !== 'ADMIN') {
            dispatch(logout());
            navigate('/unauthorized');
          } else {
            dispatch(login({ access_token, role: user.role, userId: user.id }));
          }
        } catch (err) {
          dispatch(logout());
          navigate('/admin/login');
          console.log(err)
        }
      } else {
        dispatch(logout());
        navigate('/admin/login');
      }
      setLoading(false);
    };

    if (!isLoginPage) {
      checkAdminAuth();
    } else {
      setLoading(false);
    }
  }, [dispatch, navigate, location.pathname, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );

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
