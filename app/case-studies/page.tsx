import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { PageHero } from "@/components/page-hero"

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Enable ISR: Revalidate every hour

function TrendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 12L6 8L9 11L14 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 4H14V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default async function CaseStudiesPage() {
  let caseStudies: any[] = []
  let content

  try {
    // Fetch page content
    content = await getPageContent("case-studies")
    if (!content) {
      throw new Error("Case studies page content not found")
    }

    // Fetch case studies directly from MongoDB
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const studies = await db.collection("case-studies").find({ featured: true }).sort({ createdAt: -1 }).toArray()
    
    // Serialize MongoDB _id
    caseStudies = studies.map(cs => ({
      ...cs,
      _id: cs._id.toString()
    }))
  } catch (error) {
    console.error("Failed to fetch case studies:", error)
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Content Not Available</h2>
          <p className="text-muted-foreground">Case studies page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const section = content.section
  const heroDescription = hero.description || hero.subtitle || ""

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <PageHero title={hero.title} description={heroDescription} image={hero.image} />

      {/* Case Studies Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] italic mb-4">{section.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{section.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study: any) => (
              <div key={study.id || study._id} className="bg-white rounded-2xl overflow-hidden">
                <div className="relative">
                  <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    width={400}
                    height={300}
                    className="w-full aspect-4/3 object-cover"
                  />
                </div>
                <div className="p-5">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {study.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2.5 py-0.5 bg-[#E63946]/10 text-[#E63946] text-[10px] rounded-full border border-[#E63946]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{study.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{study.description}</p>

                  {/* Stats */}
                  <div className="flex gap-4 mb-4 text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <TrendIcon /> {study.stat1Value} {study.stat1Label}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon /> {study.stat2Value} {study.stat2Label}
                    </span>
                  </div>

                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="block w-full py-3 bg-[#E63946] text-foreground text-center rounded-full text-sm font-medium hover:bg-[#d62839] transition-colors"
                  >
                    View Case Study
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
