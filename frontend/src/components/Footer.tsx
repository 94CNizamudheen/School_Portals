

import React from 'react'

const Footer = () => {
   return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="text-2xl font-bold text-indigo-400">AUP School</div>
            <p className="text-gray-400">
              Excellence in education since 1995. Building tomorrow's leaders today.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#academics" className="hover:text-white transition-colors">Academics</a></li>
              <li><a href="#activities" className="hover:text-white transition-colors">Activities</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Primary Education</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Secondary Education</a></li>
              <li><a href="#" className="hover:text-white transition-colors">STEM Programs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Arts & Culture</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>123 Education Street</li>
              <li>Learning City, LC 12345</li>
              <li>+1 (555) 123-4567</li>
              <li>info@aupschool.edu</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AUP School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer
