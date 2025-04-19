import Sidebar from "../../components/layout/Sidebar"
import MainContent from "../../components/layout/MainContent"
import Header from "../../components/layout/Header"
import { Bell, Calendar, Home, Package, Settings, Users } from "lucide-react";
import { Outlet } from "react-router-dom";

function DoctorDashboard(){

    const sideMenu = [
        { title: "Dashboard", href: `dashboard`, icon: <Home className="h-5 w-5" /> },
        { title: "Change Password", href: `change-password`, icon: <Settings className="h-5 w-5" /> },
        { title: "Patient Records", href: "patient-records", icon: <Users className="h-5 w-5" /> },
        { title: "Prescriptions", href: "prescriptions", icon: <Package className="h-5 w-5" /> },
        { title: "Duty Schedule", href: "duty-schedule", icon: <Calendar className="h-5 w-5" /> },
        { title: "Medicine Stock", href: "medicine-stock", icon: <Package className="h-5 w-5" /> },
        { title: "Notifications", href: "notifications", icon: <Bell className="h-5 w-5" /> },
    ]



    return(
        <>
        <div className="flex min-h-screen flex-col bg-gray-50">
        <Header sideMenu={sideMenu} showBell={true}/>

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

export default DoctorDashboard