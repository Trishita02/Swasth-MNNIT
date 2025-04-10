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
},{ timestamps: true });

export default mongoose.model("Notification", notificationSchema);
