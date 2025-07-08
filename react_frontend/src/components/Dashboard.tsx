

import { Users, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';


import StatCard from './ui/StatCard';
import PerformanceChart from './charts/PerformanceChart';
import ClassDistributionChart from './charts/ClassDistributionChart';
import AttendanceChart from './charts/AttendanceChart';
import RecentStudents from './sections/RecentStudents';
import UnpaidStudents from './sections/UnpaidStudents';
import NotificationsPanel from './sections/NotificationPanel';

const Dashboard = () => {


  const notifications = [
    { id: 1, type: 'warning', message: 'John Doe has 3 unpaid fees', time: '2 hours ago' },
    { id: 2, type: 'info', message: 'New student enrolled: Sarah Wilson', time: '4 hours ago' },
    { id: 3, type: 'alert', message: 'Class 10A attendance below 80%', time: '6 hours ago' },
    { id: 4, type: 'success', message: 'Monthly report generated', time: '1 day ago' }
  ];

  const recentStudents = [
    { id: 1, name: 'Emma Thompson', class: '10A', status: 'Active', joinDate: '2024-01-15', avatar: 'ET' },
    { id: 2, name: 'Michael Chen', class: '9B', status: 'Active', joinDate: '2024-01-12', avatar: 'MC' },
    { id: 3, name: 'Sofia Rodriguez', class: '11C', status: 'Active', joinDate: '2024-01-10', avatar: 'SR' },
    { id: 4, name: 'James Wilson', class: '8A', status: 'Inactive', joinDate: '2024-01-08', avatar: 'JW' },
    { id: 5, name: 'Lily Johnson', class: '12B', status: 'Active', joinDate: '2024-01-05', avatar: 'LJ' }
  ];

  const unpaidStudents = [
    { id: 1, name: 'John Doe', class: '10A', amount: '$450', dueDate: '2024-07-01', days: 3 },
    { id: 2, name: 'Alice Smith', class: '9B', amount: '$380', dueDate: '2024-06-28', days: 6 },
    { id: 3, name: 'Bob Johnson', class: '11C', amount: '$520', dueDate: '2024-06-25', days: 9 },
    { id: 4, name: 'Carol Brown', class: '8A', amount: '$300', dueDate: '2024-06-20', days: 14 }
  ];

  const performanceData = [
    { month: 'Jan', math: 85, science: 78, english: 92, history: 88 },
    { month: 'Feb', math: 88, science: 82, english: 89, history: 91 },
    { month: 'Mar', math: 92, science: 85, english: 94, history: 87 },
    { month: 'Apr', math: 89, science: 88, english: 91, history: 93 },
    { month: 'May', math: 94, science: 91, english: 96, history: 89 },
    { month: 'Jun', math: 96, science: 94, english: 98, history: 92 }
  ];

  const classDistribution = [
    { name: 'Grade 8', value: 120, color: '#8B5CF6' },
    { name: 'Grade 9', value: 135, color: '#06B6D4' },
    { name: 'Grade 10', value: 145, color: '#10B981' },
    { name: 'Grade 11', value: 128, color: '#F59E0B' },
    { name: 'Grade 12', value: 112, color: '#EF4444' }
  ];

  const attendanceData = [
    { day: 'Mon', present: 95, absent: 5 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 94, absent: 6 },
    { day: 'Fri', present: 89, absent: 11 },
    { day: 'Sat', present: 85, absent: 15 }
  ];

  const statsData = [
    { title: 'Total Students', value: '1,245', change: 12, icon: Users, color: 'blue' },
    { title: 'Total Teachers', value: '87', change: 5, icon: GraduationCap, color: 'green' },
    { title: 'Pending Fees', value: '$12,450', change: -8, icon: DollarSign, color: 'yellow' },
    { title: 'Avg Performance', value: '92%', change: 3, icon: TrendingUp, color: 'purple' }
  ];

    return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart data={performanceData} />
        <ClassDistributionChart data={classDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentStudents students={recentStudents} />
        <UnpaidStudents students={unpaidStudents} />
      </div>

      <AttendanceChart data={attendanceData} />
      <NotificationsPanel notifications={notifications} />
    </>
  );
};

export default Dashboard;
