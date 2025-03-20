import prisma from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/email-service"

// Generate a random 6-digit code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create and send a verification code
export async function createAndSendVerificationCode(
  userId: string,
  email: string,
  type: "REGISTRATION" | "LOGIN" | "PASSWORD_RESET",
): Promise<boolean> {
  try {
    // Generate a new code
    const code = generateVerificationCode()

    // Set expiration time (10 minutes from now)
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    // Save the code to the database
    await prisma.verificationCode.create({
      data: {
        code,
        type,
        userId,
        expiresAt,
        used: false,
      },
    })

    // Map the type to the email service format
    const emailType = type === "REGISTRATION" ? "registration" : type === "LOGIN" ? "login" : "password-reset"

    // Send the email
    return await sendVerificationEmail(email, code, emailType)
  } catch (error) {
    console.error("Error creating verification code:", error)
    return false
  }
}

// Verify a code
export async function verifyCode(
  userId: string,
  code: string,
  type: "REGISTRATION" | "LOGIN" | "PASSWORD_RESET",
): Promise<boolean> {
  try {
    // Find a valid code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        type,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!verificationCode) {
      return false
    }

    // Mark the code as used
    await prisma.verificationCode.update({
      where: {
        id: verificationCode.id,
      },
      data: {
        used: true,
      },
    })

    return true
  } catch (error) {
    console.error("Error verifying code:", error)
    return false
  }
}

