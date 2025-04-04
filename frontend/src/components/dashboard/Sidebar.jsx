import { X, Home, Settings, Users, LogOut } from "lucide-react";
import { Link,useNavigate,NavLink } from "react-router-dom";

const Sidebar = ({ onLogout, isSidebarOpen, toggleSidebar,sidemenu }) => {
  // console.log("sidemenu: ",sidemenu)

  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear auth state/cookies here
    navigate("/")
  }


  return (
    <div
      className={`bg-gray-800 text-white w-64 p-4 h-full transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "block" : "hidden sm:block"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        {/* <h2 className="text-lg font-semibold">Menu</h2> */}

        <button onClick={toggleSidebar} className="sm:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="grid gap-1">
                {sidemenu.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.href}
                    // onClick={() => setOpen(false)}
                    className={({isActive})=>`
                      " flex items-center gap-2 rounded-lg px-3 py-2 text-white text-lg transition-all hover:text-gray-400 ",
                      ${isActive ? "bg-gray-600 text-gray-900" : ""},
                    `}
                  >
                    {item.icon}
                    {item.title}
                  </NavLink>
                ))}
                <button
                  variant="ghost"
                  className="flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2 text-white transition-all hover:text-gray-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>


    </div>
  );
};

export default Sidebar;
