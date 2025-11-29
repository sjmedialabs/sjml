"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, CheckCircle } from "lucide-react"
import Link from "next/link"

interface JobPosting {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  benefits: string[]
  salary: string
  published: boolean
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch("/api/content/careers")
        if (res.ok) {
          const data = await res.json()
          const foundJob = data.jobs?.find((j: JobPosting) => j.id === params.id && j.published)
          if (foundJob) {
            setJob(foundJob)
          } else {
            router.push("/careers")
          }
        }
      } catch (error) {
        console.error("Failed to fetch job")
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#E63946]/30 border-t-[#E63946] rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (!job) {
    return null
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Back Link */}
      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-[#888] hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Careers
          </Link>
        </div>
      </div>

      {/* Job Header */}
      <section className="pt-8 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-2 text-[#888]">
              <Briefcase size={16} className="text-[#E63946]" />
              {job.department}
            </span>
            <span className="flex items-center gap-2 text-[#888]">
              <MapPin size={16} className="text-[#E63946]" />
              {job.location}
            </span>
            <span className="flex items-center gap-2 text-[#888]">
              <Clock size={16} className="text-[#E63946]" />
              {job.type}
            </span>
            {job.salary && (
              <span className="flex items-center gap-2 text-[#888]">
                <DollarSign size={16} className="text-[#E63946]" />
                {job.salary}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-12">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-4">About the Role</h2>
              <p className="text-[#888] leading-relaxed">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#888]">
                      <CheckCircle size={16} className="text-[#E63946] mt-1 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#888]">
                      <CheckCircle size={16} className="text-[#E63946] mt-1 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Apply Now</h2>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Application Submitted!</h3>
                  <p className="text-[#888] text-sm">We'll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Resume/LinkedIn URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.resume}
                      onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                      placeholder="https://"
                      className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#888] mb-2">Cover Letter</label>
                    <textarea
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      placeholder="Tell us why you're interested..."
                      className="w-full px-4 py-3 bg-black border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#E63946] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#E63946] text-white rounded-lg hover:bg-[#d62839] transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
