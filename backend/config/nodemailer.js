

// import transporter from "./mailer.js";

// export const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.SENDER_EMAIL, // must match your verified sender
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw error;
//   }
// };

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;