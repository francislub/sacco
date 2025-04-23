import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface NewsCardProps {
  date: string
  title: string
  content: string
  imageSrc: string
}

export default function NewsCard({ date, title, content, imageSrc }: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>

      <CardContent className="p-6">
        <div className="text-sm text-gray-500 mb-2">{date}</div>
        <h3 className="text-xl font-bold mb-2 text-[#002147]">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        <Link href="#">
          <Button variant="link" className="p-0 h-auto text-[#002147]">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
