import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Users, Star } from 'lucide-react';

const TeacherDashboard = () => {

  const attendanceData = [
    { name: 'Jan', value: 85 },
    { name: 'Feb', value: 92 },
    { name: 'Mar', value: 78 },
    { name: 'Apr', value: 88 },
    { name: 'May', value: 95 },
    { name: 'Jun', value: 90 },
    { name: 'Jul', value: 82 },
    { name: 'Aug', value: 91 },
    { name: 'Sep', value: 86 },
    { name: 'Oct', value: 89 },
    { name: 'Nov', value: 94 },
    { name: 'Dec', value: 87 }
  ];

  const performanceData = [
    { class: '5 A', passed: 900, failed: 100, colorPass: '#22C55E', colorFail: '#EF4444' },
    { class: '5 B', passed: 750, failed: 250, colorPass: '#22C55E', colorFail: '#EF4444' },
    { class: '6 A', passed: 880, failed: 120, colorPass: '#22C55E', colorFail: '#EF4444' },
    { class: '7 A', passed: 760, failed: 240, colorPass: '#22C55E', colorFail: '#EF4444' },
    { class: '7 B', passed: 600, failed: 400, colorPass: '#22C55E', colorFail: '#EF4444' },
  ];

  const recentActivities = [
    { title: "New assignment submitted by John Doe", time: "3 hours ago" },
    { title: "Grade updated for Sarah Smith", time: "6 hours ago" },
    { title: "New message from parent - Mike Johnson", time: "9 hours ago" }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* Attendance */}
        <div className="col-span-4 bg-white/10 rounded-2xl p-4 text-white">
          <h3 className="text-lg font-semibold mb-4">Attendance</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 12 }} axisLine={false} tickLine={false}/>
                <YAxis hide />
                <Line type="monotone" dataKey="value" stroke="#FBBF24" strokeWidth={2} dot={{ fill: '#FBBF24' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Performance */}
        <div className="col-span-6 bg-white/10 rounded-2xl p-4 text-white">
          <h3 className="text-lg font-semibold mb-4">Students Performance</h3>
          <div className="space-y-4">
            {performanceData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm text-white/80 mb-1">
                  <span>{item.class}</span>
                  <span>{item.passed + item.failed}</span>
                </div>
                <div className="flex h-3 w-full rounded-full overflow-hidden">
                  <div style={{ width: `${(item.passed / (item.passed + item.failed)) * 100}%`, backgroundColor: item.colorPass }} />
                  <div style={{ width: `${(item.failed / (item.passed + item.failed)) * 100}%`, backgroundColor: item.colorFail }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Month & Rating */}
        <div className="col-span-2 flex flex-col items-center justify-between bg-white/10 rounded-2xl p-4 text-white">
          <div className="bg-yellow-400 px-4 py-1 rounded-full text-black font-semibold">JUNE WEEK 1</div>
          <div className="flex mt-6 space-x-1">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-6 h-6 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">200</div>
            <div className="text-sm">Total Students</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">200</div>
            <div className="text-sm">Total Students</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">200</div>
            <div className="text-sm">Total Students</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center text-white">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">200</div>
            <div className="text-sm">Total Students</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-8 bg-white/10 rounded-2xl p-4 text-white">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex justify-between border-b border-white/20 pb-2 last:border-b-0">
                <span className="text-sm">{activity.title}</span>
                <span className="text-xs text-white/60">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
