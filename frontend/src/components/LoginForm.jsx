import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card.jsx";
import { Input } from "../components/Input.jsx";
import { Label } from "../components/Label.jsx";
import { loginAPI } from "../utils/api.jsx"; 
import { Eye, EyeOff } from "lucide-react"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate username format
      if (!username.includes(".")) {
        throw new Error("Username must be in format: name.role");
      }

      let role = username.match(/\.(st|dr)\d+$|\.admin$/)?.[1]|| (username.endsWith(".admin") ? "admin" : undefined);
      if (!["admin", "st", "dr"].includes(role)) {
        throw new Error("Role must be admin, staff, or doctor");
      }

      // Call login API
      await loginAPI(username, password);
      if(role=="st") role="staff"
      else if(role=="dr") role="doctor"
      // Show success toast
      toast.success(`Login successful! Redirecting to ${role} dashboard...`, {
        autoClose: 2000,
        onClose: () => navigate(`/${role}/dashboard`)
      });

      // Redirect based on role
      navigate(`/${role}`);
    } catch (error) {
      // Show error toast
      toast.error(error.message || "Invalid credentials", {
        autoClose: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="name.role (e.g., john.admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}