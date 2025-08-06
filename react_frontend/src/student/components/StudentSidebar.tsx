import { Home, User, Calendar, BookOpen, Users, FileText, X, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import React from "react";
import LogoutModal from "../../components/LogoutModal";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", route: "/student/dashboard" },
    { icon: User, label: "Profile", route: "/student/profile" },
    { icon: Calendar, label: "Attendance", route: "/student/attendance" },
    { icon: BookOpen, label: "Tasks/Homework", route: "/student/tasks" },
    { icon: Users, label: "Teachers", route: "/student/teachers" },
    { icon: FileText, label: "Exams / Results", route: "/student/results" },
  ];

  const isActive = (route: string) => location.pathname === route;

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-r from-purple-950 to-purple-500 text-white transform transition-transform z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="p-4 flex justify-between items-center  ">
          <h2 className="text-xl font-bold">Student Panel</h2>
          <button className="lg:hidden" onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item, idx) => (
            <Link to={item.route} key={idx} onClick={onClose}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive(item.route)
                    ? "bg-purple-700 text-white"
                    : "text-purple-300 hover:bg-purple-800 hover:text-white"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>
        {/* <div className="absolute bottom-6 w-full px-4">
          <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white transition">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div> */}
        <div className="absolute bottom-4 left-4 right-4 ">
        <LogoutModal
          tokenKey="ADMINtoken"
          trigger={
            <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg bg-purple-800 hover:bg-purple-700 text-white transition">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          }
        />
        </div>
      </aside>
      
    </>
  );
};

export default StudentSidebar;
