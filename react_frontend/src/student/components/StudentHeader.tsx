import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Bell, Settings, HelpCircle, Menu, Lock, } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChangePasswordModal from "./StudentPasswordChange";

interface Props {
    onMenuClick: () => void;
}

const StudentHeader: React.FC<Props> = ({ onMenuClick }) => {
    const student = useSelector((state: RootState) => state.student.student);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationCount] = useState(0); 
    const [isModalOpen,setModalOpen]= useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuItemClick = (action: string) => {
        setDropdownOpen(false);
        if(action=="changePassword"){
            setModalOpen(true)
        }
    };

    return (
        <header className="flex items-center justify-between px-4 lg:px-6 py-4 text-white">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                aria-label="Toggle menu"
            >
                <Menu size={24} />
            </button>

            {/* Header Actions */}
            <div className="flex items-center space-x-3 ml-auto">
                {/* Notifications */}
                <div className="relative">
                    <button
                        className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Settings Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900 ${dropdownOpen ? 'ring-2 ring-white/50 scale-105' : ''}`}
                        aria-label="Settings"
                    >
                        <Settings size={20} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 rounded-t-2xl bg-white shadow-xl ring-1 ring-black/10 z-50" style={{ minWidth: "13rem" }}>
                            {/* Profile Section */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <img
                                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                                        src={student?.profilePicture || "/default-avatar.png"}
                                        alt="Profile"
                                    />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            {student?.firstName} {student?.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">Student</div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                
                                <button
                                    onClick={() => handleMenuItemClick('changePassword')}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-fuchsia-200 hover:text-gray-900 transition-colors duration-150 "
                                >
                                    <Lock size={16} />
                                    Change Password
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                {/* Student Profile Info */}
                <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                        <div className="font-semibold text-white text-sm leading-tight">
                            {student?.firstName} {student?.lastName}
                        </div>
                        <div className="text-xs text-blue-100">Student Portal</div>
                    </div>
                    <div className="relative">
                        <img
                            className="w-11 h-11 rounded-full border-2 border-white/20 shadow-lg"
                            src={student?.profilePicture || "/default-avatar.png"}
                            alt="Student profile"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                </div>

                {/* Help Button */}
                <button className="hidden md:inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 text-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-white font-medium">
                    <HelpCircle size={16} />
                    Help & Support
                </button>
            </div>
             {isModalOpen &&(<ChangePasswordModal onClose={()=>setModalOpen(false)}/>)}
        </header>
    );
};

export default StudentHeader;