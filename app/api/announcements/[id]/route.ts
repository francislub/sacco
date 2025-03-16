import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const announcementId = params.id

    const announcement = await prisma.announcement.findUnique({
      where: {
        id: announcementId,
      },
    })

    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error fetching announcement:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can update announcements
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const announcementId = params.id
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const announcement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title,
        content,
      },
    })

    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error updating announcement:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can delete announcements
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const announcementId = params.id

    await prisma.announcement.delete({
      where: {
        id: announcementId,
      },
    })

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

