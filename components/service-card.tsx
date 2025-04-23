import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  imageSrc: string
  linkHref: string
}

export default function ServiceCard({ icon, title, description, imageSrc, linkHref }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-[#002147]">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>

      <div className="relative h-48 w-full">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="p-4 border-t">
        <Link href={linkHref}>
          <Button variant="link" className="p-0 h-auto text-[#002147]">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
