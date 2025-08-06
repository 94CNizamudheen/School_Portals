import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { Bell, Settings, HelpCircle } from "lucide-react";

interface Props {
    onMenuClick: () => void;
}

const StudentHeader: React.FC<Props> = ({ onMenuClick }) => {
    const student = useSelector((state: RootState) => state.student.student);


    return (
        <header className="flex items-center justify-between px-4 py-3  text-white  mt-1">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-2xl focus:outline-none"
            >
                ☰
            </button>

            <div className="flex items-center space-x-4 ml-auto">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow text-black text-lg">
                    <Bell size={20} />
                </div>
                <button
                 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow text-black"
                >
                    <Settings size={20} />
                </button>

                {/* Student info */}
                <div className="flex items-center space-x-2">
                    <div className="text-sm text-white text-right">
                        <div className="font-bold">{student?.firstName}</div>
                        <div className="text-xs">{student?.lastName}</div>
                    </div>
                    <img
                        className="w-10 h-10 rounded-full border-2 border-white"
                        src={student?.profilePicture || "/default-avatar.png"}
                        alt="student"
                    />
                </div>

                <button className="bg-white px-3 py-1 text-sm rounded-full shadow text-black hidden sm:inline-flex items-center gap-1">
                    <HelpCircle size={16} />
                    Help Lines
                </button>
            </div>

        </header>
    );
};

export default StudentHeader;
