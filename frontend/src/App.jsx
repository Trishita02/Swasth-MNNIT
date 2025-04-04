import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import ChangePasswordPage from "./pages/ChangePassword.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx"
import CreateNotifications from "./pages/admin/CreateNotifications.jsx"
import ActivityLog from "./pages/admin/ActivityLogs.jsx"
import AssignDuties from "./pages/admin/AssignDuties.jsx"
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Home />} />
        <Route path="/admin/dashboard"  element={<AdminDashboard/>}/>
        <Route path="/admin/change-password" element={<ChangePasswordPage/>}/>
        <Route path="/admin/manage-users" element={<ManageUsers/>}/>
        <Route path="/admin/notifications" element={<CreateNotifications/>}/>
        <Route path="/admin/logs" element={<ActivityLog/>}/>
        <Route path="/admin/assign-duties" element={<AssignDuties/>}/>
        <Route path="/doctor/dashboard" element={<DoctorDashboard/>}/>
        <Route path="/staff/dashboard" element={<StaffDashboard/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
