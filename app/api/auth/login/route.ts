import { NextResponse } from "next/server"
import { getUserByEmail } from "@/lib/data"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find the user
    const user = await getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Delete any existing codes for this user and type
    await db.verificationCode.deleteMany({
      where: {
        userId: user.id,
        type: "LOGIN",
      },
    })

    // Create a new verification code
    await db.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: "LOGIN",
        expiresAt,
      },
    })

    // Send the verification code via email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your BUESACCO login verification code",
      text: `Your login verification code is: ${code}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Login Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 4px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p>Thank you,<br>BUESACCO Team</p>
        </div>
      `,
    })

    // Return success with user ID and role
    return NextResponse.json({
      success: true,
      requires2FA: true,
      userId: user.id,
      role: user.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}

