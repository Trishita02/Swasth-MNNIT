import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";
import Dashboard from "./components/comman/Dashboard.jsx";
import Notifications from "./components/comman/Notifications.jsx";
import ChangePassword from "./components/comman/ChangePassword.jsx";
import Patient from "./components/comman/Patient.jsx";
import Medicines from "./components/comman/Medicines.jsx";
import Prescriptions from "./components/comman/Prescriptions.jsx";
import Schedule from "./components/comman/Schedule.jsx";
import Logs from "./components/admin/Logs.jsx";
import Users from "./components/admin/Users.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="logs" element={<Logs/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="schedule" element={<Schedule/>} />
          <Route path="users" element={<Users/>} />
          <Route path="change-password" element={<ChangePassword/>} />
 
        </Route>
        <Route path="/doctor" element={<DoctorDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="medicines" element={<Medicines/>} />
          <Route path="patients" element={<Patient/>} />
          <Route path="prescriptions" element={<Prescriptions/>} />
          <Route path="schedule" element={<Schedule/>} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>
        <Route path="/staff" element={<StaffDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="medicines" element={<Medicines/>} />
          <Route path="patients" element={<Patient/>} />
          <Route path="prescriptions" element={<Prescriptions/>} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
