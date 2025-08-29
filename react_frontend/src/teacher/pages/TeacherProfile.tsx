

import { useDispatch, useSelector } from "react-redux";
import { Pencil, Lock, User } from "lucide-react";
import type { AppDispatch, RootState} from "../../types/store.types"; 
import { useState } from "react";

import ChangePasswordModal from "../../components/ChangePasswordModal";
import EditTeacherModal from "../components/EditTeacherModal";
import { updateTeacher } from "../../store/teacherSlice";
import { useNotification } from "../../context/notification/useNotification";
import type { AxiosError } from "axios";

const TeacherProfile = () => {
    const teacher = useSelector((state: RootState) => state.teacher.teacher);
    const [isEditModalOpen, setEditModalOpen] = useState(false)
    const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
    const dispatch= useDispatch<AppDispatch>();
    const {showNotification}= useNotification()
   
    const handleSaveTeacher=(updates:{email?:string,  mobileNumber?: string;profileImage?: File | null;})=>{
        try {
             dispatch(updateTeacher({id:teacher?._id as string ,updates:updates})).unwrap()
             setEditModalOpen(false);
             showNotification('success', { message: "Profile updated successfully" });
        } catch (error) {
            const err= error as AxiosError<{message:string}>
            showNotification('error',{message:err.response?.data.message})
        }
       
    }

    return (
        <div className="min-h-screen  p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">

                {/* Left - Profile Card */}
                <div className="col-span-3 bg-white/10 rounded-2xl p-6 text-white flex flex-col items-center">
                    {/* Avatar */}
                    <img
                        src={teacher?.profileImage || '/default-avatar.png'}
                        alt="Profile"
                        className="w-20 bg-fuchsia-300 h-20 rounded-full border-4 border-white"
                    />

                    {/* Info */}
                    <h2 className="text-lg font-semibold">{teacher?.firstName || "Sample Name"}</h2>
                    <p className="text-sm text-white/70">{teacher?.subject || "Subject"}</p>

                    {/* Email & Mobile */}
                    <div className="mt-4 text-center space-y-1">
                        <p className="text-sm">
                            <span className="font-medium">Email</span> <br /> {teacher?.email || "sample@sae"}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Mobile</span> <br /> {teacher?.mobileNumber || "12345678"}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex gap-2">
                        <button onClick={() => setEditModalOpen(true)} className="bg-green-500 px-4 py-1 rounded-lg text-white text-sm flex items-center gap-1">
                            <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => setResetPasswordModalOpen(true)} className="bg-yellow-400 px-4 py-1 rounded-lg text-black text-sm flex items-center gap-1">
                            <Lock className="w-4 h-4" /> Change Password
                        </button>
                    </div>
                </div>

                {/* Right - General Information */}
                <div className="col-span-9 bg-white/10 rounded-2xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-pink-400" /> General Information
                    </h3>
                    <div className="bg-white rounded-lg p-4 text-black">
                        <ul className="space-y-2 text-sm">
                            <li>Name: {teacher?.firstName || "Sample Name"}</li>
                            <li>Subject: {teacher?.subject || "Maths"}</li>
                            <li>Email: {teacher?.email || "sample@sae"}</li>
                            <li>Mobile: {teacher?.mobileNumber || "12345678"}</li>

                            <li>Qualification: {teacher?.qualification || "B.Ed"}</li>
                            <li>Experience: {teacher?.experience || "5 Years"}</li>
                        </ul>
                    </div>
                </div>

                {/* Leave Form */}
                <div className="col-span-12 bg-slate-500 rounded-xl p-6 mt-6 text-white relative">
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60  flex items-center justify-center z-10 rounded-xl">
                        <span className="text-lg font-semibold text-white">This facility coming soon</span>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Leave Form</h3>
                    <form className="grid grid-cols-2 gap-4 pointer-events-none opacity-50 ">
                        <input type="text" placeholder="Name" className="px-3 py-2 bg-amber-50 rounded-md text-black" />
                        <input type="text" placeholder="Teacher ID" className="px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <input type="email" placeholder="Email" className="px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <input type="text" placeholder="Mobile Number" className="px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <input type="date" placeholder="Start Date" className="px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <input type="date" placeholder="End Date" className="px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <textarea placeholder="Reason" className="col-span-2 px-3 py-2 rounded-md bg-amber-50 text-black" />
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md col-span-2 w-28">
                            Submit
                        </button>
                    </form>
                </div>

            </div>
            {isEditModalOpen && (
                <EditTeacherModal
                    teacher={{
                        email: teacher?.email || "",
                        mobileNumber: teacher?.mobileNumber || "",
                        profileImage: teacher?.profileImage,
                    }}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSaveTeacher}
                />
            )}
            {isResetPasswordModalOpen && (
                <ChangePasswordModal onClose={() => setResetPasswordModalOpen(false)} />
            )}

        </div>
    );
};

export default TeacherProfile;
