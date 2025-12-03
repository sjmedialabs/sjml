import Link from "next/link"

interface FooterData {
  address: string
  phone: string
  email: string
  copyright: string
  newsletterText: string
}


function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Our Work", href: "/work" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

const serviceLinks = [
  { name: "Branding", href: "/services/branding" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Web Development", href: "/services/web-development" },
  { name: "Strategy", href: "/services/strategy" },
  { name: "Advertising", href: "/services/advertising" },
  { name: "Web & Experience", href: "/services/web-experience" },
  { name: "Influencer Marketing", href: "/services/influencer-marketing" },
  { name: "Mobile app", href: "/services/mobile-app" },
]

const socialLinks = [
  { name: "Facebook", icon: "f" },
  { name: "Instagram", icon: "📷" },
  { name: "LinkedIn", icon: "in" },
  { name: "Twitter", icon: "𝕏" },
  { name: "YouTube", icon: "▶" },
]

interface FooterProps {
  data?: FooterData
}

export function Footer({ data }: FooterProps) {
  // Use minimal defaults if no data provided
  const footerData = data || {
    address: "",
    phone: "",
    email: "info@sjmedialabs.com",
    copyright: "© 2025 SJ Media Labs. All Rights Reserved",
    newsletterText: "Subscribe to get the latest updates."
  }

  return (
    <footer className="bg-[#0a0a0a] pt-16 pb-8 border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & Contact */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight">SJ MEDIA LABS</span>
                <span className="text-[#666] text-[9px] tracking-[0.2em]">IGNITING BRILLIANCE</span>
              </div>
            </Link>

            <div className="space-y-3 text-[#888] text-sm">
              <p className="flex items-start gap-2">
                <MapPinIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#E63946]" />
                <span className="whitespace-pre-line">{footerData.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-[#E63946]" />
                {footerData.phone}
              </p>
              <p className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-[#E63946]" />
                {footerData.email}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-8 h-8 bg-[#1a1a1a] hover:bg-[#E63946] rounded flex items-center justify-center text-white text-xs transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[#E63946] font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-[#888] hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-[#E63946] font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-[#888] hover:text-white text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[#E63946] font-semibold mb-4">Newsletter</h3>
            <p className="text-[#888] text-sm mb-4">{footerData.newsletterText}</p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your Email address"
                className="w-full px-4 py-2.5 bg-transparent border border-[#333] rounded text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#E63946]"
              />
              <button className="w-full px-4 py-2.5 bg-[#E63946] text-white rounded text-sm font-medium hover:bg-[#d62839] transition-colors">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#1a1a1a] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-sm">{footerData.copyright}</p>
          <div className="flex gap-6 text-[#666] text-sm">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
