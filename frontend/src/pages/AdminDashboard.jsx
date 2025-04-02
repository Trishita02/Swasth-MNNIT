import  Sidebar  from "../components/dashboard/Sidebar";
import  Header  from "../components/dashboard/Header";
import  MainContent  from "../components/dashboard/MainContent";
import { useState } from "react";
import { Bell, Calendar, Home, LogOut, Menu, Package, Settings, Users } from "lucide-react"

const AdminDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const sidemenu =[
    {
      title: "Dashboard",
      href: `/admin/dashboard`,
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Manage Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Activity Logs",
      href: "/admin/logs",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Schedule",
      href: "/admin/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "Change Password",
      href: `/admin/change-password`,
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
        <Header toggleSidebar={toggleSidebar} role="Admin" />

        {/* Main Content */}
        <MainContent />
      </div>
    </div>
  );
};

export default AdminDashboard;
