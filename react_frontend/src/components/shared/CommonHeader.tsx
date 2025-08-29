

import { Bell, HelpCircle, Lock, Menu, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChangePasswordModal from "../ChangePasswordModal";
import { fetchStudentById } from "../../store/studentSlice";
import { useNotification } from "../../context/notification/useNotification";
import { fetchParentByEmail } from "../../store/parentSlice";
import type { AxiosError } from "axios";
import { findTeacherByEmail } from "../../store/teacherSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";


interface Props {
    onMenuClick: () => void;
}
const CommonHeader: React.FC<Props> = ({ onMenuClick }) => {
    const student = useAppSelector((state ) => state.student.student);
    const teacher = useAppSelector((state ) => state.teacher.teacher);
    const parent = useAppSelector((state) => state.parent.parent);
    const { role, userEmail, userId } = useAppSelector((state) => state.auth);
   const dispatch = useAppDispatch()
    const { showNotification } = useNotification()

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (role === "STUDENT" && userId) {
                    await dispatch(fetchStudentById(userId));
                } else if (role === "PARENT" && userEmail) {
                    await dispatch(fetchParentByEmail(userEmail));
                } else if (role === "TEACHER") {
                    await dispatch(findTeacherByEmail(userEmail as string)).unwrap()
                }
            } catch (error) {
                const err = error as AxiosError<{ message: string }>;
                showNotification('error', { message: err.response?.data.message || "Something went wrong" });
            }
        };

        fetchData();
    }, [dispatch, role, userId, userEmail, showNotification]);


    let displayName: string | undefined = "";
    let profileImage: string | undefined = "";

    if (role === "STUDENT" && student) {
        displayName = `${student.firstName} ${student.lastName}`;
        profileImage = student.profilePicture;
    } else if (role === "TEACHER" && teacher) {
        console.log(" name", teacher.firstName)
        displayName = `${teacher.firstName} ${teacher.lastName}`;
        profileImage = teacher.profileImage;
    } else if (role === "PARENT" && parent) {

        displayName = parent.name;
        profileImage = "/default-avatar.png";
    }
    console.log("Display name", displayName)
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
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

    return (
        <header className="flex items-center justify-between px-4 lg:px-6 py-4 text-white"
        >
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-white/10">
                <Menu size={24} />
            </button>

            <div className="flex items-center space-x-3 ml-auto">
                <div className="relative">
                    <button className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900">
                        <Bell size={20} />
                    </button>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className={`w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900 ${dropdownOpen ? 'ring-2 ring-white/50 scale-105' : ''}`}
                    >
                        <Settings size={20} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 rounded-t-2xl bg-white shadow-xl ring-1 ring-black/10 z-50" style={{ minWidth: "13rem" }}>
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <img className="w-10 h-10 rounded-full" src={profileImage || "/default-avatar.png"} />
                                    <div>
                                        <div className="font-semibold text-gray-900 text-sm">
                                            {displayName}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">{role} Portal</div>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        setModalOpen(true);
                                    }}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-200"
                                >
                                    <Lock size={16} /> Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                        <div className="font-semibold text-white text-sm">{displayName}</div>
                        <div className="text-xs text-blue-100 capitalize">{role} Portal</div>
                    </div>
                    <img
                        className="w-11 h-11 rounded-full border-2 border-white/20"
                        src={profileImage || "/public/images/parent.png"}
                    />
                </div>

                <button className="hidden md:inline-flex items-center gap-2 bg-white/10 px-4 py-2 text-sm rounded-full text-white">
                    <HelpCircle size={16} />
                    Help & Support
                </button>
            </div>

            {isModalOpen && <ChangePasswordModal onClose={() => setModalOpen(false)} />}
        </header>
    );
};

export default CommonHeader;
