import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
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

export const revalidate = 3600 // Enable ISR

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
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-[#0a0a0a]">
          <Image
            src={caseStudy.image || "/placeholder.svg"}
            alt={caseStudy.title}
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-16">
          {/* Tags */}
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {caseStudy.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-[#E63946]/10 text-[#E63946] rounded-full text-xs border border-[#E63946]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">{caseStudy.title}</h1>
          <p className="text-xl text-[#888] text-center max-w-3xl mx-auto mb-12">{caseStudy.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-[#E63946] text-3xl font-bold mb-1">{caseStudy.stat1Value}</p>
              <p className="text-[#888] text-sm">{caseStudy.stat1Label}</p>
            </div>
            <div className="text-center">
              <p className="text-[#E63946] text-3xl font-bold mb-1">{caseStudy.stat2Value}</p>
              <p className="text-[#888] text-sm">{caseStudy.stat2Label}</p>
            </div>
            {caseStudy.industry && (
              <div className="text-center">
                <p className="text-white text-sm font-semibold mb-1">Industry</p>
                <p className="text-[#888] text-sm">{caseStudy.industry}</p>
              </div>
            )}
            {caseStudy.year && (
              <div className="text-center">
                <p className="text-white text-sm font-semibold mb-1">Year</p>
                <p className="text-[#888] text-sm">{caseStudy.year}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-[#222]">
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
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              The <span className="text-[#E63946]">Challenge</span>
            </h2>
            <p className="text-[#888] text-lg leading-relaxed">{caseStudy.challenge}</p>
          </div>
        </section>
      )}

      {/* Solution Section */}
      {caseStudy.solution && (
        <section className="py-16 px-4 bg-[#111]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              Our <span className="text-[#E63946]">Solution</span>
            </h2>
            <p className="text-[#888] text-lg leading-relaxed">{caseStudy.solution}</p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {caseStudy.gallery && caseStudy.gallery.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.gallery.map((img, index) => (
                <div key={index} className="rounded-2xl overflow-hidden border border-[#222]">
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
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">
              The <span className="text-[#E63946]">Results</span>
            </h2>
            <ul className="space-y-4">
              {caseStudy.results.map((result, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="w-8 h-8 bg-[#E63946] text-white rounded-full flex items-center justify-center shrink-0 font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-[#888] text-lg pt-1">{result}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {caseStudy.testimonial && (
        <section className="py-16 px-4 bg-[#111]">
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-[#E63946] pl-8">
              <p className="text-white text-xl italic mb-6">&quot;{caseStudy.testimonial.quote}&quot;</p>
              <div>
                <p className="text-white font-semibold">{caseStudy.testimonial.author}</p>
                <p className="text-[#888] text-sm">
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
