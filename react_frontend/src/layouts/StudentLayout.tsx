
import StudentSidebar from "../student/components/StudentSidebar"; 
import StudentHeader from "../student/components/StudentHeader"; 
// import ScrollingUpdates from "../student/components/ScrollingUpdates"; 

import { Outlet } from "react-router-dom";
import { useState } from "react";


const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle state

  return (
    <div className="student-layout flex min-h-screen bg-purple-100 relative">
      {/* Sidebar */}
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header with menu toggle */}
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Updates bar */}
        {/* <ScrollingUpdates /> */}

        {/* Page content */}
        <main className="p-4 bg-gradient-to-r from-purple-950 to-purple-700 min-h-[100%] ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;