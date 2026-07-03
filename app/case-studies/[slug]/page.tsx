import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { InnerPageHeroBackground } from "@/components/inner-page-hero-background"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"

interface CaseStudyData {
  id: string
  slug: string
  title: string
  description: string
  image: string
  tags: string[]
  stat1Label: string
  stat1Value: string
  stat2Label: string
  stat2Value: string
  client?: string
  industry?: string
  year?: string
  challenge?: string
  solution?: string
  results?: string[]
  gallery?: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
    company: string
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Enable ISR

// Generate static params for all case studies to pre-render them at build time
export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const studies = await db.collection("case-studies").find({}, { projection: { slug: 1 } }).toArray()
    return studies.map((study) => ({
      slug: study.slug,
    }))
  } catch (e) {
    return []
  }
}

export default async function CaseStudyDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params
  let caseStudy: CaseStudyData | null = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("case-studies").findOne({ slug })
    if (data) {
      caseStudy = { ...data, id: data._id.toString() } as unknown as CaseStudyData
    }
  } catch (error) {
    console.error("Failed to fetch case study:", error)
  }

  if (!caseStudy) {
    notFound()
  }

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />

      <section className="about-hero bg-home-secondary">
        <InnerPageHeroBackground image={caseStudy.image || "/placeholder.svg"} overlayClassName="about-hero-overlay" />
        <div className="site-container about-hero-inner">
          <div className="about-hero-grid">
            <div className="about-hero-content w-full max-w-4xl">
              {caseStudy.tags && caseStudy.tags.length > 0 && (
                <div className="flex flex-wrap justify-start gap-2 mb-3">
                  {caseStudy.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 text-white rounded-full text-xs border border-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold page-hero-heading mb-2">{caseStudy.title}</h1>
              <p className="text-sm md:text-base page-hero-description line-clamp-2">{caseStudy.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-home-secondary border-t border-white/10">
        <div className="site-container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-home-primary text-2xl font-bold mb-0.5">{caseStudy.stat1Value}</p>
              <p className="text-white/80 text-sm">{caseStudy.stat1Label}</p>
            </div>
            <div className="text-center">
              <p className="text-home-primary text-2xl font-bold mb-0.5">{caseStudy.stat2Value}</p>
              <p className="text-white/80 text-sm">{caseStudy.stat2Label}</p>
            </div>
            {caseStudy.industry && (
              <div className="text-center">
                <p className="text-white/80 text-sm font-semibold mb-0.5">Industry</p>
                <p className="text-white text-sm">{caseStudy.industry}</p>
              </div>
            )}
            {caseStudy.year && (
              <div className="text-center">
                <p className="text-white/80 text-sm font-semibold mb-0.5">Year</p>
                <p className="text-white text-sm">{caseStudy.year}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-border">
            <Image
              src={caseStudy.image || "/placeholder.svg"}
              alt={caseStudy.title}
              width={1000}
              height={600}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      {caseStudy.challenge && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              The <span className="text-[#E63946]">Challenge</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{caseStudy.challenge}</p>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {caseStudy.solution && (
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our <span className="text-[#E63946]">Solution</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">{caseStudy.solution}</p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <section className="py-16">
          <div className="site-container">
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.gallery.map((img, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-border">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    width={600}
                    height={400}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {caseStudy.results && caseStudy.results.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              The <span className="text-[#E63946]">Results</span>
            </h2>
            <ul className="space-y-4">
              {caseStudy.results.map((result, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-[#E63946] text-foreground rounded-full flex items-center justify-center shrink-0 font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground text-lg pt-1">{result}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {caseStudy.testimonial && (
        <section className="py-16 bg-card">
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-[#E63946] pl-8">
              <p className="text-foreground text-xl italic mb-6">&quot;{caseStudy.testimonial.quote}&quot;</p>
              <div>
                <p className="text-foreground font-semibold">{caseStudy.testimonial.author}</p>
                <p className="text-muted-foreground text-sm">
                  {caseStudy.testimonial.role}, {caseStudy.testimonial.company}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
