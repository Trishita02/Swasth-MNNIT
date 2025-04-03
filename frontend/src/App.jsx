import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<p>admin dashborad</p>} />
          <Route path="logs" element={<p>admin logs</p>} />
          <Route path="notifications" element={<p>admin notifications</p>} />
          <Route path="schedule" element={<p>admin schedule</p>} />
          <Route path="users" element={<p>admin user</p>} />
          <Route path="change-password" element={<p>admin change-password</p>} />
        
        </Route>
        <Route path="/doctor" element={<DoctorDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<p>doctor dashboard</p>} />
          <Route path="medicines" element={<p>doctor medicines</p>} />
          <Route path="patients" element={<p>doctor patients</p>} />
          <Route path="prescriptions" element={<p>doctor prescriptions</p>} />
          <Route path="schedule" element={<p>doctor schedule</p>} />
          <Route path="change-password" element={<p>doctor change-password</p>} />
          <Route path="notifications" element={<p>doctor notificatons</p>} />
        
        </Route>
        <Route path="/staff" element={<StaffDashboard />} >
          <Route index element={<Navigate to="dashboard"/>} />
          <Route path="dashboard" element={<p>staff dashborad</p>} />
          <Route path="medicines" element={<p>staff medicines</p>} />
          <Route path="patients" element={<p>staff patients</p>} />
          <Route path="prescriptions" element={<p>staff prescriptions</p>} />
          <Route path="change-password" element={<p>staff change-password</p>} />
          <Route path="notifications" element={<p>staff notifications</p>} />
        
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
