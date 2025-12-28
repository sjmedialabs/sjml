import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPageContent, type ClientsPageData } from "@/lib/models/content"
import { clientPromise } from "@/lib/mongodb"
import { ClientsList } from "@/components/clients-list"

export const revalidate = 3600 // Enable ISR: Revalidate every hour

export default async function ClientsPage() {
  let content: ClientsPageData | null = null
  let clients: any[] = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [pageContent, clientsData] = await Promise.all([
      getPageContent("clients"),
      db.collection("clients").find({}).toArray(),
    ])

    content = pageContent as ClientsPageData
    clients = clientsData.map((c) => ({
      ...c,
      id: c._id.toString(),
      _id: c._id.toString(),
    }))
  } catch (error) {
    console.error("Failed to fetch clients data:", error)
  }

  if (!content) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Available</h1>
          <p className="text-[#888]">Page content has not been set up yet.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const stats = content.stats || []
  const cta = content.cta
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {hero.title ? (
              hero.title
            ) : (
              <>
                Our <span className="text-[#E63946]">Clients</span>
              </>
            )}
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">
            {hero.subtitle || "Trusted by industry leaders worldwide to deliver exceptional results."}
          </p>
        </div>
      </section>

      <ClientsList initialClients={clients} />

      {/* Stats */}
      {stats.length > 0 && (
        <section className="py-16 px-4 bg-[#111]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold text-[#E63946] mb-2">{stat.value}</div>
                  <div className="text-[#888]">{stat.label}</div>
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
            <h2 className="text-3xl font-bold text-white mb-4">{cta.title}</h2>
            <p className="text-white/80 mb-8">{cta.description}</p>
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
