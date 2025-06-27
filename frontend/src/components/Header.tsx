'use client'
import React, { useState } from 'react'
import { X, Menu } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-gradient-to-br from-purple-900 via-indigo-900  text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold">AUP</div>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="hover:text-indigo-300 transition-colors font-medium">Home</a>
            <a href="#academics" className="hover:text-indigo-300 transition-colors font-medium">Academics</a>
            <a href="#activities" className="hover:text-indigo-300 transition-colors font-medium">Activities</a>
            <a href="#about" className="hover:text-indigo-300 transition-colors font-medium">About</a>
            <a href="#contact" className="hover:text-indigo-300 transition-colors font-medium">Contact</a>
            <Link
              href='/portals'>
              <button
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg ml-4">
                Portal
              </button>
            </Link>


          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <a href="#home" className="text-white hover:text-indigo-300 py-2">Home</a>
              <a href="#academics" className="text-white hover:text-indigo-300 py-2">Academics</a>
              <a href="#activities" className="text-white hover:text-indigo-300 py-2">Activities</a>
              <a href="#about" className="text-white hover:text-indigo-300 py-2">About</a>
              <a href="#contact" className="text-white hover:text-indigo-300 py-2">Contact</a>
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-semibold hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg mt-4 self-start">
                Portals
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header