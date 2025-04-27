import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function MembershipPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#002147] text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Membership</h1>
            <p className="text-lg md:text-xl mb-8">
              Join our community and enjoy exclusive benefits, financial education resources, and networking
              opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#002147]">Member Benefits</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#002147]">Financial Services</h3>
                <ul className="space-y-2">
                  {[
                    "Access to competitive savings accounts",
                    "Affordable loan options",
                    "Financial planning assistance",
                    "Dividend payments on shares",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#002147]">Education & Support</h3>
                <ul className="space-y-2">
                  {[
                    "Financial literacy workshops",
                    "Investment education seminars",
                    "Retirement planning guidance",
                    "One-on-one financial counseling",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#002147]">Community & Networking</h3>
                <ul className="space-y-2">
                  {[
                    "Annual General Meetings",
                    "Networking events with fellow members",
                    "Community service opportunities",
                    "Voice in SACCO governance",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#002147]">How to Join</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#002147]">Check Eligibility</h3>
                  <p className="text-gray-600">
                    Membership is open to all Bugema University employees. You must be a current employee to qualify for
                    membership.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#002147]">Complete Application</h3>
                  <p className="text-gray-600">
                    Fill out the membership application form, which can be obtained from our office or downloaded from
                    our website.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#002147]">Submit Required Documents</h3>
                  <p className="text-gray-600">
                    Submit your completed application form along with the following documents:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                    <li>Copy of your national ID or passport</li>
                    <li>Recent passport-sized photograph</li>
                    <li>Copy of your employment contract/letter</li>
                    <li>Proof of address (utility bill)</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#002147]">Pay Membership Fee</h3>
                  <p className="text-gray-600">
                    Pay the one-time membership fee of UGX 50,000 and purchase a minimum of 10 shares at UGX 10,000 per
                    share (total UGX 100,000).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[#002147]">Attend Orientation</h3>
                  <p className="text-gray-600">
                    Attend a brief orientation session to learn about BUESACCO's services, policies, and how to maximize
                    your membership benefits.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link href="/register">
                <Button size="lg" className="bg-[#002147]">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#002147]">What Our Members Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Namukasa",
                position: "Lecturer, Faculty of Education",
                quote:
                  "BUESACCO has been instrumental in helping me achieve my financial goals. The education loan I received enabled me to complete my PhD without financial stress.",
                image: "/people.jpg",
              },
              {
                name: "Mr. David Mugisha",
                position: "Administrative Staff",
                quote:
                  "The financial literacy workshops organized by BUESACCO have transformed how I manage my finances. I've been able to save more and plan better for my future.",
                image: "/people.jpg",
              },
              {
                name: "Prof. John Mukasa",
                position: "Head of Department, Business School",
                quote:
                  "Being a member of BUESACCO for over 10 years has provided me with financial security and peace of mind. The competitive savings rates have helped me build substantial savings.",
                image: "/people.jpg",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 relative">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.position}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#002147] text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Join BUESACCO?</h2>
            <p className="text-lg mb-8">
              Take the first step towards financial security and join our community of Bugema University employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Register Now
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
