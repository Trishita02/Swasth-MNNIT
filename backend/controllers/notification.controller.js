import Notification from "../models/notification.model.js";

export const createNotification = async (req, res) => {
    try {
      const { title, message, recipients } = req.body;
  
      if (!title || !message || !recipients) {
        return res.status(400).json({ message: "All fields are required" });
      }
      let finalRecipients = [];
        if (recipients === "all") {
            finalRecipients = ["staff", "doctor"];
        } else {
            finalRecipients = [recipients];  // single selected role
        }
      await Notification.create({
        title,
        message,
        recipients: finalRecipients, // since single selection dropdown
      });
  
      res.status(201).json({ message: "Notification created successfully" });
  
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  
export const getAllNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find()
        .sort({ createdAt: -1 }) // latest first
        .select("title message recipients createdAt"); // selecting required fields only
  
      const formattedNotifications = notifications.map((notification) => ({
        id:notification._id,
        title: notification.title,
        message: notification.message,
        recipients: notification.recipients,
        date: notification.createdAt.toLocaleDateString(),  // Date Only
        time: notification.createdAt.toLocaleTimeString(),  // Time Only
      }));
      res.status(200).json({
        success: true,
        data: formattedNotifications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications",
      });
    }
  };


export const deleteNotification = async (req, res) => {
    try {
      const { id } = req.params;
  
      const notification = await Notification.findById(id);
  
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      await Notification.findByIdAndDelete(id);
  
      return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };

// Doctor-specific controllers
export const getDoctorNotifications = async (req, res) => {
  await getRoleNotifications(req, res, 'doctor');
};

export const markDoctorNotificationAsRead = async (req, res) => {
  await markNotificationAsRead(req, res, 'doctor');
};

export const markAllDoctorNotificationsAsRead = async (req, res) => {
  await markAllNotificationsAsRead(req, res, 'doctor');
};

// Staff-specific controllers
export const getStaffNotifications = async (req, res) => {
  await getRoleNotifications(req, res, 'staff');
};

export const markStaffNotificationAsRead = async (req, res) => {
  await markNotificationAsRead(req, res, 'staff');
};

export const markAllStaffNotificationsAsRead = async (req, res) => {
  await markAllNotificationsAsRead(req, res, 'staff');
};

// Shared implementation functions
const getRoleNotifications = async (req, res, role) => {
  try {
    const userId = req.user._id; 
    
    const notifications = await Notification.find({
      recipients: { $in: [role, 'all'] }
    })
    .sort({ createdAt: -1 })
    .lean();

    const formattedNotifications = notifications.map((notification) => {
      // Handle cases where readBy might not be properly initialized
      const readArray = notification.readBy?.[role] || [];
      const isRead = readArray.some(id => id.equals(userId));
      
      return {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        date: notification.createdAt.toLocaleDateString(),
        time: notification.createdAt.toLocaleTimeString(),
        read: isRead,
        recipients: notification.recipients
      };
    });

    res.status(200).json({
      success: true,
      data: formattedNotifications,
    });
  } catch (error) {
    console.error(`Error fetching ${role} notifications:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${role} notifications`,
    });
  }
};

const markNotificationAsRead = async (req, res, role) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // First check if the notification exists and is for this role
    const notification = await Notification.findOne({
      _id: id,
      recipients: { $in: [role, 'all'] }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or not accessible'
      });
    }

    // Update using proper dot notation
    const updateField = `readBy.${role}`;
    
    await Notification.findByIdAndUpdate(
      id,
      { 
        $addToSet: { 
          [updateField]: userId 
        } 
      },
      { new: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: `Failed to mark ${role} notification as read`,
    });
  }
};

const markAllNotificationsAsRead = async (req, res, role) => {
  try {
    const userId = req.user._id;
    
    // Find all unread notifications for this role
    const unreadNotifications = await Notification.find({
      recipients: { $in: [role, 'all'] },
      [`readBy.${role}`]: { $nin: [userId] }
    });

    if (unreadNotifications.length === 0) {
      return res.status(200).json({ 
        success: true,
        message: 'All notifications are already marked as read'
      });
    }

    // Update all unread notifications
    const updateField = `readBy.${role}`;
    await Notification.updateMany(
      {
        _id: { $in: unreadNotifications.map(n => n._id) }
      },
      {
        $addToSet: { [updateField]: userId }
      }
    );

    res.status(200).json({ 
      success: true,
      message: `Marked ${unreadNotifications.length} notifications as read`
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: `Failed to mark all ${role} notifications as read`,
    });
  }
};


