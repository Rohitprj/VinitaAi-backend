import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = () => {
  const user = process.env.NODEMAILER_EMAIL;
  const pass = process.env.NODEMAILER_PASSWORD;
  console.log(user, pass);
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: user,
      pass: pass,
    },
  });
};

transporter();

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter().sendMail({
      from: `"Vinita AI" <${process.env.NODEMAILER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
