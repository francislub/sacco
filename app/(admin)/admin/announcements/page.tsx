import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { AnnouncementForm } from "@/components/announcement-form"

export default async function AnnouncementsPage() {
  // Get all announcements
  const announcements = await prisma.announcement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Create Announcement</h2>
          <Card>
            <CardContent className="pt-6">
              <AnnouncementForm />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          {announcements.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border">
              <p className="text-gray-500">No announcements yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 border-b bg-gray-50">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <span className="text-xs text-gray-500">{formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>
                    <div className="p-4 whitespace-pre-wrap">{announcement.content}</div>
                    <div className="p-4 pt-0 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/announcements/${announcement.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

