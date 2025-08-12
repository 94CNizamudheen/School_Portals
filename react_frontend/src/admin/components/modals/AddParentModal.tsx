

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { addParent } from '../../../store/parentSlice';
import { useNotification } from '../../../context/notification/useNotification';
import type { AxiosError } from 'axios';
import { X } from 'lucide-react';

interface AddParentModalProps {
    open: boolean;
    onClose: () => void;
}

export const AddParentModal: React.FC<AddParentModalProps> = ({ open, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { showNotification } = useNotification()

    const [form, setForm] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        occupation: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        relations: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(addParent(form)).unwrap();
            showNotification('success', { message: "Parent add sucessfully" })
            onClose();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>
            showNotification("error", { message: error.response?.data.message || 'Failed to add parent' })
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background blur */}
            <div className="absolute inset-0 bg-[#090625]/80 backdrop-blur-lg"></div>

            {/* Modal */}
            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-auto text-white shadow-xl animate-fadeIn">
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-white hover:text-red-400">
                    <X size={20} />
                </button>

                <h2 className="text-lg font-semibold mb-4 text-center">Add Parent</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm mb-1">Mobile Number</label>
                        <input
                            name="mobileNumber"
                            value={form.mobileNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Occupation */}
                    <div>
                        <label className="block text-sm mb-1">Occupation</label>
                        <input
                            name="occupation"
                            value={form.occupation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Relations */}
                    <div>
                        <label className="block text-sm mb-1">Relation</label>
                        <input
                            name="relations"
                            value={form.relations}
                            onChange={handleChange}
                            placeholder="Father, Mother, Guardian..."
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                        <label className="block text-sm mb-1">Emergency Contact Name</label>
                        <input
                            name="emergencyContactName"
                            value={form.emergencyContactName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Emergency Contact Phone */}
                    <div>
                        <label className="block text-sm mb-1">Emergency Contact Phone</label>
                        <input
                            name="emergencyContactPhone"
                            value={form.emergencyContactPhone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
                        />
                    </div>

                    {/* Save Button */}
                    <button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-white py-2 rounded-lg"
                    >
                        Add Parent
                    </button>
                </form>
            </div>
        </div>
    );
};
