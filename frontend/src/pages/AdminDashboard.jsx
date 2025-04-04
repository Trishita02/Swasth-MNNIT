import  Sidebar  from "../components/dashboard/Sidebar";
import  Header  from "../components/dashboard/Header";
import  MainContent  from "../components/dashboard/MainContent";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Bell, Calendar, Home, LogOut, Menu, Package, Settings, Users } from "lucide-react"

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidemenu =[
    {
      title: "Dashboard",
      href: `dashboard`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Manage Users",
      href: "users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Activity Logs",
      href: "logs",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Schedule",
      href: "schedule",
      icon: <Calendar className="h-5 w-5" />,
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
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-row">
        {/* Sidebar */}
      <Sidebar onLogout={handleLogout} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} sidemenu={sidemenu}/>

        {/* Main Content */}
        <MainContent>
          <Outlet />
        </MainContent>
      </div>
    </div>
  );
};

export default AdminDashboard;
