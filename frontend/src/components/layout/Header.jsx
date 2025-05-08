import { useState,useRef,useEffect } from "react";
import { NavLink,Link, useNavigate } from "react-router-dom";
import { User, Menu,Bell} from "lucide-react";
import { Button } from "../Button.jsx";
import { Sheet, SheetContent, SheetTrigger } from "../Sheet.jsx";
import { logoutAPI } from "../../utils/api.jsx";
import { LogOut} from "lucide-react";
import { getUser } from "../../utils/api.jsx";
import { getStaffNotificationsAPI,getDoctorNotificationsAPI } from "../../utils/api.jsx";

function Header({sideMenu,showBell}){
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    const menuRef = useRef(null);
      // Close dropdown on outside click
      useEffect(() => {
        function handleClickOutside(e) {
          if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpenProfile(false);
          }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

      // handling logout
      const handleLogout = async () => {
        try {
          setIsLoading(true);
          await logoutAPI(); 
          setTimeout(() => {
            setIsLoading(false); 
            navigate("/"); 
          }, 2000); 
        } catch (error) {
          console.error("Logout Failed:", error);
        }
      };

      const [notifications, setNotifications] = useState([]);
      useEffect(() => {
        const fetchUserAndNotifications = async () => {
          try {
            const res = await getUser();
            setUser(res.data);
      
            const data = (res.data.role === "staff")
              ? await getStaffNotificationsAPI()
              : await getDoctorNotificationsAPI();
      
            setNotifications(data);
          } catch (error) {
            console.error("Error fetching user or notifications:", error);
          }
        };
      
        fetchUserAndNotifications();
      }, []);
      
      const unreadCount = notifications.filter((notification) => !notification.read).length;
      
    return(
        <>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        {/* Left Side: Sidebar Toggle (Mobile), Logo & Title */}
        <div className="flex items-center gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link to="#" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
                <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
                  <img src="/logo.jpg" alt="Swasth MNNIT Logo" className="h-full w-full object-cover" />
                </div>
                <span>Swasth MNNIT</span>
                </Link>
                <div className="grid gap-1">
                  {sideMenu.map((item, index) => (
                    <NavLink
                      key={index}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({isActive})=>`
                        " flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ",
                        ${isActive ? " bg-gray-100 text-gray-900 " : "" }
                      `}
                    >
                      {item.icon}
                      {item.title}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo & Title */}
          <div className="flex items-center gap-2">
          <div className="flex h-15 w-15 items-center justify-center rounded-full overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="Swasth MNNIT Logo"
            className="h-full w-full object-cover" 
         />
          </div>
            <span className="text-lg font-semibold text-gray-900">Swasth MNNIT</span>
          </div>
        </div>

        {/* Right Side: profile Button */}
        <div className="flex justify-center items-center gap-6">
          {/* notification show bell */}
          {showBell && (
        <div className="relative inline-block">
          <Bell className="w-8 h-7 text-gray-700 hover:text-gray-400"  onClick={() => navigate(`/${user?.role}/notifications`)}  />
         {unreadCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-700 text-white text-xs font-semibold px-1.5 flex items-center justify-center rounded-full shadow-md">
            {unreadCount}
          </span>
          )}
        </div>
          )}
        {/* user profile */}
        <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <button
        onClick={() => setOpenProfile(!openProfile)}
        className="p-2 border rounded-full bg-gray-100 inline-flex items-center justify-center hover:bg-gray-200 transition"
      >
        <User size={28} className="text-gray-700" />
      </button>

      {/* Dropdown card */}
      {openProfile && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border z-50">
          <div className="p-4 border-b">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>

          </div>
          <div className="p-2 space-y-1">
            {/* <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              specilization
            </button> */}
            {/* <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md">
              working time
            </button> */}
            <button className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-md"
            disabled={isLoading}
             onClick={handleLogout}
            >
              {isLoading ? (
                  <span className="animate-pulse">Logging out...</span>
                ) : (
                  <>
                    Logout
                  </>
                )}
            </button>
          </div>
        </div>
      )}
    </div>

        </div>
      </header>
        </>
    )
}

export default Header;