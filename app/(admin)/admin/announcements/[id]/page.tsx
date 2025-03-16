import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AnnouncementForm } from "@/components/announcement-form"
import { DeleteAnnouncementButton } from "@/components/delete-announcement-button"

interface AnnouncementPageProps {
  params: {
    id: string
  }
}

export default async function EditAnnouncementPage({ params }: AnnouncementPageProps) {
  const announcementId = params.id

  // Get announcement
  const announcement = await prisma.announcement.findUnique({
    where: {
      id: announcementId,
    },
  })

  if (!announcement) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Announcement</h1>
        <Link href="/admin/announcements">
          <Button variant="outline">Back to Announcements</Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <AnnouncementForm announcement={announcement} />

            <div className="mt-6 pt-6 border-t">
              <DeleteAnnouncementButton id={announcement.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

