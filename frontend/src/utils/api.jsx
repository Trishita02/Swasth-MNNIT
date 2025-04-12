import API from "./axios.jsx";
import toast from "react-hot-toast";
// Login API
export const loginAPI = async (username, password) => {
    const toastId=toast.loading("loading...")
    try {
      const response = await API.post("/login", { username, password});
      localStorage.setItem("token", response.data.data.accessToken);
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
      const token = localStorage.getItem("token");
      await API.post("/logout",{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
    } catch (error) {
      throw error.response?.data || "Logout failed!";
    }
  };
  


// Add User API
export const addUserAPI = async (userData) => {
  const toastId = toast.loading("Adding user...");
  
  try {
    // Fixed URL by removing double slash
    const res = await API.post("/admin/manage-users", userData);
    
    // More robust success handling
    if (res.data && res.data.success) {
      toast.success(res.data.message || "User added successfully");
      return res.data;
    } else {
      throw new Error(res.data?.message || "User addition failed");
    }
  } catch (error) {
    // More specific error handling
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Failed to add user";
    
    // Only show toast if not already shown by interceptor
    if (!error.response || error.response.status !== 401) {
      toast.error(errorMessage);
    }
    
    // Re-throw for component-level handling
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

// Get All Users API
export const getAllUsersAPI = async () => {
  try {
    const res = await API.get("/admin/manage-users");  // Backend API to fetch users
    return res.data;  
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch users";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};


// Delete User API
export const deleteUserAPI = async (role, id) => {
  const toastId = toast.loading("Deleting user...");

  try {
    const res = await API.delete(`/admin/manage-users/${role}/${id}`);

    if (res.data && res.data.success) {
      toast.success(res.data.message || "User deleted successfully");
      return res.data;
    } else {
      throw new Error(res.data?.message || "User deletion failed");
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Failed to delete user";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

// Update User API
export const updateUserAPI = async (role, id, userData) => {
  const toastId = toast.loading("Updating user...");

  try {
    const res = await API.put(`/admin/manage-users/${role}/${id}`, userData);

    if (res.data && res.data.success) {
      toast.success(res.data.message || "User updated successfully");
      return res.data;
    } else {
      throw new Error(res.data?.message || "User update failed");
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to update user";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};


// Change Password API
export const changePasswordAPI = async (role,oldPassword, newPassword, confirmNewPassword) => {
  const toastId = toast.loading("Changing password...");
  try {
    const res = await API.put(`/${role}/change-password`, {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    if (res.data && res.data.success) {
      toast.success(res.data.message || "Password changed successfully");
      return res.data;
    } else {
      throw new Error(res.data?.message || "Password change failed");
    }
  } catch (error) {
    console.log(error.response.data)
      const errorMessage =
        error?.response?.data?.message || "Failed to change password";
        
      toast.error(errorMessage);   
      throw new Error(errorMessage);
    } finally {
    toast.dismiss(toastId);
  }
};


// Notification APIs
export const createNotificationAPI = async (notificationData) => {
  const toastId = toast.loading("Creating notification...");
  try {
    const res = await API.post("/admin/create-notifications", notificationData);
    toast.success("Notification created successfully");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create notification";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const getAllNotificationsAPI = async () => {
  try {
    const res = await API.get("/admin/create-notifications");
    return res.data.data; 
  } catch (error) {
    console.log(error)
    const errorMessage = error.response?.data?.message || "Failed to fetch notifications";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deleteNotificationAPI = async (id) => {
  const toastId = toast.loading("Deleting notification...");
  try {
    const res = await API.delete(`/admin/create-notifications/${id}`);
    toast.success("Notification deleted successfully");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete notification";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const fetchActivityLogsAPI = async () => {
  try {
    const response = await API.get("/admin/activity-logs"); 
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    throw error;
  }
};

export const getDashboardDetailsAPI=async()=>{
  try{
    const response=await API.get("/admin/dashboard")
    return response.data;
  }catch(error){
    console.error("Error fetching activity logs:", error);
    throw error;
  }
}