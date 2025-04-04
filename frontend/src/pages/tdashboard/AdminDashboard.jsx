import Sidebar from "../../components/tdashboard/dashboard/Sidebar"
import MainContent from "../../components/tdashboard/dashboard/MainContent"
import Header from "../../components/tdashboard/dashboard/Header"
import { Bell, Calendar, Home, Package, Settings, Users } from "lucide-react";
import { Outlet } from "react-router-dom";

function AdminDashboard(){

    const sideMenu = [
        { title: "Dashboard", href: `dashboard`, icon: <Home className="h-5 w-5" /> },
        { title: "Change Password", href: `change-password`, icon: <Settings className="h-5 w-5" /> },
        { title: "Manage Users", href: "manage-users", icon: <Users className="h-5 w-5" /> },
        { title: "Notifications", href: "notifications", icon: <Bell className="h-5 w-5" /> },
        { title: "Activity Logs", href: "activity-logs", icon: <Package className="h-5 w-5" /> },
        { title: "Assign Duties", href: "assign-duties", icon: <Calendar className="h-5 w-5" /> },
    ]



    return(
        <>
        <div className="flex min-h-screen flex-col bg-gray-50">
        <Header sideMenu={sideMenu}/>

        <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <Sidebar sideMenu={sideMenu}/>
        <MainContent >
            <Outlet />
        </MainContent>
        </div>

        </div>
        
        </>
    )
}

export default AdminDashboard