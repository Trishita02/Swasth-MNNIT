import API from "./axios.jsx";
import toast from "react-hot-toast";
// Login API
export const loginAPI = async (email, password) => {
    const toastId=toast.loading("loading...")
    try {
      const response = await API.post("/login", { username, password});
      toast.success("Logged in Successfully");
      return response.data;
    } catch (error) {
      throw error.response?.data || "Login failed!";
    }finally{
      toast.dismiss(toastId);
    }
  };
  
  // Logout API
  export const logoutAPI = async () => {
    try {
      await API.post("/logout");
    } catch (error) {
      throw error.response?.data || "Logout failed!";
    }
  };