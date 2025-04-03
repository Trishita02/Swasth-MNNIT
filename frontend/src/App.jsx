import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Admin from './pages/admin/adminDashboard.jsx';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Home />} />
        <Route path="/admin/dashboard"  element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
