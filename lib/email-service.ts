import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Function to send verification email
export async function sendVerificationEmail(
  email: string,
  code: string,
  type: "registration" | "login" | "password-reset"
) {
  const subjects = {
    registration: "Verify Your BUESACCO Account",
    login: "Your BUESACCO Login Code",
    "password-reset": "Reset Your BUESACCO Password",
  };

  const texts = {
    registration: `Welcome to BUESACCO! Your verification code is: ${code}. This code will expire in 10 minutes.`,
    login: `Your login verification code is: ${code}. This code will expire in 10 minutes.`,
    "password-reset": `Your password reset code is: ${code}. This code will expire in 10 minutes.`,
  };

  const htmlTemplates = {
    registration: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to BUESACCO!</h2>
        <p>Thank you for registering with Bugema University Employee SACCO.</p>
        <p>To complete your registration, please use the following verification code:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <p>Best regards,<br>BUESACCO Team</p>
      </div>
    `,
    login: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">BUESACCO Login Verification</h2>
        <p>You are attempting to log in to your BUESACCO account.</p>
        <p>Please use the following verification code to complete your login:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not attempt to log in, please secure your account immediately.</p>
        <p>Best regards,<br>BUESACCO Team</p>
      </div>
    `,
    "password-reset": `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">BUESACCO Password Reset</h2>
        <p>You have requested to reset your BUESACCO account password.</p>
        <p>Please use the following verification code to reset your password:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>BUESACCO Team</p>
      </div>
    `,
  };

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: subjects[type],
    text: texts[type],
    html: htmlTemplates[type],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
