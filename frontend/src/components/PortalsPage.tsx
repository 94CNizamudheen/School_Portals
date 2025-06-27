'use client'

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


const PortalsPage = () => {
  const userRoles = [
    {
      id: 'student',
      title: 'Student',
      image: '/images/student.jpg',
    },
    {
      id: 'teacher',
      title: 'Teacher',
      image: '/images/teacher.jpg',
    },
    {
      id: 'admin',
      title: 'Admin',
      image: '/images/admin.png',
    },
    {
      id: 'parent',
      title: 'Parent',
      image: '/images/parent.png',
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    console.log(`Selected role: ${roleId}`);
    // Add your navigation logic here
    // For Next.js you might use: router.push(`/${roleId}-dashboard`)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple via-purple-700 to-purple relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-white rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative  flex justify-between items-center p-6 md:p-8">
        <button 
          className="bg-white text-purple-800 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
        >
          HELP
        </button>
        <Link href="/">
          <button
            className="bg-white text-purple-800 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-2">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-6 py-6 mb-10 shadow-2xl">
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center">
            Choose your Portal
          </h2>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 max-w-2xl w-full mb-10">
          {userRoles.map((role) => (
            <div key={role.id} className="flex flex-col items-center">
              {/* Card */}
              <button
              
                className="rounded-3xl shadow-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-3xl w-full max-w-xs aspect-square relative overflow-hidden group"
              >
                {/* Image */}
                <Image
                  src={role.image}
                  alt={`${role.title} portal`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
              </button>
              {/* Label */}
              <div className="mt-4">
                <Link href='/login' >
                 <button
                  className="bg-white text-purple-800 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-100 hover:scale-105 transform transition-all duration-300"
                >
                  {role.title}
                </button>
                </Link>
               
              </div>
            </div>
          ))}
        </div>        
      </div>
    </div>
  );
};

export default PortalsPage;