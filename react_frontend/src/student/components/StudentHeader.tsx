import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";



interface Props {
    onMenuClick: () => void;
}

const StudentHeader: React.FC<Props> = ({ onMenuClick }) => {
    const student = useSelector((state: RootState) => state.student.student);

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-950 text-white shadow-md ">
            <button
                onClick={onMenuClick}
                className="lg:hidden text-2xl focus:outline-none"
            >
                ☰
            </button>

            {/* Right-side controls */}
            <div className="flex items-center space-x-4 ml-auto">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow text-black text-lg">
                    🔔
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow text-black text-lg">
                    ⚙️
                </div>

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

                <button className="bg-white px-3 py-1 text-sm rounded-full shadow text-black hidden sm:inline-block">
                    ❓ Help Lines
                </button>
            </div>
        </header>
    );
};

export default StudentHeader;
