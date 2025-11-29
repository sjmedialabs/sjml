import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import type { JSX } from "react"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Service icons by name
const serviceIcons: Record<string, JSX.Element> = {
  "research-strategy": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <path d="M20 5L5 15L20 25L35 15L20 5Z" stroke="#E63946" strokeWidth="2" />
      <path d="M5 25L20 35L35 25" stroke="#E63946" strokeWidth="2" />
      <circle cx="20" cy="15" r="3" fill="#E63946" />
    </svg>
  ),
  branding: (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="15" stroke="#E63946" strokeWidth="2" />
      <circle cx="20" cy="20" r="8" stroke="#E63946" strokeWidth="2" />
      <circle cx="20" cy="20" r="3" fill="#E63946" />
    </svg>
  ),
  "web-experience": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="8" width="30" height="20" rx="2" stroke="#E63946" strokeWidth="2" />
      <line x1="5" y1="14" x2="35" y2="14" stroke="#E63946" strokeWidth="2" />
      <circle cx="9" cy="11" r="1.5" fill="#E63946" />
      <circle cx="14" cy="11" r="1.5" fill="#E63946" />
    </svg>
  ),
  "digital-marketing": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <path d="M5 30L15 20L22 27L35 10" stroke="#E63946" strokeWidth="2" />
      <path d="M28 10H35V17" stroke="#E63946" strokeWidth="2" />
    </svg>
  ),
  "commercial-ads": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="5" y="12" width="30" height="16" stroke="#E63946" strokeWidth="2" />
      <rect x="8" y="8" width="24" height="4" stroke="#E63946" strokeWidth="2" />
      <line x1="12" y1="20" x2="28" y2="20" stroke="#E63946" strokeWidth="2" />
    </svg>
  ),
  advertising: (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="8" width="24" height="24" rx="2" stroke="#E63946" strokeWidth="2" />
      <path d="M14 20H26" stroke="#E63946" strokeWidth="2" />
      <path d="M20 14V26" stroke="#E63946" strokeWidth="2" />
    </svg>
  ),
  "influencer-marketing": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="12" r="6" stroke="#E63946" strokeWidth="2" />
      <circle cx="10" cy="28" r="4" stroke="#E63946" strokeWidth="2" />
      <circle cx="30" cy="28" r="4" stroke="#E63946" strokeWidth="2" />
      <path d="M20 18V24" stroke="#E63946" strokeWidth="2" />
      <path d="M14 26L20 24L26 26" stroke="#E63946" strokeWidth="2" />
    </svg>
  ),
  "affiliate-marketing": (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="12" stroke="#E63946" strokeWidth="2" />
      <path d="M15 20L18 23L25 16" stroke="#E63946" strokeWidth="2" />
    </svg>
  ),
}

export default async function ServicesPage() {
  let services: any[] = []
  let content

  try {
    // Fetch page content
    content = await getPageContent("services")
    if (!content) {
      content = getDefaultPageContent("services")
    }

    // Fetch services directly from MongoDB
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const servicesData = await db.collection("services").find({ isActive: true }).sort({ createdAt: -1 }).toArray()
    
    // Serialize MongoDB _id
    services = servicesData.map(service => ({
      ...service,
      _id: service._id.toString()
    }))
  } catch (error) {
    console.error("Failed to fetch services:", error)
    content = getDefaultPageContent("services")
  }

  const hero = content?.hero || {
    title: "Redefining Digital Success with Strategy, Design, and Development",
    highlightedWords: ["Success", "Strategy, Design"],
    backgroundImage: "/business-people-working-on-laptops-hands-typing-pr.jpg",
    watermark: "SERVICES",
  }

  const section = content?.section || {
    title: "Our Services we're providing",
    subtitle: "to our customers",
    description: "Comprehensive solutions to elevate your brand and drive business growth across all channels.",
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[450px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hero.backgroundImage || "/business-people-working-on-laptops-hands-typing-pr.jpg"}
            alt="Services background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <span className="text-[200px] font-bold text-white/5 tracking-wider">{hero.watermark || "SERVICES"}</span>
          </div>
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Redefining Digital </span>
              <span className="text-[#E63946]">Success</span>
              <br />
              <span className="text-white">with </span>
              <span className="text-[#E63946]">Strategy, Design</span>
              <span className="text-white">,</span>
              <br />
              <span className="text-white">and Development</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-[#E63946] italic">{section.title}</span>
            </h2>
            <h3 className="text-2xl md:text-3xl text-[#E63946] italic mb-6">{section.subtitle}</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm">{section.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {services.map((service: any) => (
              <div
                key={service.id}
                className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#333] transition-colors"
              >
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-5">
                  {serviceIcons[service.icon] || serviceIcons["branding"]}
                </div>
                <h3 className="text-[#E63946] font-semibold text-lg mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-[#E63946] text-sm font-medium hover:underline inline-flex items-center gap-2"
                >
                  {service.linkText || "Explore Branding"} <span className="text-lg">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
