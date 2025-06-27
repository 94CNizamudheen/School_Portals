


import React from 'react'

const AcadamicSection = () => {
  const programs = [
    {
      title: "Primary Education",
      description: "Building strong foundations in core subjects with interactive learning methods and personalized attention for young learners.",
      icon: "🎯",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Secondary Education", 
      description: "Advanced curriculum preparation with focus on critical thinking, problem-solving, and college readiness programs.",
      icon: "🚀",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "STEM Programs",
      description: "Cutting-edge Science, Technology, Engineering, and Mathematics programs with hands-on laboratory experiences.",
      icon: "🔬",
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section id="academics" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Academic Excellence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive academic programs are designed to challenge and inspire students 
            at every level, fostering both intellectual growth and personal development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="group">
              <div className={`bg-gradient-to-br ${program.color} rounded-3xl p-8 text-white shadow-xl transform group-hover:scale-105 transition-all duration-300`}>
                <div className="text-4xl mb-6">{program.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
                <p className="text-lg opacity-90 leading-relaxed">{program.description}</p>
                <div className="mt-6">
                  <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AcadamicSection
