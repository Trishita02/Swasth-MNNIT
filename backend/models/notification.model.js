import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  recipients: {
    type: [String],
    enum: ["all", "admin", "doctor", "staff"],
    required: true,
  },
  readBy: {
    type: {
      doctor: [mongoose.Schema.Types.ObjectId],
      staff: [mongoose.Schema.Types.ObjectId]
    },
    default: () => ({ doctors: [], staff: [] }) // Initialize with empty arrays
  },
},{ timestamps: true });

const Notification =  mongoose.model("Notification", notificationSchema);
export default Notification;