"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CaseStudyLeadPopup } from "./case-study-lead-popup"

function TrendIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M2 12L6 8L9 11L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

interface Study {
  _id?: string
  id?: string
  slug: string
  title: string
  description?: string
  image?: string
  tags?: string[]
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  visibility?: "public" | "private"
}

interface CaseStudiesGridProps {
  studies: Study[]
}

export function CaseStudiesGrid({ studies }: CaseStudiesGridProps) {
  const [leadSlug, setLeadSlug] = useState<string | null>(null)
  const router = useRouter()

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {studies.map((study) => (
          <div key={study.id || study._id || study.slug} className="bg-white rounded-2xl overflow-hidden">
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
              <div className="flex flex-wrap gap-2 mb-3">
                {(study.tags || []).map((tag: string, index: number) => (
                  <span key={index} className="px-2.5 py-0.5 bg-[#E63946]/10 text-[#E63946] text-[10px] rounded-full border border-[#E63946]/20">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{study.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{study.description}</p>
              <div className="flex gap-4 mb-4 text-gray-500 text-xs">
                <span className="flex items-center gap-1">
                  <TrendIcon /> {study.stat1Value} {study.stat1Label}
                </span>
                <span className="flex items-center gap-1">
                  <ClockIcon /> {study.stat2Value} {study.stat2Label}
                </span>
              </div>
              {study.visibility === "private" ? (
                <button
                  type="button"
                  onClick={() => setLeadSlug(study.slug)}
                  className="block w-full py-3 bg-[#E63946] text-foreground text-center rounded-full text-sm font-medium hover:bg-[#d62839] transition-colors"
                >
                  View Case Study
                </button>
              ) : (
                <Link
                  href={`/case-studies/${study.slug}`}
                  className="block w-full py-3 bg-[#E63946] text-foreground text-center rounded-full text-sm font-medium hover:bg-[#d62839] transition-colors"
                >
                  View Case Study
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <CaseStudyLeadPopup
        isOpen={leadSlug !== null}
        onClose={() => setLeadSlug(null)}
        caseStudySlug={leadSlug || ""}
        onSuccess={() => router.push("/case-studies/" + leadSlug)}
      />
    </>
  )
}
