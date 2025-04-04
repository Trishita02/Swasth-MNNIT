import { Menu, LogOut,User,Bell } from "lucide-react";
import logo from '/logo.jpg';

const Header = ({ toggleSidebar, }) => (

  <header className="bg-white p-4 shadow-md flex justify-between items-center">
    <button onClick={toggleSidebar} className="sm:hidden">
      <Menu className="h-6 w-6" />
    </button>
    <div className="flex items-center ">
    <img className="h-10 w-12 border rounded-2xl" src={logo} alt="" />
    <h1 className="text-xl font-bold ml-2">Swasth MNNIT</h1>
    </div>
    <div className="flex gap-2">
    <button className="hidden sm:flex items-center space-x-2 p-2 hover:text-gray-500">
      <Bell />
    </button>
    <button className="hidden sm:flex items-center space-x-2 p-2 border border-gray-300 rounded-2xl hover:bg-gray-100">
      {/* <LogOut />
      <span>Logout</span> */}
      <User />
    </button>
    </div>
  </header>
);

export default Header;