

import { Outlet } from "react-router-dom";
import { useState } from "react";
import CommonSidebar from "../components/shared/CommonSidebar";
import CommonHeader from "../components/shared/CommonHeader";
import { useAppSelector } from "../hooks/app.hooks";


const CommonLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = useAppSelector((state) => state.auth.role);

  let sidebarBg = "";
  let mainBg = "";

  if (role === "STUDENT") {
    sidebarBg = "#2c1c5b"; 
    mainBg = "bg-purple-500/70";
  } else if (role === "PARENT") {
    sidebarBg = "#090625";
    mainBg = "bg-[#353D61]";
  } else if (role === "TEACHER") {
    sidebarBg = "#353D61";
    mainBg = "bg-[#090625]";
  }

   return (
    <div className={`student-layout flex min-h-screen ${mainBg} relative`}>
      <CommonSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        bgColor={sidebarBg}
      />
      <div className="flex-1 flex flex-col lg:ml-64">
        <CommonHeader
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CommonLayout;
