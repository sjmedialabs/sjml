import Link from "next/link"
import { InsightCard } from "@/components/insight-card"

interface Insight {
  id: string
  slug?: string
  title: string
  description?: string
  excerpt?: string
  image: string
  date: string
  category: string
  readTime?: string
  pdfUrl?: string
}

// Insights are now fully dynamic from the database

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
        />
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
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link href="/insights" className="text-white font-medium hover:text-[#E63946] transition-colors">
            View All Insights
          </Link>
        </div>
      </div>
    </section>
  )
}
