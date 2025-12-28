import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, CheckCircle } from "lucide-react"
import Link from "next/link"
import { getPageContent, type CareersPageData } from "@/lib/models/content"
import { JobApplicationForm } from "@/components/job-application-form"
import { notFound } from "next/navigation"

export const revalidate = 3600 // Enable ISR

// Pre-render all published job pages at build time
export async function generateStaticParams() {
  try {
    const data = (await getPageContent("careers")) as CareersPageData | null
    if (!data?.jobs) return []
    return data.jobs.filter((j) => j.published).map((j) => ({ id: j.id }))
  } catch (e) {
    return []
  }
}

export default async function JobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  let job: any = null

  try {
    const data = (await getPageContent("careers")) as CareersPageData | null
    job = data?.jobs?.find((j) => j.id === params.id && j.published)
  } catch (error) {
    console.error("Failed to fetch job details:", error)
  }

  if (!job) {
    notFound()
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
                  {job.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-[#888]">
                      <CheckCircle size={16} className="text-[#E63946] mt-1 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && (job.benefits as string[]).length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {(job.benefits as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-[#888]">
                      <CheckCircle size={16} className="text-[#E63946] mt-1 shrink-0" />
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
              <JobApplicationForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
