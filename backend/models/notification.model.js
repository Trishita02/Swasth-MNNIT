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
  readStatus: {
    doctor: {
      type: Boolean,
      default: false
    },
    staff: {
      type: Boolean,
      default: false
    }
  },
},{ timestamps: true });

const Notification =  mongoose.model("Notification", notificationSchema);
export default Notification;