

import { Outlet } from "react-router-dom";
import { useState } from "react";
import CommonSidebar from "../components/shared/CommonSidebar"; 
import CommonHeader from "../components/shared/CommonHeader";

const CommonLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="student-layout flex min-h-screen bg-purple-500/70 relative">
      <CommonSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <CommonHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommonLayout;
