import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Insight {
  id: string
  title: string
  description?: string
  excerpt?: string
  image: string
  date: string
  category: string
  readTime?: string
}

// Insights are now fully dynamic from the database

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

interface InsightsSectionProps {
  data?: Insight[] | null
  backgroundImage?: string
}

export function InsightsSection({ data, backgroundImage }: InsightsSectionProps) {
  const insights = data || []

  return (
    <section className="relative py-20 bg-[#0a0a0a]">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black/85" />
        </div>
      )}

      {/* Decorative curved lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-16 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0,30 Q100,0 200,30 T400,30" stroke="#444" strokeWidth="1" fill="none" />
          <path d="M0,40 Q100,10 200,40 T400,40" stroke="#444" strokeWidth="1" fill="none" />
        </svg>
      </div>
      <div className="absolute top-0 right-8 w-24 h-24 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="#444" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#E63946] italic mb-4">Latest Insights</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Expert perspectives on branding, marketing, and digital transformation.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-white rounded-2xl overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative h-56">
                <Image
                  src={insight.image || "/placeholder.svg?height=300&width=400&query=" + insight.title}
                  alt={insight.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Meta Row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 border border-[#E63946]/30 text-[#E63946] text-[11px] font-medium rounded-full">
                    {insight.category}
                  </span>
                  <span className="text-gray-400 text-[11px]">{insight.date}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <ClockIcon className="w-3 h-3" />
                    <span className="text-[11px]">{insight.readTime || "5 min read"}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-gray-900 text-lg font-bold mb-2 leading-tight">{insight.title}</h3>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-3">{insight.excerpt || insight.description}</p>

                {/* Button */}
                <Button className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-xl py-5">Read More</Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <a href="#" className="text-white font-medium hover:text-[#E63946] transition-colors">
            View All Insights
          </a>
        </div>
      </div>
    </section>
  )
}
