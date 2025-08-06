
import StudentSidebar from "../student/components/StudentSidebar"; 
import StudentHeader from "../student/components/StudentHeader"; 
// import ScrollingUpdates from "../student/components/ScrollingUpdates"; 

import { Outlet } from "react-router-dom";
import { useState } from "react";


const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle state

  return (
    <div className="student-layout flex min-h-screen bg-purple-500/70 relative">

      <StudentSidebar  isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64">
      
        <StudentHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4  ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;