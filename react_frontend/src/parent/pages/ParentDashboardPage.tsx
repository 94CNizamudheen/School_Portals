


import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
import { Star } from "lucide-react";

// import { useEffect } from "react";

// import type { AxiosError } from "axios";
// import { useNotification } from "../../context/notification/useNotification";
// import { fetchParentByEmail } from "../../store/parentSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function ParentDashboard() {
  const barData = {
    labels: ["10-20", "20-30", "30-40", "40-50", "50-60"],
    datasets: [
      {
        label: "Subject A",
        backgroundColor: "#4ade80",
        data: [80, 60, 70, 90, 75],
      },
      {
        label: "Subject B",
        backgroundColor: "#60a5fa",
        data: [60, 80, 75, 70, 65],
      },
      {
        label: "Subject C",
        backgroundColor: "#f472b6",
        data: [70, 75, 80, 60, 68],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  const lineData = {
    labels: ["Jun", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Attendance",
        data: [60, 70, 65, 75, 80, 78],
        borderColor: "#facc15",
        backgroundColor: "#facc15",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  const skills = [
    { name: "Sports", value: 960, max: 1000, color: "bg-green-400" },
    { name: "Arts", value: 720, max: 1000, color: "bg-blue-400" },
    { name: "Science", value: 100, max: 1000, color: "bg-red-400" },
  ];

  const students = [
    { name: "Abebe Alemu", points: 5000, rating: 5 },
    { name: "Abebe Alemu", points: 5000, rating: 5 },
    { name: "Sample Name", points: 5000, rating: 5, highlight: true },
    { name: "Abebe Alemu", points: 5000, rating: 5 },
    { name: "Abebe Alemu", points: 5000, rating: 5 },
    { name: "Abebe Alemu", points: 5000, rating: 5 },
  ];

  return (
    <div className=" text-white p-6 grid grid-cols-4 gap-6 min-h-full">
      {/* Topics Performance */}
      <div className="bg-[#2c2f54] p-4 rounded-lg col-span-2">
        <h2 className="text-lg font-semibold mb-4">Topics Performance</h2>
        <Bar data={barData} options={barOptions} />
        <div className="flex gap-4 mt-4">
          {barData.datasets.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: d.backgroundColor }}
              ></span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-[#2c2f54] p-4 rounded-lg col-span-1">
        <h2 className="text-lg font-semibold mb-4">Skills</h2>
        {skills.map((skill, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between mb-1">
              <span>{skill.name}</span>
              <span>{skill.value}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`${skill.color} h-3 rounded-full`}
                style={{
                  width: `${(skill.value / skill.max) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Rank */}
      <div className="bg-[#2c2f54] p-4 rounded-lg flex flex-col items-center justify-center">
        <p className="text-sm">Your child Rank</p>
        <div className="mt-2 w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center text-3xl font-bold">
          3
        </div>
      </div>

      {/* Attendance */}
      <div className="bg-[#2c2f54] p-4 rounded-lg col-span-2">
        <h2 className="text-lg font-semibold mb-4">Attendance</h2>
        <Line data={lineData} options={lineOptions} />
      </div>

      {/* Student of the Year */}
      <div className="bg-[#2c2f54] p-4 rounded-lg col-span-2">
        <h2 className="text-lg font-semibold mb-4">Student Of The Year</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-300">
              <th>Contestant Name</th>
              <th>Contest Point</th>
              <th>Contest Rating</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr
                key={i}
                className={`border-b border-gray-700 ${s.highlight ? "bg-teal-600" : ""
                  }`}
              >
                <td className="flex items-center gap-2 py-2">
                  <img
                    src={`https://i.pravatar.cc/30?img=${i + 1}`}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  {s.name}
                </td>
                <td>{s.points}</td>
                <td className="flex gap-1">
                  {Array.from({ length: s.rating }).map((_, idx) => (
                    <Star key={idx} size={14} fill="gold" color="gold" />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
