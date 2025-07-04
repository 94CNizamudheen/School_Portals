'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname, } from 'next/navigation';
import { Home, Users, GraduationCap, BookOpen, Calendar, DollarSign, TrendingUp, Settings, LogOut, X } from 'lucide-react';
import LogoutModal from '../LogoutModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Users, label: 'Students', route: '/admin/students' },
    { icon: GraduationCap, label: 'Teachers', route: '/admin/teachers' },
    { icon: Users, label: 'Parents', route: '/admin/parents' },
    { icon: BookOpen, label: 'Classes', route: '/admin/classes' },
    { icon: Calendar, label: 'Schedule', route: '/admin/schedule' },
    { icon: DollarSign, label: 'Fees', route: '/admin/fees' },
    { icon: TrendingUp, label: 'Reports', route: '/admin/reports' },
    { icon: Settings, label: 'Settings', route: '/admin/settings' }
  ];

  const isActiveRoute = (route: string) => {
    return pathname === route;
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-8 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">SchoolAdmin</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <Link key={index} href={item.route}>
            <button
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActiveRoute(item.route)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              onClick={() => {
                // Close sidebar on mobile when item is clicked
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <LogoutModal
          tokenKey='ADMINtoken'
          trigger={
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-all duration-200">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          }
        />

      </div>
    </div>
  );
};

export default Sidebar;