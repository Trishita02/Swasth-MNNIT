import { BrowserRouter, Routes, Route,Navigate,Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import StaffLayout from "./pages/staff/StaffLayout.jsx";
import DoctorLayout from "./pages/doctor/DoctorLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ChangePassword from "./pages/common/ChangePassword.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import CreateNotifications from "./pages/admin/CreateNotifications.jsx";
import ActivityLogs from "./pages/admin/ActivityLogs.jsx";
import AssignDuties from "./pages/admin/AssignDuties.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions.jsx";
import StaffPatientRecords from "./pages/staff/StaffPatientRecords.jsx";
import MedicinesInventory from "./pages/staff/MedicineInventory.jsx";
import MedicineStock from "./pages/doctor/MedicineStock.jsx";
import DutySchedule from "./pages/doctor/DutySchedule.jsx";
import StaffDashboard from "./pages/staff/StaffDashboard.jsx";
import DoctorPatientRecords from "./pages/doctor/DoctorPatientRecords.jsx";
import StaffPrescriptions from "./pages/staff/StaffPrescriptions.jsx";
import DoctorNotification from "./pages/doctor/DoctorNotification.jsx";
import StaffNotification from "./pages/staff/StaffNotification.jsx";
import PatientHistory from "./pages/doctor/PatientHistory.jsx";
import AddPatient from "./pages/staff/AddPatient.jsx";

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  if(!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to='dashboard' />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="create-notifications" element={<CreateNotifications />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="assign-duties" element={<AssignDuties />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor" element={<DoctorLayout />}>
            <Route index element={<Navigate to='dashboard' />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="patient-records" element={<DoctorPatientRecords />} />
            <Route path="patient-records/history/:id" element={<PatientHistory />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="duty-schedule" element={<DutySchedule />} />
            <Route path="medicine-stock" element={<MedicineStock />} />
            <Route path="notifications" element={<DoctorNotification />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to='dashboard' />} />
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="patient-records" element={<StaffPatientRecords />} />
            <Route path="patient-records/history/:id" element={<PatientHistory />} />
            <Route path="medicine-inventory" element={<MedicinesInventory />} />
            <Route path="add-patient" element={<AddPatient />} />
            <Route path="duty-schedule" element={<DutySchedule />} />
            <Route path="notifications" element={<StaffNotification />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
