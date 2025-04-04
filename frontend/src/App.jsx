import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
// import AdminDashboard from './pages/admin/AdminDashboard.jsx';
// import ChangePasswordPage from "./pages/ChangePassword.jsx";
// import ManageUsers from "./pages/admin/ManageUsers.jsx"
// import CreateNotifications from "./pages/admin/CreateNotifications.jsx"
// import ActivityLog from "./pages/admin/ActivityLogs.jsx"
// import AssignDuties from "./pages/admin/AssignDuties.jsx"
// import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
// import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import AdminDashboard from "./pages/tdashboard/AdminDashboard.jsx";
import StaffDashboard from "./pages/tdashboard/StaffDashboard.jsx";
import DoctorDashboard from "./pages/tdashboard/DoctorDashboard.jsx";
import Dashboard from "./pages/tdashboard/Dashboard.jsx";
import ChangePassword from "./pages/tdashboard/ChangePassword.jsx";
import ManageUsers from "./pages/tdashboard/ManageUsers.jsx";
import Notifications from "./pages/tdashboard/Notifications.jsx";
import ActivityLogs from "./pages/tdashboard/ActivityLogs.jsx";
import AssignDuties from "./pages/tdashboard/AssignDuties.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Home />} />
        
        <Route path="/admin" element={<AdminDashboard/>} >
          <Route index element={<Navigate to='dashboard'/>} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="manage-users" element={<ManageUsers/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="activity-logs" element={<ActivityLogs/>} />
          <Route path="assign-duties" element={<AssignDuties/>} />
        
        </Route>
        <Route path="/doctor" element={<DoctorDashboard/>} >
          <Route index element={<Navigate to='dashboard'/>} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="patient-records" element={<p>recor</p>} />
          <Route path="prescriptions" element={<p>pres</p>} />
          <Route path="duty-schedule" element={<p>duty</p>} />
          <Route path="medicine-stock" element={<p>stock</p>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>
        <Route path="/staff" element={<StaffDashboard/>} >
          <Route index element={<Navigate to='dashboard'/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="patient-records" element={<p>recor</p>} />
          <Route path="medicine-inventory" element={<p>inven</p>} />
          <Route path="prescriptions" element={<p>pres</p>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>

        {/* <Route path="/admin/dashboard"  element={<AdminDashboard/>}/>
        <Route path="/admin/change-password" element={<ChangePasswordPage/>}/>
        <Route path="/admin/manage-users" element={<ManageUsers/>}/>
        <Route path="/admin/notifications" element={<CreateNotifications/>}/>
        <Route path="/admin/logs" element={<ActivityLog/>}/>
        <Route path="/admin/assign-duties" element={<AssignDuties/>}/>
        <Route path="/doctor/dashboard" element={<DoctorDashboard/>}/>
        <Route path="/staff/dashboard" element={<StaffDashboard/>}/> */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
