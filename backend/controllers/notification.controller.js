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
    const notifications = await Notification.find({
      recipients: { $in: [role, 'all'] }
    })
    .sort({ createdAt: -1 })
    .lean();

    const formattedNotifications = notifications.map((notification) => ({
      id: notification._id,
      title: notification.title,
      message: notification.message,
      date: notification.createdAt.toLocaleDateString(),
      time: notification.createdAt.toLocaleTimeString(),
      read: notification.readStatus?.[role] || false,
      recipients: notification.recipients
    }));

    res.status(200).json({
      success: true,
      data: formattedNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to fetch ${role} notifications`,
    });
  }
};

const markNotificationAsRead = async (req, res, role) => {
  try {
    const { id } = req.params;
    
    await Notification.findByIdAndUpdate(
      id,
      { $set: { [`readStatus.${role}`]: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to mark ${role} notification as read`,
    });
  }
};

const markAllNotificationsAsRead = async (req, res, role) => {
  try {
    await Notification.updateMany(
      { recipients: { $in: [role, 'all'] } },
      { $set: { [`readStatus.${role}`]: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to mark all ${role} notifications as read`,
    });
  }
};