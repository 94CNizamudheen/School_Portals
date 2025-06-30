'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type Role = 'student' | 'teacher' | 'parent' | '';

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: Role;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) {
      alert('Please select a role');
      return;
    }

    // Send data to backend (admin panel logic will handle ID creation)
    console.log('Form submitted:', formData);
    // You can use fetch/axios to post this to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative  max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-2xl font-bold">AUP Pathaikkara</h1>
          <Link href="/login">
            <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Sign-In
            </button>
          </Link>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
          <h2 className="text-white text-3xl font-bold text-center mb-8">Register User</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name and Email */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-style"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  className="input-style"
                  required
                />
              </div>
            </div>

            {/* Mobile and Role */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="input-style"
                  required
                />
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2 bg">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-style text-white "
                  required
                >
                  <option className='bg-purple-900' value="">Select Role</option>
                  <option className='bg-purple-900' value="student">Student</option>
                  <option className='bg-purple-900' value="teacher">Teacher</option>
                  <option className='bg-purple-900' value="parent">Parent</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-style"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className='input-style'
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
