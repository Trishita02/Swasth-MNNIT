import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/login" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
