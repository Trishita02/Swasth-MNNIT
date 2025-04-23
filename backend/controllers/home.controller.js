import { sendEmail } from "../utils/email.util.js";
import { Doctor } from "../models/doctor.model.js";

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
    const doctorlist = todayDuty.get("todayDoctors");
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
