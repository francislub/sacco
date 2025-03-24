import { db } from "@/lib/db"

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })
    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

