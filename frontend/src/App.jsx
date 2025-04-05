import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";
import StaffDashboard from "./pages/dashboard/StaffDashboard.jsx";
import DoctorDashboard from "./pages/dashboard/DoctorDashboard.jsx";
import Dashboard from "./pages/common/Dashboard.jsx";
import ChangePassword from "./pages/common/ChangePassword.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import Notifications from "./pages/common/Notifications.jsx";
import ActivityLogs from "./pages/admin/ActivityLogs.jsx";
import AssignDuties from "./pages/admin/AssignDuties.jsx";
import Prescriptions from "./pages/staff/Prescriptions.jsx";
import PatientRecords from "./pages/staff/PatientRecords.jsx";
import MedicinesInventory from "./pages/staff/MedicineInventory.jsx";
import MedicineStock from "./pages/doctor/MedicineStock.jsx";
import DutySchedule from "./pages/doctor/DutySchedule.jsx";

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
          <Route path="patient-records" element={<PatientRecords/>} />
          <Route path="prescriptions" element={<Prescriptions/>} />
          <Route path="duty-schedule" element={<DutySchedule/>} />
          <Route path="medicine-stock" element={<MedicineStock/>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>
        <Route path="/staff" element={<StaffDashboard/>} >
          <Route index element={<Navigate to='dashboard'/>} />
          <Route path="dashboard" element={<Dashboard/>} />
          <Route path="change-password" element={<ChangePassword/>} />
          <Route path="patient-records" element={<PatientRecords/>} />
          <Route path="medicine-inventory" element={<MedicinesInventory/>} />
          <Route path="prescriptions" element={<Prescriptions/>} />
          <Route path="notifications" element={<Notifications/>} />
        
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
