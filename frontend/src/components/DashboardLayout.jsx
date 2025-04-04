import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Calendar, Home, LogOut, Menu, Package, Settings, Users } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Sheet, SheetContent, SheetTrigger } from "../components/Sheet.jsx";
import classNames from "classnames";

export default function DashboardLayout({ children, role }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = () => {
    const baseItems = [
      { title: "Dashboard", href: `/${role}/dashboard`, icon: <Home className="h-5 w-5" /> },
      { title: "Change Password", href: `/${role}/change-password`, icon: <Settings className="h-5 w-5" /> },
    ];

    if (role === "admin") {
      return [
        ...baseItems,
        { title: "Manage Users", href: "/admin/manage-users", icon: <Users className="h-5 w-5" /> },
        { title: "Notifications", href: "/admin/notifications", icon: <Bell className="h-5 w-5" /> },
        { title: "Activity Logs", href: "/admin/logs", icon: <Package className="h-5 w-5" /> },
        { title: "Assign Duties", href: "/admin/assign-duties", icon: <Calendar className="h-5 w-5" /> },
      ];
    }

    if (role === "doctor") {
      return [
        ...baseItems,
        { title: "Patient Records", href: "/doctor/patients", icon: <Users className="h-5 w-5" /> },
        { title: "Prescriptions", href: "/doctor/prescriptions", icon: <Package className="h-5 w-5" /> },
        { title: "Duty Schedule", href: "/doctor/schedule", icon: <Calendar className="h-5 w-5" /> },
        { title: "Medicine Stock", href: "/doctor/medicines", icon: <Package className="h-5 w-5" /> },
        { title: "Notifications", href: "/doctor/notifications", icon: <Bell className="h-5 w-5" /> },
      ];
    }

    if (role === "staff") {
      return [
        ...baseItems,
        { title: "Patient Records", href: "/staff/patients", icon: <Users className="h-5 w-5" /> },
        { title: "Medicine Inventory", href: "/staff/medicines", icon: <Package className="h-5 w-5" /> },
        { title: "Prescriptions", href: "/staff/prescriptions", icon: <Package className="h-5 w-5" /> },
        { title: "Notifications", href: "/staff/notifications", icon: <Bell className="h-5 w-5" /> },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
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
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={classNames(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                        location.pathname === item.href ? "bg-gray-100 text-gray-900" : ""
                      )}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
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
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </header>

      {/* Sidebar for Desktop */}
      <div className="grid flex-1 md:grid-cols-[240px_1fr]">
        <aside className="hidden border-r bg-white md:block">
          <nav className="grid gap-2 p-4 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={classNames(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                  location.pathname === item.href ? "bg-gray-100 text-gray-900" : ""
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
