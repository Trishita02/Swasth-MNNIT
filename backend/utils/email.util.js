import nodemailer from "nodemailer";

export const sendEmail = async ( receiver ) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "trishitakesarwani06@gmail.com",
        pass: "iieniwqjlbyakwgb",
      },
    });

    await transporter.sendMail(receiver);
    console.log("Email sent successfully to:", receiver.to);
    return "Email sent successfully";
  } catch (error) {
    console.error("Error in sending email:", error);
    throw error;
  }
};
