

const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '2s'}}></div>
                <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
                <div className="absolute bottom-40 left-20 w-5 h-5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1s', animationDuration: '2.2s'}}></div>
                <div className="absolute bottom-20 right-10 w-4 h-4 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '2.8s'}}></div>
            </div>

            {/* Main loading container */}
            <div className="relative z-10 flex flex-col items-center space-y-8">
                {/* Animated books stack */}
                <div className="relative">
                    <div className="flex space-x-1">
                        <div className="w-8 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-sm shadow-lg transform rotate-2 animate-pulse" style={{animationDelay: '0s'}}></div>
                        <div className="w-8 h-12 bg-gradient-to-b from-purple-500 to-purple-600 rounded-sm shadow-lg transform -rotate-1 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                        <div className="w-8 h-12 bg-gradient-to-b from-pink-500 to-pink-600 rounded-sm shadow-lg transform rotate-1 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        <div className="w-8 h-12 bg-gradient-to-b from-green-500 to-green-600 rounded-sm shadow-lg transform -rotate-2 animate-pulse" style={{animationDelay: '0.9s'}}></div>
                    </div>
                    
                    {/* Floating knowledge particles */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        </div>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="w-64 bg-gray-200 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>

                {/* Loading text with typewriter effect */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                        Loading Knowledge
                    </h2>
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>

                {/* Rotating academic icons */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        </div>
                        <div className="absolute top-1/2 right-0 transform translate-x-2 -translate-y-1/2">
                            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                            <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        </div>
                        <div className="absolute top-1/2 left-0 transform -translate-x-2 -translate-y-1/2">
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Bottom wave animation */}
            <div className="absolute bottom-0 left-0 w-full">
                <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-blue-100 opacity-50">
                    <path d="M0,60 C300,120 600,0 900,60 C1000,90 1100,30 1200,60 L1200,120 L0,120 Z" className="animate-pulse">
                    </path>
                </svg>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                    }
                `
            }} />
        </div>
    );
}

export default Loading;