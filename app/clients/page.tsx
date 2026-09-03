import { generateSeoMetadata } from "@/lib/seo"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getClientsPageData } from "@/lib/data/clients-page"
import { ClientsList } from "@/components/clients-list"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"
import Link from "next/link"

export async function generateMetadata() {
  return await generateSeoMetadata("Clients")
}

export const dynamic = "force-dynamic"
export const revalidate = 0

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export default async function ClientsPage() {
  let data: Awaited<ReturnType<typeof getClientsPageData>> | null = null

  try {
    data = await getClientsPageData()
  } catch (error) {
    console.error("Failed to fetch clients data:", error)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Content Not Available</h1>
          <p className="text-black/60">Page content has not been set up yet.</p>
        </div>
      </main>
    )
  }

  const { heroTitle, heroSubtitle, heroImage, clients, availableIndustries, stats, cta } = data

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="about-hero relative overflow-hidden text-white flex items-center min-h-[380px] md:min-h-[440px]">
        <InnerPageHeroBackground image={heroImage} />
        <div className="site-container about-hero-inner relative z-10 py-16 md:py-20">
          <div className="max-w-3xl">
            <span className="site-subtitle text-home-primary text-[11px] uppercase tracking-[0.2em] font-semibold mb-3 block">
              OUR PARTNERSHIPS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white mb-4 leading-tight">
              {heroTitle || "Our Clients"}
            </h1>
            {heroSubtitle && (
              <p className="site-paragraph text-white/80 text-base md:text-lg leading-relaxed max-w-2xl">
                {heroSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Clients Grid & Category Filter */}
      <ClientsList initialClients={clients} availableIndustries={availableIndustries} />

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <section className="py-14 bg-[#f5f5f5] border-y border-black/10">
          <div className="site-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat: { value: string; label: string }, index: number) => (
                <div key={index} className="text-center md:text-left">
                  <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-home-primary mb-3 tracking-tighter leading-none">
                    {stat.value}
                  </p>
                  <p className="text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-widest text-black">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {cta && (cta.title || cta.description) && (
        <section className="bg-home-secondary py-10 md:py-14">
          <div className="site-container flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight text-white mb-2">
                {cta.title}
              </h2>
              {cta.description && (
                <p className="text-white/70 text-sm md:text-base leading-relaxed">
                  {cta.description}
                </p>
              )}
            </div>
            {cta.buttonText && (
              <Link
                href={cta.buttonUrl || "/contact"}
                className="home-hero-cta-primary inline-flex items-center gap-2 h-10 px-6 font-bold uppercase tracking-wide shrink-0 transition-all"
              >
                {cta.buttonText}
                <ArrowIcon />
              </Link>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

