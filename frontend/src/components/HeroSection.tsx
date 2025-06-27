import React from 'react'

const HeroSection = () => {
  return (
    <section id="home" className="text-white relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      ></div>
      {/* Overlay for darkening effect */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      
      <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 xl:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight break-words">
              <span className="block">AUP School</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400 mt-1 sm:mt-2">
                Where Learning Meets Excellence
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed max-w-xs sm:max-w-md md:max-w-2xl mx-auto lg:mx-0 px-2 sm:px-0">
              Empowering students to reach their full potential through innovative education, 
              creative thinking, and collaborative learning in a nurturing environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center lg:justify-start pt-2 sm:pt-4 px-2 sm:px-0">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap">
                Explore Programs
              </button>
              <button className="border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:bg-white hover:text-indigo-900 transition-all duration-300 whitespace-nowrap">
                Schedule Visit
              </button>
            </div>
          </div>
          
          {/* Right Stats Card */}
          <div className="relative order-1 lg:order-2 px-2 sm:px-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl max-w-xs sm:max-w-md mx-auto lg:max-w-none">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm sm:text-lg md:text-xl">👥</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">2,500+</h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Active Students</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm sm:text-lg md:text-xl">🏆</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">98%</h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Success Rate</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-sm sm:text-lg md:text-xl">📖</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">50+</h3>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base">Programs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection