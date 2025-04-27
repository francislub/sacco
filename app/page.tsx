import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Users, PiggyBank, CreditCard } from "lucide-react"
import NewsCard from "@/components/news-card"
import StatCard from "@/components/stat-card"
import LoanCalculator from "@/components/loan-calculator"
import ServiceCard from "@/components/service-card"

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-[#5d5545] text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/busaco.jpg"
            alt="Hero background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              {/* <div className="bg-white rounded-full p-1">
                <Image src="/bugema.png" alt="Bugema University Logo" width={80} height={80} className="rounded-full" />
              </div> */}
              <div>
                <h2 className="text-xl md:text-2xl font-medium">Bugema University</h2>
                <h3 className="text-xl md:text-2xl font-medium text-yellow-300">Savings & Credit Cooperative</h3>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Building Financial Security Together</h1>
            <p className="text-lg md:text-xl mb-8">
              Join BUESACCO and access tailored savings programs, low-interest loans, and financial solutions designed
              exclusively for Bugema University employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/membership">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Become a Member
                </Button>
              </Link>
              <Link href="/loans">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10">
                  Explore Loan Options <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#002147]">Our Services</h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            BUESACCO offers a comprehensive range of financial services designed to meet the unique needs of Bugema
            University employees.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard
              icon={<PiggyBank className="h-8 w-8 text-[#002147]" />}
              title="Savings Programs"
              description="Build your financial future with our flexible savings options offering competitive returns and secure growth opportunities."
              imageSrc="/celeb.jpg"
              linkHref="/savings"
            />

            <ServiceCard
              icon={<CreditCard className="h-8 w-8 text-[#002147]" />}
              title="Loan Options"
              description="Access affordable loans with flexible repayment terms for education, home improvement, emergencies, and more."
              imageSrc="/one.jpg"
              linkHref="/loans"
            />

            <ServiceCard
              icon={<Users className="h-8 w-8 text-[#002147]" />}
              title="Membership"
              description="Join our community and enjoy exclusive benefits, financial education resources, and networking opportunities."
              imageSrc="/two.jpg"
              linkHref="/membership"
            />
          </div>
        </div>
      </section>

      {/* Benefits & Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#002147]">Benefits & Calculator</h2>
          <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
            Discover the advantages of being a BUESACCO member and calculate your potential loan payments with our
            interactive tool.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <StatCard number="1,250+" label="Members" />
                <StatCard number="UGX 2,500,000+" label="Total Savings" />
                <StatCard number="950+" label="Loans Disbursed" />
              </div>

              <h3 className="text-2xl font-bold mb-6 text-[#002147]">Member Benefits</h3>
              <ul className="space-y-4">
                {[
                  "Competitive interest rates on savings",
                  "Quick loan processing within 48 hours",
                  "No hidden fees or charges",
                  "Financial literacy workshops",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Card>
                <CardContent className="pt-6">
                  <LoanCalculator />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#002147]">News & Announcements</h2>
          <p className="text-center text-gray-700 mb-12">
            Stay updated with the latest happenings and announcements from BUESACCO.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <NewsCard
              date="March 15, 2025"
              title="New Education Loan Package Launched"
              content="BUESACCO introduces a specialized loan package for staff pursuing further education with competitive interest rates and flexible repayment terms."
              imageSrc="/three.jpg"
            />

            <NewsCard
              date="April 5, 2025"
              title="Annual General Meeting Scheduled"
              content="Members are invited to attend the Annual General Meeting on April 20th where dividends for the previous financial year will be announced."
              imageSrc="/four.jpg"
            />

            <NewsCard
              date="February 28, 2025"
              title="Financial Literacy Workshop Series"
              content="Join our upcoming workshop series covering investment strategies, retirement planning, and effective debt management."
              imageSrc="/five.jpg"
            />
          </div>
        </div>
      </section>
    </main>
  )
}
