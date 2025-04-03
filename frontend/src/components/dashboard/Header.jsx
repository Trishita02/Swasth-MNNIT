import { Menu, LogOut,User } from "lucide-react";

const Header = ({ toggleSidebar, role }) => (
  
  <header className="bg-white p-4 shadow-md flex justify-between items-center">
    <button onClick={toggleSidebar} className="sm:hidden">
      <Menu className="h-6 w-6" />
    </button>
    <h1 className="text-xl font-bold">{role}</h1>
    {/* <button className="hidden sm:flex items-center space-x-2 p-2 border border-gray-300 rounded-md hover:bg-gray-100">
      <LogOut />
      <span>Logout</span>
      <User />
    </button> */}
  </header>
);

export default Header;