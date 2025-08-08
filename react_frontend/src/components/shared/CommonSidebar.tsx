

import { Link, useLocation } from "react-router-dom";
import { LogOut, X } from "lucide-react";
import { useSelector } from "react-redux";
import LogoutModal from "../LogoutModal"; 
import { navConfig } from "../../utils/navConfig"; 
import type{ RootState } from "../../store/store"; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommonSidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const role = useSelector((state: RootState) => state.auth.role);
  const tokenKey = 
  role === "STUDENT" ? "STUDENTtoken" :
  role === "TEACHER" ? "TEACHERtoken" :
  role === "PARENT"  ? "PARENTtoken" :
  "ADMINtoken"; 

  const navItems = role ? navConfig[role] || [] : [];

  const isActive = (route: string) => location.pathname === route;

  return (
    <aside
      className={`fixed top-2 left-2 h-[95vh] w-64 bg-[#2c1c5b] text-white transform transition-transform z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 rounded-3xl shadow-2xl`}
    >
      <div className="p-6 flex items-center space-x-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-blue-500" />
        <h2 className="text-lg font-semibold tracking-wide">AUP School</h2>
        <button className="lg:hidden ml-auto" onClick={onClose}>
          <X className="text-white" />
        </button>
      </div>

      <nav className="px-4 pt-4 space-y-2">
        {navItems.map((item, idx) => (
          <Link to={item.route} key={idx} onClick={onClose}>
            <div
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
              ${isActive(item.route)
                ? "bg-white/10 text-white"
                : "text-purple-300 hover:bg-white/10 hover:text-white"}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <LogoutModal
          tokenKey={tokenKey}
          trigger={
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          }
        />
      </div>
    </aside>
  );
};

export default CommonSidebar;
