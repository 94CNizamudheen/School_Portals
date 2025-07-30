



const ComponentLoader = () => {
  return (
 
       <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
                    </div>

                    <div className="space-y-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

  )
}

export default ComponentLoader
