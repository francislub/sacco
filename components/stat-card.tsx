import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  number: string
  label: string
}

export default function StatCard({ number, label }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="text-2xl font-bold text-[#002147]">{number}</div>
        <div className="text-sm text-gray-600">{label}</div>
      </CardContent>
    </Card>
  )
}
