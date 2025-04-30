import { sendEmail } from "../utils/email.util.js";
import { Doctor } from "../models/doctor.model.js";
import {Duty} from "../models/duty.model.js"
const codeStore = new Map();
const todayDuty = new Map();

const todayDutyChart = async () => {
  try {
    const today = new Date(2025, 3, 13);
    today.setHours(0, 0, 0, 0); // Start of today

    const tomorrow = new Date();
    tomorrow.setHours(0, 0, 0, 0);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
    const doctors = await Doctor.find()
      .populate({
        path: "duties",
        match: {
          date: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      })
      .then((doctors) =>
        // filter out doctors with no duties today
        doctors.filter((doc) => doc.duties.length > 0)
      );
      todayDuty.set("todayDoctors",{doctors});

    if (!doctors || doctors.length === 0) {
      return { status: "no-duty", message: "No duties scheduled for today." };
    }

  } catch (error) {
    console.error("Error in sending email:", error);
    throw error;
  }
};


  // sendCode controller for send 4 digit code to email
 export const sendCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({success:false, message: "Email is required" });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
  codeStore.set(email, { code, expiresAt });

  const receiver = {
    from:`"Swasth MNNIT" <deepcode143@gmail.com>`,
    to: email,
    subject: "Your Verification Code from Swasth MNNIT",
    html: `<p>This is your Email verification code: <b>${code}</b></p>`,
    text: `Your email verification code is ${code}`, 
  };
  
   try {
    await sendEmail(receiver);
    res.status(200).json({success:true,message:"Verification code send to email"}); // optionally send code for dev/test
  } catch (err) {
    res.status(500).json({success:false,message: "Failed to send email"});
  }
};


  // verigyCode controller for verify 4 digit code 
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Missing email or code" });

  const stored = codeStore.get(email);
  if (!stored) return res.status(400).json({ error: "No code sent to this email" });

  if (stored.code !== code) {
    return res.status(400).json({ error: "Incorrect verification code" });
  }

  if (Date.now() > stored.expiresAt) {
    codeStore.delete(email);
    return res.status(400).json({ error: "Code has expired" });
  }

  // Valid code
  try {
    await todayDutyChart(); // Wait for duty chart to be populated
    const now = new Date();
    const offsetIST = 330; // IST is UTC+5:30 (5*60 + 30 = 330 minutes)
    const nowIST = new Date(now.getTime() + offsetIST * 60 * 1000);
    
    // Set to beginning of day in IST
    const todayStart = new Date(nowIST);
    todayStart.setHours(0, 0, 0, 0);
    // Convert back to UTC for MongoDB query
    const todayStartUTC = new Date(todayStart.getTime() - offsetIST * 60 * 1000);
    
    // Set to end of day in IST
    const todayEnd = new Date(nowIST);
    todayEnd.setHours(23, 59, 59, 999);
    // Convert back to UTC for MongoDB query
    const todayEndUTC = new Date(todayEnd.getTime() - offsetIST * 60 * 1000);

    // Fetch only today's duties
    const doctorlist = await Duty.find({
      date: {
        $gte: todayStartUTC,
        $lte: todayEndUTC
      }
    })
    .populate("user") // populates full user object
    .lean();
    codeStore.delete(email);
    res.status(200).json({
      message: "Email verified successfully",
      list: doctorlist,
    });
  } catch (err) {
    console.error("Error fetching duty chart:", err);
    res.status(500).json({ error: "Failed to fetch today's duty chart" });
  }
};

export const getUser=async(req,res)=>{
  return res.json({name:req.user.name,email:req.user.email,role:req.role})
}
