
"use client"

export function AttendanceChart() {
  const percentage = 80

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Attendance</h3>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#facc15"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">{percentage}</span>
              <span className="text-lg text-white">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
