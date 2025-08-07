

import React, { useState } from 'react';
import { X, Mail, User, ArrowRight } from 'lucide-react';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import { useDispatch } from 'react-redux';
import { sendStudentPassword } from '../../store/studentThunks';
import type { AppDispatch } from '../../store/store';
import { useNotification } from '../../context/notification/useNotification';
import type { AxiosError } from 'axios';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StudentForgotPassword: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [parentEmail, setParentEmail] = useState('');
    const [identity, setIdentity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const { showNotification } = useNotification()

    const handleSubmit = async () => {
        if (!parentEmail || !identity) return;
        try {
            setIsSubmitting(true);
            const res= await dispatch(sendStudentPassword({ email: parentEmail, identity })).unwrap()
            showNotification('success', { title: "Send password", message:res || "password sended to parrent email" })
            setIsSubmitting(false)
            onClose();
        } catch (error) {
             setIsSubmitting(false)
            const err= error as AxiosError<{message:string}>
            showNotification('error', { title: "Send password", message:err.response?.data.message ||"Filed to send password" })
        }

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/40 to-black/60 backdrop-blur-xl"
                onClick={onClose}
            />

            <div className="relative student-card-bg backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2x max-w-lg mx-auto p-8 transform transition-all animate-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                    <X size={20} />
                </button>
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-50 via-fuchsia-600 to-gray-900 bg-clip-text text-transparent mb-2">
                        Forgot Password
                    </h2>
                    <p className="text-fuchsia-200 text-lg">
                        We'll send your Password to your Parent Email
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="group">
                        <div className="relative">
                            <input
                                id="parentEmail"
                                type="email"
                                required
                                value={parentEmail}
                                onChange={(e) => setParentEmail(e.target.value)}
                                className=" w-full px-4 py-4 pl-12  border-2 border-gray-200/80 rounded-2xl "
                                placeholder="Parent's Email"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                    <div className="group">
                        <div className="relative">
                            <input
                                id="identity"
                                type="text"
                                required
                                value={identity}
                                onChange={(e) => setIdentity(e.target.value)}
                                className=" w-full px-4 py-4 pl-12  border-2 border-gray-200/80 rounded-2xl "
                                placeholder="Student Identity"
                            />
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400 peer-focus:text-blue-500 transition-colors" />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !parentEmail || !identity}
                        className="group w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 disabled:from-gray-300 disabled:via-fuchsia-700 disabled:to-fuchsia-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed transform"
                    >

                        <>
                            <span> {isSubmitting ? <LoadingIndicator /> : "Send My Password"} </span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>

                    </button>
                </div>

            </div>
        </div>
    );
};
export default StudentForgotPassword