"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function SystemSettingsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // These would typically be loaded from a settings API
  const [settings, setSettings] = useState({
    systemName: "Bugema University Employee SACCO",
    allowNewRegistrations: true,
    maintenanceMode: false,
    contactEmail: "admin@buesacco.com",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would typically save to a settings API
      // const response = await fetch('/api/settings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(settings),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Settings updated",
        description: "System settings have been updated successfully.",
      })

      // Refresh the page data
      router.refresh()
    } catch (error: any) {
      console.error(error)
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="systemName">System Name</Label>
        <Input id="systemName" name="systemName" value={settings.systemName} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={settings.contactEmail}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="allowNewRegistrations">Allow New Registrations</Label>
        <Switch
          id="allowNewRegistrations"
          checked={settings.allowNewRegistrations}
          onCheckedChange={(checked) => handleSwitchChange("allowNewRegistrations", checked)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
        <Switch
          id="maintenanceMode"
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  )
}

