import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getClientsPageData } from "@/lib/data/clients-page"
import { ClientsList } from "@/components/clients-list"
import { PageHero } from "@/components/page-hero"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function ClientsPage() {
  let data: Awaited<ReturnType<typeof getClientsPageData>> | null = null

  try {
    data = await getClientsPageData()
  } catch (error) {
    console.error("Failed to fetch clients data:", error)
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h1>
          <p className="text-muted-foreground">Page content has not been set up yet.</p>
        </div>
      </main>
    )
  }

  const { heroTitle, heroSubtitle, heroImage, clients, stats, cta } = data
  const heroDescription = heroSubtitle || ""

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero title={heroTitle} description={heroDescription} image={heroImage} />

      <ClientsList initialClients={clients} />

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 px-4 bg-card">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-[#E63946] mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#E63946] to-[#d62839] rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{cta.title}</h2>
            <p className="text-foreground/80 mb-8">{cta.description}</p>
            <a
              href={cta.buttonUrl}
              className="inline-block px-8 py-4 bg-white text-[#E63946] rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              {cta.buttonText}
            </a>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
