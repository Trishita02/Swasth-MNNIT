import mongoose from "mongoose"

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'role'  // Dynamic reference to Admin / Staff / Doctor model
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Staff', 'Doctor']  
  },
  activity: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);

