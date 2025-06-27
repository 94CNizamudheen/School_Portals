'use client'

import React, { useState } from 'react'
import Link from 'next/link';

const page = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        // Handle login logic here
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
                <h1 className="text-white text-xl font-semibold">AUP Pathaikkara</h1>
                <Link href='/register' >
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-medium transition-colors">
                        Register
                    </button>
                </Link>

            </div>

            {/* Login Form */}
            <div >
                <div className="bg-gradient-to-b from-purple-800/50 to-purple-900/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-700/30">
                    <h2 className="text-white text-3xl font-bold text-center mb-8">Login</h2>

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
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}  // Fix: Dynamic type based on showPassword state
                                placeholder="Your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 rounded-full bg-white/90 placeholder-gray-500 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"  // Fix: Better hover color
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
                        <span className="text-gray-300">Don't have an Account? </span>
                        <button className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                            Register
                        </button>
                    </div>

                    {/* Forgot Password */}
                    <div className="text-center mt-6">
                        <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Forget Password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default page
