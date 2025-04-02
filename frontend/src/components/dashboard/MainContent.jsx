import { Outlet } from "react-router-dom";
const MainContent = () => {
    return (
      <>
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-semibold mb-6">Welcome to the Dashboard</h2>
        <p>This is your dashboard where you can manage different settings and users.</p>
      </div>
      <Outlet />
      </>
    );
  };
  
  export default MainContent;
  