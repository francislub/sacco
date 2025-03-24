import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET(request: Request) {
  try {
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

    // Test the connection
    await transporter.verify()

    // Send a test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // Send to yourself for testing
      subject: "BUESACCO Email Test",
      text: "This is a test email from BUESACCO.",
      html: "<p>This is a test email from BUESACCO.</p>",
    })

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId,
      emailConfig: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER ? "Set" : "Not set",
        pass: process.env.SMTP_PASSWORD ? "Set" : "Not set",
        from: process.env.EMAIL_FROM,
      },
    })
  } catch (error) {
    console.error("Error sending test email:", error)
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : String(error),
        emailConfig: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURE,
          user: process.env.SMTP_USER ? "Set" : "Not set",
          pass: process.env.SMTP_PASSWORD ? "Set" : "Not set",
          from: process.env.EMAIL_FROM,
        },
      },
      { status: 500 },
    )
  }
}

