

import React from 'react'

const ActivitiesSection = () => {
  const activities = [
    { title: "Science Lab", image: "🔬", description: "State-of-the-art laboratory facilities" },
    { title: "Library", image: "📚", description: "Extensive collection of books and digital resources" },
    { title: "Sports Complex", image: "🏃", description: "Modern gymnasium and outdoor facilities" },
    { title: "Arts Studio", image: "🎨", description: "Creative spaces for artistic expression" },
    { title: "Music Room", image: "🎵", description: "Professional music equipment and practice rooms" },
    { title: "Computer Lab", image: "💻", description: "Latest technology for digital learning" }
  ];

  return (
    <section id="activities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">School Activities & Facilities</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond academics, we offer a wide range of activities and world-class facilities 
            to ensure holistic development of our students.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {activities.map((activity, index) => (
            <div key={index} className="group">
              <div className="bg-gray-800  rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {activity.image}
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">{activity.title}</h3>
                <p className="text-gray-300">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ActivitiesSection
