import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserByEmail } from "@/lib/data"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, type } = await request.json()

    if (!email || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate type
    if (!["REGISTER", "LOGIN", "PASSWORD_RESET"].includes(type)) {
      return NextResponse.json({ error: "Invalid verification type" }, { status: 400 })
    }

    // Get user by email
    const user = await getUserByEmail(email)

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return NextResponse.json({ success: true })
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any existing codes for this user and type
    await db.verificationCode.deleteMany({
      where: {
        userId: user.id,
        type,
      },
    })

    // Create a new verification code
    await db.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type,
        expiresAt,
      },
    })

    // Create email subject and content based on type
    let subject, text, html

    switch (type) {
      case "REGISTER":
        subject = "Verify your BUESACCO account"
        text = `Your verification code is: ${code}. Use this code to complete your registration.`
        break
      case "LOGIN":
        subject = "Your BUESACCO login verification code"
        text = `Your login verification code is: ${code}. This code will expire in 10 minutes.`
        break
      case "PASSWORD_RESET":
        subject = "Reset your BUESACCO password"
        text = `Your password reset code is: ${code}. Use this code to reset your password.`
        break
    }

    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; margin: 20px 0;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
        <p>Thank you,<br>BUESACCO Team</p>
      </div>
    `

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      text,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resending verification code:", error)
    return NextResponse.json({ error: "Failed to resend verification code" }, { status: 500 })
  }
}

