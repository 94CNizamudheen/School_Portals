

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Users, GraduationCap, BookOpen, Calendar,DollarSign, TrendingUp, Settings, LogOut, X, Pen, BookCopy, CalendarClock,} from 'lucide-react';
import LogoutModal from '../../components/LogoutModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Users, label: 'Students', route: '/admin/students' },
    { icon: Pen, label: 'Admission', route: '/admin/admission' },
    { icon: GraduationCap, label: 'Teachers', route: '/admin/teachers' },
    { icon: Users, label: 'Parents', route: '/admin/parents' },
    { icon: BookOpen, label: 'Classes and Divsion', route: '/admin/classes' }, 
    { icon: BookCopy, label: 'Subjects', route: '/admin/subjects' },
    { icon: Calendar, label: 'School Calender/Event', route: '/admin/calender-schedule' },
    { icon: CalendarClock, label: 'Time Table', route: '/admin/time-table-schedule' },
    { icon: DollarSign, label: 'Fees', route: '/admin/fees' },
    { icon: TrendingUp, label: 'Reports', route: '/admin/reports' },
    { icon: Settings, label: 'Settings', route: '/admin/settings' },
  ];

  const isActiveRoute = (route: string) => location.pathname === route;

  return (
    <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-r from-gray-950 to-gray-600 border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="p-8 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">SchoolAdmin</h1>
          <button onClick={onClose} className="lg:hidden p-2 rounded-lg hover:bg-gray-700">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => (
          <Link key={index} to={item.route} onClick={onClose}>
            <div
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActiveRoute(item.route)
                ? 'bg-gray-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <LogoutModal
          tokenKey="STUDENTtoken"
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
