import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#002147] text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <p className="mb-4">
              Bugema University Savings and Credit Cooperative Organization provides financial solutions that empower
              our members to achieve financial stability and growth.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://facebook.com" className="hover:text-yellow-300">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="hover:text-yellow-300">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="hover:text-yellow-300">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="hover:text-yellow-300">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/savings" className="hover:text-yellow-300">
                  Savings Programs
                </Link>
              </li>
              <li>
                <Link href="/loan" className="hover:text-yellow-300">
                  Loan Options
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-yellow-300">
                  How to Join
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/register-admin" className="hover:text-yellow-300">
                  Register as Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Bugema University Campus, Main Building, 2nd Floor, Kampala, Uganda</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>+256 41 1234567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>info@buesacco.org</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">
              Sign up for our newsletter to receive updates on new services and important announcements.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/70">© 2025 BUESACCO. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-white/70 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/70 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
