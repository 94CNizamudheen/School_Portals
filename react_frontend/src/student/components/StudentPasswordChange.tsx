import { useState } from 'react';
import { X } from 'lucide-react';
import { useNotification } from '../../context/notification/useNotification';

import { requestStudentOtp, verifyStudentOtp, changeStudentPassword, } from '../../store/studentThunks';

import { step1Schema, passwordSchema } from '../../utils/validationSchemas';
import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import { generateOtpThunk } from '../../store/authThunks';
import { resetPassword } from '../../store/api';

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {

    const role = useSelector((state: RootState) => state.auth.role)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [emailAndIdentity, setEmailAndIdentity] = useState({ email: '', identity: '' });
    const [otp, setOtp] = useState('');
    const { showNotification } = useNotification();
    const dispatch = useDispatch<AppDispatch>()


    const { register: registerStep1, handleSubmit: handleSubmitStep1, formState: { errors: step1Errors } } = useForm({
        resolver: yupResolver(step1Schema, { context: { role } }),
    });

    const handleStep1Submit = async (data: { email: string; identity?: string }) => {
        console.log('button clicked')
        setLoading(true);
        try {
            if (role === 'STUDENT') {
                await dispatch(requestStudentOtp(data as { email: string; identity: string })).unwrap();

            } else {
                
                await dispatch(generateOtpThunk(data.email)).unwrap();
            }
            setEmailAndIdentity(data as { email: string; identity: string });
            setStep(2);
            setLoading(false)
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            showNotification('error', {
                title: 'OTP',
                message: err.response?.data.message || 'Failed to send OTP',
            });
            setLoading(false)
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            await dispatch(verifyStudentOtp({ email: emailAndIdentity.email, code: otp })).unwrap();
            setStep(3);
            setLoading(false)
        } catch {
            showNotification('error', { title: 'OTP', message: 'Invalid OTP' });
            setLoading(false)
        }
    };

  
    const { register: registerPassword, handleSubmit: handleSubmitPassword, formState: { errors: passwordErrors }, } = useForm({
        resolver: yupResolver(passwordSchema),
    });

    const handlePasswordSubmit = async (data: { password: string; confirmPassword: string }) => {
        try {
            setLoading(true)
            if(role=="STUDENT"){
                await dispatch(changeStudentPassword({ identity: emailAndIdentity.identity, password: data.password })).unwrap();
            }else{
                await resetPassword(emailAndIdentity.email,data.password)
            }
            showNotification('success', {
                title: 'Success',
                message: 'Password changed!',
            });
            setLoading(false)
            onClose();
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            showNotification('error', {
                title: 'Error',
                message: err.response?.data.message || 'Password update failed',
            });
            setLoading(false)
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
            <div className="student-card-bg rounded-xl max-w-md p-6 shadow-xl w-auto">
                <h2 className="text-xl font-bold text-center mb-4 text-purple-300">🔐 Change Password</h2>
                {/* Step 1 */}
                {step === 1 && (
                    <form onSubmit={handleSubmitStep1(handleStep1Submit)} className="space-y-4" noValidate>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                {...registerStep1('email')}
                                className="w-full border p-2 border-amber-50 rounded-2xl"
                            />
                            {step1Errors.email && (
                                <p className="text-red-500 text-sm mt-1">{step1Errors.email.message}</p>
                            )}
                        </div>

                        {role === 'STUDENT' && (
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
                        )}

                        <button
                            type="submit"
                            className="w-full bg-purple-700 text-white py-2 rounded flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? <LoadingIndicator /> : 'Send OTP'}
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
                        <button onClick={handleVerifyOtp}
                            className="w-full bg-purple-700 text-white py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? <LoadingIndicator /> : "Verify OTP"}
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
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded" disabled={loading}>
                            {loading ? <LoadingIndicator /> : "Change Password"}
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
