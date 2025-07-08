"use client"

export function StatisticsChart() {
  const data = [
    { subject: "Math", score: 85 },
    { subject: "Science", score: 92 },
    { subject: "English", score: 78 },
    { subject: "History", score: 88 },
    { subject: "Art", score: 95 },
    { subject: "PE", score: 82 },
    { subject: "Music", score: 90 },
    { subject: "Geography", score: 87 },
    { subject: "Chemistry", score: 91 },
    { subject: "Physics", score: 89 },
  ]

  const maxScore = Math.max(...data.map((item) => item.score))

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-semibold">Statistics</h3>
        <div className="bg-white/20 rounded-lg px-3 py-1">
          <span className="text-xs text-white/80">Average score</span>
          <div className="text-sm font-semibold text-white">149/217</div>
        </div>
      </div>

      <div className="flex items-end space-x-2 h-40">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-pink-500 to-purple-400 rounded-t-sm transition-all duration-500 hover:from-pink-400 hover:to-purple-300"
              style={{ height: `${(item.score / maxScore) * 100}%` }}
            />
            <span className="text-xs text-white/60 mt-2 transform -rotate-45 origin-left">{item.subject}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
