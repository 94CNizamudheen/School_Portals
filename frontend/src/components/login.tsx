'use client'

import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/app/store/authSlice';

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggdIn, setIsloggedIn] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const role = pathName.split('/')[1].toUpperCase();
  const dispatch = useDispatch()

  useEffect(() => {
    const validRoles = ['ADMIN', 'STUDENT', 'TEACHER', 'PARENT'];
    if (!validRoles.includes(role)) {
      setError('Invalid role in URL');
    }
  }, [role]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please Enter email and Password');
      return;
    }

    try {
      const response = await axios.post(`${API}/auth/signin`, {
        email,
        password,
        role,
      });

      const token = response.data.access_token;
      console.log('responce', response)
      console.log("token", token)
      dispatch(login({ token, role }));
      setIsloggedIn(true);

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Please try again');
      } else {
        setError('Login failed. Please try again');
      }
    }
  };

  useEffect(() => {
    if (isLoggdIn) {
      switch (role) {
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        case 'STUDENT':
          router.push('/student/dashboard');
          break;
        case 'TEACHER':
          router.push('/teacher/dashboard');
          break;
        case 'PARENT':
          router.push('/parent/dashboard');
          break;
        default:
          setError('Invalid role');
      }
    }
  }, [isLoggdIn, role, router]);

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30">
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-full mb-4 text-center">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-400"></div>
          <span className="px-4 text-gray-300 text-sm">or</span>
          <div className="flex-1 border-t border-gray-400"></div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <span className="text-gray-300">Don&apos;t have an Account? </span>
          <button
            onClick={() => router.push(`/${role.toLowerCase()}/register`)}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Register
          </button>
        </div>

        {/* Forgot Password */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push(`/${role.toLowerCase()}/forgot-password`)}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
