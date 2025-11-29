"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ContactPopup } from "@/components/contact-popup"

interface HeaderData {
  logo?: string
  logoText?: string
  navItems?: Array<{ label: string; href: string }>
  ctaButton?: { text: string; href: string }
}

interface HeaderProps {
  data?: HeaderData | null
}

const defaultNavLinks = [
  { name: "About", href: "/about" },
  { name: "Work", href: "/work" },
  { name: "Services", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Insights", href: "/insights" },
  { name: "Clients", href: "/clients" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function Header({ data: propData }: HeaderProps = {}) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactPopupOpen, setContactPopupOpen] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData | null>(propData || null)

  useEffect(() => {
    // Only fetch if data wasn't provided via props
    if (!propData) {
      const fetchHeaderData = async () => {
        try {
          const res = await fetch("/api/content/header")
          if (res.ok) {
            const data = await res.json()
            setHeaderData(data)
          }
        } catch (error) {
          console.error("Failed to fetch header data:", error)
        }
      }
      fetchHeaderData()
    }
  }, [propData])

  // Use header data if available, otherwise use defaults
  const navLinks = headerData?.navItems
    ? headerData.navItems.map((item) => ({ name: item.label, href: item.href }))
    : defaultNavLinks
  const logoText = headerData?.logoText || "SJ MEDIA LABS"
  const ctaText = headerData?.ctaButton?.text || "Start a project"

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {headerData?.logo ? (
                <Image
                  src={headerData.logo}
                  alt={logoText}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <>
                  <div className="w-8 h-8 bg-[#E63946] rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SJ</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight">{logoText}</span>
                    <span className="text-[#666] text-[10px] tracking-wider">DIGITAL AGENCY</span>
                  </div>
                </>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm transition-colors ${
                      isActive ? "text-[#E63946] font-medium" : "text-[#999] hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button
                className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full px-6"
                onClick={() => setContactPopupOpen(true)}
              >
                {ctaText}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-[#222]">
            <nav className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm py-2 ${
                      isActive ? "text-[#E63946] font-medium" : "text-[#999] hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              })}
              <Button
                className="bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-full mt-4"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setContactPopupOpen(true)
                }}
              >
                {ctaText}
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* ContactPopup component */}
      <ContactPopup isOpen={contactPopupOpen} onClose={() => setContactPopupOpen(false)} />
    </>
  )
}
