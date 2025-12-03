"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  salary: string
  published: boolean
}

interface CareersData {
  heroTitle: string
  heroSubtitle: string
  culture: {
    title: string
    description: string
    values: Array<{ title: string; description: string }>
  }
  benefits: Array<{ icon: string; title: string; description: string }>
  jobs: JobPosting[]
}


export default function CareersPage() {
  const [data, setData] = useState<CareersData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/content/careers")
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        const fetchedData = await res.json()
        setData(fetchedData)
      } catch (error) {
        console.error("Failed to fetch careers data:", error)
        setError("Failed to load page content. Please contact the administrator.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])


  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Content Not Available</h1>
          <p className="text-[#888]">{error || "Page content has not been set up yet."}</p>
        </div>
      </main>
    )
  }

  // Filter only published jobs
  const publishedJobs = data.jobs?.filter((job) => job.published) || []

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {data.heroTitle.split(" ").map((word, i) =>
              word.toLowerCase() === "team" ? (
                <span key={i} className="text-[#E63946]">
                  {word}{" "}
                </span>
              ) : (
                word + " "
              ),
            )}
          </h1>
          <p className="text-xl text-[#888] max-w-3xl mx-auto">{data.heroSubtitle}</p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{data.culture.title}</h2>
            <p className="text-[#888] leading-relaxed">{data.culture.description}</p>
          </div>
          <div>
            {data.culture.image && (
              <img src={data.culture.image} alt="Our Team" className="rounded-2xl w-full" />
            )}
          </div>
        </div>
      </section>

      {/* Benefits */}
      {data.benefits.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Benefits & <span className="text-[#E63946]">Perks</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {data.benefits.map((benefit, index) => (
                <div key={index} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 bg-[#E63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-[#E63946]">{benefit.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-[#888] text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Open Positions */}
      <section className="py-16 px-4 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Open <span className="text-[#E63946]">Positions</span>
          </h2>
          <p className="text-[#888] text-center mb-12">Find your next opportunity with us</p>

          {publishedJobs.length > 0 ? (
            <div className="space-y-4">
              {publishedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-black border border-[#1a1a1a] rounded-xl p-6 hover:border-[#E63946]/50 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#E63946] transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-[#888] text-sm mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-xs rounded-full">
                          <Briefcase size={12} />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-xs rounded-full">
                          <MapPin size={12} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E63946]/20 text-[#E63946] text-xs rounded-full">
                          <Clock size={12} />
                          {job.type}
                        </span>
                        {job.salary && (
                          <span className="px-3 py-1.5 bg-[#1a1a1a] text-[#888] text-xs rounded-full">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/careers/${job.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white rounded-full hover:bg-[#d62839] transition-colors whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-black border border-[#1a1a1a] rounded-xl">
              <Briefcase className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <p className="text-[#888]">No open positions at the moment.</p>
              <p className="text-[#666] text-sm mt-2">Check back later or send us your resume.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {data.cta && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{data.cta.title}</h2>
            <p className="text-[#888] mb-8">{data.cta.description}</p>
            <a
              href={`mailto:${data.cta.email}`}
              className="inline-block px-8 py-4 bg-[#0d0d0d] border border-[#333] text-white rounded-full font-medium hover:border-[#E63946] transition-colors"
            >
              {data.cta.buttonText}
            </a>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
