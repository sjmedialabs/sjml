import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CaseStudy {
  id: string
  slug?: string
  title: string
  description: string
  image: string
  tags: string[]
  stat1Label?: string
  stat1Value?: string
  stat2Label?: string
  stat2Value?: string
  stat1?: string
  stat2?: string
}

// Case studies are now fully dynamic from the database

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

interface CaseStudiesSectionProps {
  data?: CaseStudy[] | null
  backgroundImage?: string
}

export function CaseStudiesSection({ data, backgroundImage }: CaseStudiesSectionProps) {
  const caseStudies = data || []

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E63946] italic mb-4">Case Studies</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore our portfolio of successful brand transformations and digital experiences.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="group bg-[#111] rounded-2xl overflow-hidden border border-[#222] hover:border-[#E63946]/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={study.image || "/placeholder.svg?height=300&width=400&query=case study"}
                  alt={study.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {study.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#E63946] transition-colors">
                  {study.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{study.description}</p>

                {/* Stats */}
                <div className="flex gap-6 mb-4">
                  {(study.stat1Value || study.stat1) && (
                    <div>
                      <div className="text-[#E63946] font-bold text-lg">{study.stat1Value || study.stat1}</div>
                      <div className="text-gray-500 text-xs">{study.stat1Label || "Metric"}</div>
                    </div>
                  )}
                  {(study.stat2Value || study.stat2) && (
                    <div>
                      <div className="text-[#E63946] font-bold text-lg">{study.stat2Value || study.stat2}</div>
                      <div className="text-gray-500 text-xs">{study.stat2Label || "Metric"}</div>
                    </div>
                  )}
                </div>

                {/* Link */}
                <Link
                  href={`/case-studies/${study.slug || study.id}`}
                  className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-[#E63946] transition-colors"
                >
                  View Case Study
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/case-studies">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black rounded-full px-8 bg-transparent"
            >
              View All Case Studies
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
