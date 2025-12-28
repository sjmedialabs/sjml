import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { clientPromise } from "@/lib/mongodb"

interface WorkData {
  id: string
  slug: string
  title: string
  description: string
  image: string
  category: string
  client: string
  industry: string
  role: string
  technology: string
  year: string
  tags: string[]
  overview: { title: string; description: string; points: string[] }
  logoVariations: string[]
  gallery: string[]
  process: Array<{ step: string; title: string; description: string }>
  showcase: string[]
}

export const revalidate = 3600 // Enable ISR

// Generate static params for all works to pre-render them at build time
export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const works = await db.collection("works").find({}, { projection: { slug: 1 } }).toArray()
    return works.map((work) => ({
      slug: work.slug,
    }))
  } catch (e) {
    return []
  }
}

export default async function WorkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params
  let work: WorkData | null = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("works").findOne({ slug })
    if (data) {
      work = { ...data, id: data._id.toString() } as unknown as WorkData
    }
  } catch (error) {
    console.error("Failed to fetch work:", error)
  }

  if (!work) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
            <p className="text-[#888]">The project you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-black">
          <Image src={work.image || "/placeholder.svg"} alt={work.title} fill className="object-cover opacity-30" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 pt-16">
          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {work.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-transparent border border-[#444] rounded-full text-[#888] text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">{work.title}</h1>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {work.industry && (
              <div className="text-center">
                <p className="text-[#666] text-xs mb-1">Industry</p>
                <p className="text-white text-sm">{work.industry}</p>
              </div>
            )}
            {work.role && (
              <div className="text-center">
                <p className="text-[#666] text-xs mb-1">Role</p>
                <p className="text-white text-sm">{work.role}</p>
              </div>
            )}
            {work.technology && (
              <div className="text-center">
                <p className="text-[#666] text-xs mb-1">Technology</p>
                <p className="text-white text-sm">{work.technology}</p>
              </div>
            )}
            {work.year && (
              <div className="text-center">
                <p className="text-[#666] text-xs mb-1">Year</p>
                <p className="text-white text-sm">{work.year}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Overview Section */}
      {work.overview && (work.overview.description || work.overview.points?.length > 0) && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#E63946] mb-6">{work.overview.title || "Brand Overview"}</h2>
            </div>
            <div>
              {work.overview.description && (
                <p className="text-[#888] mb-6 leading-relaxed">{work.overview.description}</p>
              )}
              {work.overview.points && work.overview.points.length > 0 && (
                <ul className="space-y-3">
                  {work.overview.points.map((point, index) => (
                    <li key={index} className="flex items-center gap-3 text-white">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {work.gallery && work.gallery.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 overflow-x-auto pb-4">
              {work.gallery.map((img, index) => (
                <div key={index} className="shrink-0 w-40 h-48 rounded-lg overflow-hidden">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Gallery image ${index + 1}`}
                    width={160}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Description */}
      {work.description && (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-white text-xl leading-relaxed">{work.description}</p>
          </div>
        </section>
      )}

      {/* Process Section */}
      {work.process && work.process.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">
              Our <span className="text-[#E63946]">Process</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {work.process.map((step, index) => (
                <div key={index}>
                  <p className="text-[#E63946] text-sm mb-2">{step.step}.</p>
                  <h3 className="text-white font-semibold mb-3">{step.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Large Image */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-[#E63946]/30">
            <Image
              src={work.image || "/placeholder.svg"}
              alt={work.title}
              width={1000}
              height={500}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
