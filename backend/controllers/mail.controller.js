import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import cron from "node-cron";
import { Doctor } from "../models/doctor.model.js";
import { Duty } from "../models/duty.model.js";
import { generatePdf } from "../utils/pdf.util.js";
import { sendEmail } from "../utils/email.util.js";
import QRCode from "qrcode";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import cloudinary from "cloudinary"

const generateAndSendDutyChart = async (templateFileName) => {
  try {
    const today = new Date();
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

    if (!doctors || doctors.length === 0) {
      return { status: "no-duty", message: "No duties scheduled for today." };
    }

    const pdfFile = await generatePdf(
      { doctors },
      'dutyChartTemplate', 
      'DutyChart.pdf' 
    );

    const receiver = {
      from: '"Swasth MNNIT" <trishitakesarwani06@gmail.com>',
      to: "trishita.2023ca106@mnnit.ac.in",
      subject: "Today Doctors Duty Chart",
      attachments: [
        {
          filename: "Today's duty chart.pdf",
          path: pdfFile,
        },
      ],
    };

    const emailResult = await sendEmail(receiver);
    return emailResult
  } catch (error) {
    console.error("Error in sending email:", error);
    throw error;
  }
};

export const sendDutyChartNow = async (req, res) => {
  const result = await generateAndSendDutyChart("dutyChartTemplate");
  if (result.status === "no-duty") {
    return res.status(200).json({ success: false, message: result.message });
  }
  if (result.status === "error") {
    return res.status(500).json({ success: false, message: result.message });
  }
  res.status(200).json({ success: true, message: result.message });
};

const scheduledJobs = {};

export const scheduleDutyChart = async (req, res) => {
  try {
    const { enabled, time } = req.body;

    // Stop existing job if any
    if (scheduledJobs["dutyChart"]) {
      scheduledJobs["dutyChart"].stop();
      delete scheduledJobs["dutyChart"];
    }

    if (!enabled) {
      return res.json({
        success: true,
        message: "Duty chart scheduling disabled",
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: "Time is required when enabling schedule",
      });
    }

    const [hours, minutes] = time.split(":");

    const job = cron.schedule(
      `${minutes} ${hours} * * *`,
      async () => {
        try {
          console.log(`Sending scheduled duty chart at ${time}`);
          const result = await generateAndSendDutyChart("dutyChartTemplate");
          if (result.status === "no-duty") {
            console.log("Skipped sending email: No duties today.");
            return;
          }
          if (result.status === "error") {
            console.error("Scheduled email error:", result.message);
          }
        } catch (error) {
          console.error("Error in scheduled duty chart:", error);
        }
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata",
      }
    );

    scheduledJobs["dutyChart"] = job;
    res.json({
      success: true,
      message: `Duty chart scheduled for ${time} daily`,
      schedule: { enabled: true, time },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const generateAndSendPrescription = async (prescription) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // 1. Generate PDF
    const logoPath = join(__dirname, '../public/logo.jpg');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const pdfPath = await generatePdf({ prescription, logoBase64 }, 'prescriptionTemplate', 'prescription.pdf');

    // 2. Upload PDF with authenticated access
    const pdfResponse = await uploadOnCloudinary(pdfPath);
    if (!pdfResponse?.url) throw new Error("PDF upload failed");

    // 3. Generate QR code with authenticated PDF URL
    const qrCodePath = join(__dirname, '../public/qr-code.png');
    await QRCode.toFile(qrCodePath, pdfResponse.url, { width: 200 });
    const qrCodeResponse = await uploadOnCloudinary(qrCodePath);

    // 4. Generate signed URLs for email attachments
    const signedPdfUrl = cloudinary.url(pdfResponse.public_id, {
      sign_url: true,
      secure: true,
      type: 'authenticated'
    });

    // 5. Send email with direct Cloudinary links
    const receiver = {
      from: process.env.EMAIL_FROM,
      to: prescription.patient.email,
      subject: "Your Prescription",
      html: `
        <h2>Dear ${prescription.patient.name},</h2>
        <p>Your prescription is ready. Scan the QR code or click the link below:</p>
        <img src="${qrCodeResponse.url}" alt="QR Code" style="width:150px;"/>
        <p><a href="${signedPdfUrl}">Download Prescription</a></p>
      `,
      // No need for attachments - using direct links
    };

    return await sendEmail(receiver);
  } catch (error) {
    console.error("Error sending prescription:", error);
    throw error;
  }
};