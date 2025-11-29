import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { getPageContent } from "@/lib/models/content"
import { getDefaultPageContent } from "@/lib/defaults"

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

const defaultCaseStudies = [
  {
    id: "1",
    slug: "techcorp-rebranding",
    title: "TechCorp Global Rebranding",
    description: "Complete brand transformation.",
    image: "/tech-branding-project.jpg",
    tags: ["Branding", "Strategy"],
    stat1Label: "Growth",
    stat1Value: "250%",
    stat2Label: "Duration",
    stat2Value: "6 Months",
  },
]

export default async function CaseStudiesPage() {
  let data

  try {
    data = await getPageContent("case-studies")
    if (!data) {
      data = getDefaultPageContent("case-studies")
    }
  } catch (error) {
    console.error("Failed to fetch case-studies content:", error)
    data = getDefaultPageContent("case-studies")
  }

  const hero = data?.hero || {
    title: "Elevate Beyond the Ordinary.",
    subtitle: "We're a creative agency dedicated to design that moves brands from good to unforgettable.",
    description: "We craft everything from branding and web design to 3D, motion, and UI/UX.",
  }

  const section = data?.section || {
    title: "Featured Case Studies",
    description: "Discover how we've helped brands achieve extraordinary results.",
  }

  const caseStudies = data?.caseStudies?.length ? data.caseStudies : defaultCaseStudies

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Hero Section */}
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

      {/* Case Studies Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#E63946] italic mb-4">{section.title}</h2>
            <p className="text-[#888] max-w-2xl mx-auto">{section.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {caseStudies.map((study: any) => (
              <div key={study.id} className="bg-white rounded-2xl overflow-hidden">
                <div className="relative">
                  <Image
                    src={study.image || "/placeholder.svg"}
                    alt={study.title}
                    width={400}
                    height={300}
                    className="w-full aspect-[4/3] object-cover"
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
