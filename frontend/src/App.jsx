import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from './pages/admin/adminDashboard.jsx';
import ChangePasswordPage from "./pages/ChangePassword.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx"
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Home />} />
        <Route path="/admin/dashboard"  element={<Admin/>}/>
        <Route path="/admin/change-password" element={<ChangePasswordPage/>}/>
        <Route path="/admin/manage-users" element={<ManageUsers/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
