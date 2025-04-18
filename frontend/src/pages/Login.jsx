import LoginForm from "../components/LoginForm.jsx";
import { X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white"
      style={{
        backgroundImage: "url('/background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-md px-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
      <X className="w-5 h-5 float-right hover:bg-gray-300 rounded-2xl" onClick={()=>navigate("/")}/>
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 overflow-hidden">
          <img 
            src="/logo.jpg" 
            alt="Swasth MNNIT Logo"
            className="h-full w-full object-cover" 
         />
          </div>
          <h1 className="text-center text-3xl font-bold text-blue-700">Swasth MNNIT</h1>
          <p className="mt-2 text-center text-gray-600">Healthcare Management System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;