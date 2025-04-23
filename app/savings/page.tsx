import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function SavingsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#002147] text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Savings Programs</h1>
            <p className="text-lg md:text-xl mb-8">
              Build your financial future with our flexible savings options offering competitive returns and secure
              growth opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Savings Programs Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Regular Savings Account</h2>
              <p className="text-gray-600 mb-6">
                Our Regular Savings Account is designed to help you build a strong financial foundation with competitive
                interest rates and easy access to your funds when needed.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Minimum balance of UGX 50,000",
                  "Competitive interest rate of 5% per annum",
                  "Monthly interest calculation",
                  "No withdrawal fees",
                  "Access to funds within 24 hours",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/membership">
                <Button className="bg-[#002147]">
                  Open an Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/regular-savings.jpg" alt="Regular Savings Account" fill className="object-cover" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/fixed-deposit.jpg" alt="Fixed Deposit Account" fill className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Fixed Deposit Account</h2>
              <p className="text-gray-600 mb-6">
                Our Fixed Deposit Account offers higher interest rates for members who can commit to saving for a fixed
                period, helping you maximize your returns.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Minimum deposit of UGX 500,000",
                  "Terms ranging from 3 to 36 months",
                  "Interest rates up to 12% per annum",
                  "Interest paid at maturity or periodically",
                  "Option to auto-renew at maturity",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/membership">
                <Button className="bg-[#002147]">
                  Open an Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Education Savings Plan</h2>
              <p className="text-gray-600 mb-6">
                Plan for your educational future or that of your children with our specialized Education Savings Plan,
                designed to help you meet future educational expenses.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Flexible contribution options",
                  "Higher interest rate of 8% per annum",
                  "Tax advantages for education savings",
                  "Option to link with education loans",
                  "Withdrawal specifically for education expenses",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/membership">
                <Button className="bg-[#002147]">
                  Open an Account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/education-savings.jpg" alt="Education Savings Plan" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Interest Rates Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#002147]">Current Interest Rates</h2>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-[#002147] text-white">
                    <tr>
                      <th className="p-4 text-left">Savings Type</th>
                      <th className="p-4 text-left">Minimum Amount</th>
                      <th className="p-4 text-left">Interest Rate (p.a.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Regular Savings</td>
                      <td className="p-4">UGX 50,000</td>
                      <td className="p-4">5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Fixed Deposit (3 months)</td>
                      <td className="p-4">UGX 500,000</td>
                      <td className="p-4">8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Fixed Deposit (6 months)</td>
                      <td className="p-4">UGX 500,000</td>
                      <td className="p-4">9%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Fixed Deposit (12 months)</td>
                      <td className="p-4">UGX 500,000</td>
                      <td className="p-4">10%</td>
                    </tr>
                    <tr>
                      <td className="p-4">Education Savings Plan</td>
                      <td className="p-4">UGX 100,000</td>
                      <td className="p-4">8%</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <p className="text-sm text-gray-500 mt-4 text-center">
              *Interest rates are subject to change. Last updated: April 2025
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002147] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Start Saving Today</h2>
            <p className="text-lg mb-8">
              Join BUESACCO and start building your financial future with our competitive savings programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Become a Member
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
