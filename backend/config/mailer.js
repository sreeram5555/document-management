// backend/config/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // e.g. smtp-relay.brevo.com
  port: process.env.SMTP_PORT,       // e.g. 587
  secure: false,                     // use STARTTLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Mailer connection failed:", error);
  } else {
    console.log("✅ Mailer is ready to send messages");
  }
});

export const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
       from: `"SREERAM_DOC" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
    });
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
};
