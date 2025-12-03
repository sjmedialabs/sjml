import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"

export const revalidate = 3600

export default async function ServicesPage() {
  let services: any[] = []
  let content

  try {
    // Fetch page content
    content = await getPageContent("services")
    if (!content) {
      throw new Error("Services page content not found")
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
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Available</h1>
          <p className="text-[#888]">Services page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const section = content.section

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
                <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-5 overflow-hidden">
                  {service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http')) ? (
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={32}
                      height={32}
                      className="object-contain"
                      style={{
                        filter: 'brightness(0) saturate(100%) invert(27%) sepia(94%) saturate(2255%) hue-rotate(337deg) brightness(91%) contrast(91%)'
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#E63946] rounded" />
                  )}
                </div>
                <h3 className="text-[#E63946] font-semibold text-lg mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.description}</p>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-[#E63946] text-sm font-medium hover:underline inline-flex items-center gap-2"
                >
                  {service.linkText || "Explore Service"} <span className="text-lg">→</span>
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
