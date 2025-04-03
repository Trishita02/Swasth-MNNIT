import  Sidebar  from "../components/dashboard/Sidebar";
import  Header  from "../components/dashboard/Header";
import  MainContent  from "../components/dashboard/MainContent";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Bell, Calendar, Home, LogOut, Menu, Package, Settings, Users } from "lucide-react"

const DoctorDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidemenu = [
    {
      title: "Dashboard",
      href: `dashboard`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Patient Records",
      href: "patients",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Prescriptions",
      href: "prescriptions",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Duty Schedule",
      href: "schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Medicine Stock",
      href: "medicines",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Change Password",
      href: `change-password`,
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sidemenu={sidemenu}/>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} role="Doctor" />

        {/* Main Content */}
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default DoctorDashboard;
