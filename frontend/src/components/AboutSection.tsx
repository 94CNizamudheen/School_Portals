

import React from 'react'
import { BookOpen } from 'lucide-react'

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Welcome to AUP School</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At AUP School, we believe that every student has the potential to achieve greatness.
              Our innovative approach to education combines traditional academic excellence with
              cutting-edge technology and creative learning methodologies.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 1995, we have been nurturing young minds for over 25 years, preparing
              them for the challenges of tomorrow while instilling values of integrity,
              compassion, and excellence.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className=" text-center p-6 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-indigo-600">150+</div>
                <div className="text-gray-300">Expert Teachers</div>
              </div>
              <div className="text-center p-6 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-indigo-600">25+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
              style={{ backgroundImage: "url('/images/classroom.jpg')" }}
            ></div>
            <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-600 rounded-3xl p-8 shadow-2xl">
              <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-white/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <BookOpen size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Excellence in Education</h3>
                  <p className="text-lg opacity-90">Building tomorrow's leaders today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection
