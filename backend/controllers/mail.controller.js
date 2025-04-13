import nodemailer from "nodemailer";
import pdf from "html-pdf";
import path from "path";
import ejs from "ejs";
import cron from "node-cron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Doctor } from "../models/doctor.model.js";
import { Duty } from "../models/duty.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    const html = await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, "../views/", `${templateFileName}.ejs`),
        { doctors },
        (err, data) => {
          if (err) {
            console.error("Error rendering EJS:", err);
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
    });

    const pdfOptions = {
      height: "11.25in",
      width: "8.5in",
      header: { height: "20mm" },
      footer: { height: "20mm" },
    };

    const pdfFile = await new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toFile("DutyChart.pdf", (err, result) => {
        if (err) {
          console.error("Error creating PDF:", err);
          reject(err);
        } else {
          console.log("PDF created successfully");
          resolve(result.filename);
        }
      });
    });

    const auth = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "trishitakesarwani06@gmail.com",
        pass: "iieniwqjlbyakwgb",
      },
    });

    const receiver = {
      from: "trishitakesarwani06@gmail.com",
      to: "trishu.kesarwani06@gmail.com",
      subject: "Today Doctors Duty Chart",
      attachments: [
        {
          filename: "Today's duty chart.pdf",
          path: pdfFile,
        },
      ],
    };

    await auth.sendMail(receiver);
    console.log("Email sent successfully");
    return "Email sent successfully";
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
