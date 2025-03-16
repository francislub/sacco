"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

interface AnnouncementFormProps {
  announcement?: {
    id: string
    title: string
    content: string
  }
}

export function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(announcement?.title || "")
  const [content, setContent] = useState(announcement?.content || "")

  const isEditing = !!announcement

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!title.trim()) {
        throw new Error("Title is required")
      }

      if (!content.trim()) {
        throw new Error("Content is required")
      }

      const url = isEditing ? `/api/announcements/${announcement.id}` : "/api/announcements"

      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} announcement`)
      }

      toast({
        title: isEditing ? "Announcement updated" : "Announcement created",
        description: isEditing
          ? "The announcement has been updated successfully."
          : "The announcement has been created successfully.",
      })

      // Refresh the page data
      router.refresh()

      // Reset form if creating new announcement
      if (!isEditing) {
        setTitle("")
        setContent("")
      }
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} announcement. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter announcement title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter announcement content"
          rows={6}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
            ? "Update Announcement"
            : "Create Announcement"}
      </Button>
    </form>
  )
}

