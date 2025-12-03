"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { InsightDownloadModal } from "@/components/insight-download-modal"

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

interface InsightCardProps {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleReadMore = () => {
    if (insight.pdfUrl) {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
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
          <Button 
            onClick={handleReadMore}
            className="w-full bg-[#E63946] hover:bg-[#d32f3d] text-white rounded-xl py-5"
          >
            Read More
          </Button>
        </div>
      </div>

      {/* Download Modal */}
      <InsightDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfUrl={insight.pdfUrl || ""}
        insightTitle={insight.title}
      />
    </>
  )
}
