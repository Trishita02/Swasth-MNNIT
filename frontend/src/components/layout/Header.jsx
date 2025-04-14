import { useState } from "react";
import { NavLink,Link, useNavigate } from "react-router-dom";
import { LogOut, Menu,} from "lucide-react";
import { Button } from "../Button.jsx";
import { Sheet, SheetContent, SheetTrigger } from "../Sheet.jsx";
import { logoutAPI } from "../../utils/api.jsx";
function Header({sideMenu}){
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

        {/* Right Side: Logout Button */}
        <Button
  variant="ghost"
  disabled={isLoading}
  className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
  onClick={handleLogout}
>
  {isLoading ? (
    <span className="animate-pulse">Logging out...</span>
  ) : (
    <>
      <LogOut className="h-5 w-5" />
      Logout
    </>
  )}
</Button>
      </header>
        </>
    )
}

export default Header;