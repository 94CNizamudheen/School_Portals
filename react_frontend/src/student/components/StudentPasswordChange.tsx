import { useState } from 'react';
import { X } from 'lucide-react';
import { useNotification } from '../../context/notification/useNotification';

import {requestStudentOtp, verifyOtp,changeStudentPassword,} from '../../store/studentSlice';

import { step1Schema, passwordSchema } from '../../utils/validationSchemas';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';


const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
    const [step, setStep] = useState(1);
    const [emailAndIdentity, setEmailAndIdentity] = useState({ email: '', identity: '' });
    const [otp, setOtp] = useState('');
    const { showNotification } = useNotification();
    const dispatch= useDispatch<AppDispatch>()

    const {
        register: registerStep1,
        handleSubmit: handleSubmitStep1,
        formState: { errors: step1Errors },
    } = useForm({
        resolver: yupResolver(step1Schema),
    });

    const handleStep1Submit = async (data: { email: string; identity: string }) => {
        try {

            await dispatch(requestStudentOtp(data)).unwrap();
            setEmailAndIdentity(data);
            setStep(2);
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            showNotification('error', {
                title: 'OTP',
                message: err.response?.data.message || 'Failed to send OTP',
            });
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await dispatch(verifyOtp({ email:emailAndIdentity.email, code: otp }))  ;
            setStep(3);
        } catch {
            showNotification('error', { title: 'OTP', message: 'Invalid OTP' });
        }
    };

    // Step 3 form (New Password)
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const handlePasswordSubmit = async (data: { password: string; confirmPassword: string }) => {
        try {
            await dispatch(changeStudentPassword({...emailAndIdentity, password: data.password})) ;
            showNotification('success', {
                title: 'Success',
                message: 'Password changed!',
            });
            onClose();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            showNotification('error', {
                title: 'Error',
                message: err.response?.data.message || 'Password update failed',
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
            <div className="student-card-bg rounded-xl max-w-md p-6 shadow-xl w-auto">
                <h2 className="text-xl font-bold text-center mb-4 text-purple-300">🔐 Change Password</h2>

                {/* Step 1: Email + Identity */}
                {step === 1 && (
                    <form onSubmit={handleSubmitStep1(handleStep1Submit)} className="space-y-4" noValidate>
                        <div>
                            <input 
                                type="email"
                                placeholder="Parent Email"
                                {...registerStep1('email')}
                                className="w-full border p-2 border-amber-50 rounded-2xl"
                            />
                            {step1Errors.email && (
                                <p className="text-red-500 text-sm mt-1">{step1Errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Student Identity"
                                {...registerStep1('identity')}
                                className="w-full border p-2 border-amber-50 rounded-2xl"
                                
                            />
                            {step1Errors.identity && (
                                <p className="text-red-500 text-sm mt-1">{step1Errors.identity.message}</p>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded">
                            Send OTP
                        </button>
                    </form>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full bg-purple-700 text-white py-2 rounded"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {/* Step 3: Password Change */}
                {step === 3 && (
                    <form onSubmit={handleSubmitPassword(handlePasswordSubmit)} className="space-y-4" noValidate>
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                {...registerPassword('password')}
                                className="w-full border p-2 rounded"
                            />
                            {passwordErrors.password && (
                                <p className="text-red-500 text-sm mt-1">{passwordErrors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                {...registerPassword('confirmPassword')}
                                className="w-full border p-2 rounded"
                            />
                            {passwordErrors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {passwordErrors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
                            Change Password
                        </button>
                    </form>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="mt-4 text-sm text-gray-500 underline block text-center border border-amber-50 rounded-2xl"
                >
                    <X />
                </button>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
