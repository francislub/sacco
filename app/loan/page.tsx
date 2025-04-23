import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ArrowRight } from "lucide-react"
import LoanCalculator from "@/components/loan-calculator"

export default function LoansPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#002147] text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Loan Options</h1>
            <p className="text-lg md:text-xl mb-8">
              Access affordable loans with flexible repayment terms for education, home improvement, emergencies, and
              more.
            </p>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Personal Loans</h2>
              <p className="text-gray-600 mb-6">
                Our personal loans are designed to help you meet your financial needs, whether it's for home
                improvements, medical expenses, or other personal projects.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Loan amounts from UGX 500,000 to UGX 10,000,000",
                  "Competitive interest rate of 15% per annum",
                  "Flexible repayment terms up to 36 months",
                  "Quick approval process within 48 hours",
                  "No hidden fees or charges",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/loans/apply">
                <Button className="bg-[#002147]">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/personal-loan.jpg" alt="Personal Loan" fill className="object-cover" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1 relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/education-loan.jpg" alt="Education Loan" fill className="object-cover" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Education Loans</h2>
              <p className="text-gray-600 mb-6">
                Invest in your future with our education loans, designed to help Bugema University staff pursue further
                education and professional development.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Loan amounts up to UGX 15,000,000",
                  "Reduced interest rate of 12% per annum",
                  "Extended repayment terms up to 48 months",
                  "Grace period options during study period",
                  "Direct payment to educational institutions available",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/loans/apply">
                <Button className="bg-[#002147]">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[#002147]">Emergency Loans</h2>
              <p className="text-gray-600 mb-6">
                Our emergency loans provide quick financial assistance when you need it most, with expedited processing
                and flexible terms.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  "Loan amounts up to UGX 3,000,000",
                  "Standard interest rate of 15% per annum",
                  "Expedited approval within 24 hours",
                  "Flexible repayment terms up to 24 months",
                  "Minimal documentation required",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/loans/apply">
                <Button className="bg-[#002147]">
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image src="/images/emergency-loan.jpg" alt="Emergency Loan" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-center text-[#002147]">Loan Calculator</h2>
            <p className="text-center text-gray-600 mb-8">
              Use our loan calculator to estimate your monthly repayments and total cost of borrowing.
            </p>

            <Card>
              <CardContent className="p-6">
                <LoanCalculator />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#002147]">Loan Requirements</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-[#002147]">Eligibility Criteria</h3>
                <ul className="space-y-3">
                  {[
                    "Must be a registered member of BUESACCO",
                    "Minimum membership period of 3 months",
                    "Regular savings contributions for at least 3 months",
                    "Must be a current employee of Bugema University",
                    "Good repayment history (for existing borrowers)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-[#002147]">Required Documents</h3>
                <ul className="space-y-3">
                  {[
                    "Completed loan application form",
                    "Copy of employment contract/letter",
                    "Recent payslips (last 3 months)",
                    "Copy of national ID or passport",
                    "Proof of address (utility bill)",
                    "Loan security (where applicable)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002147] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
            <p className="text-lg mb-8">
              Join BUESACCO today and access our range of affordable loan options designed to meet your financial needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/loans/apply">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Apply for a Loan
                </Button>
              </Link>
              <Link href="/membership">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a Member
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
