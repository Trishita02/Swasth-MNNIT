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


// Email APIs
export const sendDutyChartNowAPI = async () => {
  const toastId = toast.loading("Sending duty chart...");
  try {
    const res = await API.post("/admin/send-dutyChart-now");
    if (res.data.success === false && res.data.message === "No duties scheduled for today.") {
      toast.error(res.data.message); 
    } else {
      toast.success("Duty chart sent successfully");  // Success message
    }
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to send duty chart";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const scheduleDutyChartAPI = async (enabled, time) => {
  const toastId = toast.loading("Updating email schedule...");
  try {
    const res = await API.post("/admin/schedule-email", { enabled, time });
    toast.success(res.data.message || "Email schedule updated successfully");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update email schedule";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};


// Get All Duties
export const getAllDutiesAPI = async () => {
  try {
    const res = await API.get("/admin/assign-duties");
    return res.data.data; // Assuming your backend returns data in {data: [...]} format
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch duties";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

// Create New Duty
export const createDutyAPI = async (dutyData) => {
  const toastId = toast.loading("Creating duty...");
  try {
    const res = await API.post("/admin/assign-duties", dutyData);
    toast.success("Duty created successfully");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to create duty";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

// Delete Duty
export const deleteDutyAPI = async (dutyId) => {
  const toastId = toast.loading("Deleting duty...");
  try {
    const res = await API.delete(`/admin/assign-duties/${dutyId}`);
    toast.success("Duty deleted successfully");
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete duty";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};


export const getDoctorsFromSpecializationAPI = async (specialization = null) => {
  try {
    const params = {};
    if (specialization) params.specialization = specialization;
    const res = await API.get("/admin/getAllDoctors", { params });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAllStaffAPI = async () => {
  try {
    const res = await API.get("/admin/getAllStaffs");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const printPrescriptionAPI = async (id) => {
  try {
    const url = `http://localhost:8080/doctor/print-prescription/${id}`;
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      iframe.contentWindow.print();
      // Remove the iframe after some time
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  } catch (error) {
    console.error("Error printing prescription:", error);
    throw error;
  }
};

export const getDoctorNotificationsAPI = async () => {
  try {
    const res = await API.get("/doctor/notifications");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const markDoctorNotificationAsReadAPI = async (notificationId) => {
  try {
    const res = await API.patch(`/doctor/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markAllDoctorNotificationsAsReadAPI = async () => {
  try {
    const res = await API.patch("/doctor/notifications/mark-all-read");
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Staff Notification APIs
export const getStaffNotificationsAPI = async () => {
  try {
    const res = await API.get("/staff/notifications");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const markStaffNotificationAsReadAPI = async (notificationId) => {
  try {
    const res = await API.patch(`/staff/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markAllStaffNotificationsAsReadAPI = async () => {
  try {
    const res = await API.patch("/staff/notifications/mark-all-read");
    return res.data;
  } catch (error) {
    throw error;
  }
};


// home page email varification api
export const sendCode = async (email) =>{
  const toastId = toast.loading("Sending code..");
  try {
    const res = await API.post("/home/sendCode",{email});
    
    if (res.data.success) {
      toast.success("Verification code sent successfully.");
    } else {
      toast.error(res.data.message || "Something went wrong");
    }

    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to send email";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
}

export const verifyCode = async (email, code) => {
  const toastId = toast.loading("Verifying code...");
  try {
    const res = await API.post("/home/verifyCode", { email, code });

    toast.success(res.data.message || "Email verified successfully");
    return res.data; // will include `message` and `list` of todayDoctors
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Failed to verify code";
    toast.error(errorMessage);
    throw new Error(errorMessage);
  } finally {
    toast.dismiss(toastId);
  }
};

export const getUser=async()=>{
  try{
    const res=API.get("/home/user");
    return res;
  }catch(error){
    throw error.response?.data || "error fetching user details";
  }
}