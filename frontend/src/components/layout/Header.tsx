'use client'

import React from 'react';

import { Menu, Search, Bell } from 'lucide-react';
interface HeaderProps {
  onMenuClick: () => void;
  notificationCount: number;
  header?:string
}


const Header: React.FC<HeaderProps> = ({ onMenuClick, notificationCount,header }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl md:text-2xl font-bold">{header}</h2>
          </div>
          
          {/* Mobile: Right side icons */}
          <div className="flex items-center space-x-2 md:hidden">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-700 relative">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">AD</span>
            </div>
          </div>
        </div>
        
        {/* Search bar - full width on mobile */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search students..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Desktop: Right side icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-gray-700 relative">
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">AD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;