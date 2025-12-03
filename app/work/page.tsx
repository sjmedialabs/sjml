import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"

export const dynamic = "force-dynamic"
export const revalidate = 0

function FlowerDecoration() {
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" fill="none" className="text-teal-400">
      <path
        d="M100 75 C120 45, 160 35, 180 55 C160 45, 150 65, 140 85 C150 65, 170 55, 190 65"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M100 75 C80 45, 40 35, 20 55 C40 45, 50 65, 60 85 C50 65, 30 55, 10 65"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path d="M100 75 C100 45, 90 15, 70 5 C90 25, 100 45, 100 75" stroke="currentColor" strokeWidth="2" fill="none" />
      <path
        d="M100 75 C100 45, 110 15, 130 5 C110 25, 100 45, 100 75"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="100" cy="85" rx="8" ry="12" fill="currentColor" />
    </svg>
  )
}

export default async function WorkPage() {
  let projects: any[] = []
  let content

  try {
    // Fetch page content
    content = await getPageContent("work")
    if (!content) {
      throw new Error("Work page content not found")
    }

    // Fetch works directly from MongoDB
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const works = await db.collection("works").find({ isActive: true }).sort({ createdAt: -1 }).toArray()
    
    // Serialize MongoDB _id
    projects = works.map(work => ({
      ...work,
      _id: work._id.toString()
    }))
  } catch (error) {
    console.error("Failed to fetch works:", error)
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Available</h1>
          <p className="text-[#888]">Work page content has not been set up yet. Please contact the administrator.</p>
        </div>
      </main>
    )
  }

  const hero = content.hero
  const portfolio = content.portfolio

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
                {hero.title.split(" ").slice(0, 1).join(" ")}
                <br />
                {hero.title.split(" ").slice(1).join(" ")}
              </h1>
              <p className="text-[#888] leading-relaxed">
                {hero.subtitle}
                <br />
                <br />
                {hero.description}
              </p>
            </div>
            <div className="flex justify-end">
              <FlowerDecoration />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] italic mb-4">{portfolio.title}</h2>
            <p className="text-[#888] max-w-2xl mx-auto">{portfolio.description}</p>
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
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <Link
                    href={`/work/${project.slug}`}
                    className="block w-full py-3 bg-[#E63946] text-white text-center rounded-full text-sm font-medium hover:bg-[#d62839] transition-colors"
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
