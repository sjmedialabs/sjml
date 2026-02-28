import { generateSeoMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return await generateSeoMetadata("Work")
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { PageHero } from "@/components/page-hero"

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Enable ISR: Revalidate every hour

export default async function WorkPage() {
  let projects: any[] = []
  let content: any = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    // Fetch page content and works in parallel
    const [pageContent, worksData] = await Promise.all([
      getPageContent("work"),
      db.collection("works").find({ isActive: true }).sort({ createdAt: -1 }).toArray(),
    ])

    content = pageContent
    if (!content) {
      throw new Error("Work page content not found")
    }
    
    // Serialize MongoDB _id
    projects = worksData.map((work) => ({
      ...work,
      _id: work._id.toString()
    }))
  } catch (error) {
    console.error("Failed to fetch works:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h2>
          <p className="text-muted-foreground">Work page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const portfolio = content.portfolio
  const heroDescription = hero.description || hero.subtitle || ""

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero title={hero.title} description={heroDescription} image={hero.image} />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] italic mb-4">{portfolio.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{portfolio.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-2xl overflow-hidden">
                <div className="relative">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full aspect-4/3 object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <Link
                    href={`/work/${project.slug}`}
                    className="block w-full py-3 bg-[#E63946] text-foreground text-center rounded-full text-sm font-medium hover:bg-[#d62839] transition-colors"
                  >
                    View Our Work
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
