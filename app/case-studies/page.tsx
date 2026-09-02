import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { clientPromise } from "@/lib/mongodb"
import { getPageContent } from "@/lib/models/content"
import { CaseStudiesHeroSection } from "@/components/case-studies/case-studies-hero-section"
import { CaseStudiesGridSection, type CaseStudyCardItem } from "@/components/case-studies/case-studies-grid-section"
import { generateSeoMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata() {
  return await generateSeoMetadata("Case Studies")
}

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudyCardItem[] = []
  let content: any = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")

    const [rawContent, studiesData] = await Promise.all([
      getPageContent("case-studies"),
      db.collection("case-studies").find({}).sort({ createdAt: -1 }).toArray(),
    ])

    content = rawContent

    caseStudies = studiesData.map((doc: any) => ({
      id: doc._id?.toString() || doc.id || doc.slug,
      slug: doc.slug || "",
      title: doc.title || "",
      description: doc.description || "",
      image: doc.image || "/placeholder.svg",
      tags: Array.isArray(doc.tags) ? doc.tags : doc.tags ? [doc.tags] : ["Case Study"],
      client: doc.client || "",
      industry: doc.industry || "",
      year: doc.year || "",
      pdfUrl: doc.pdfUrl || "",
      stat1Value: doc.stat1Value || doc.stats?.[0]?.value || "",
      stat1Label: doc.stat1Label || doc.stats?.[0]?.label || "",
      stat2Value: doc.stat2Value || doc.stats?.[1]?.value || "",
      stat2Label: doc.stat2Label || doc.stats?.[1]?.label || "",
    }))
  } catch (error) {
    console.error("Failed to fetch case studies:", error)
  }

  const heroTitle = content?.hero?.title || content?.heroTitle || "Case Studies"
  const heroHighlight = content?.hero?.subtitle || "Extraordinary Results"
  const heroDescription =
    content?.hero?.description ||
    content?.heroSubtitle ||
    "Discover how we help leading brands achieve extraordinary results through strategy, innovation, and creative execution."
  const heroImage = content?.hero?.image || content?.heroImage || ""

  const categories = content?.categories?.length
    ? content.categories
    : ["All", "Branding", "Digital Marketing", "Web Development", "Advertising"]

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <CaseStudiesHeroSection
        title={heroTitle}
        titleHighlight={heroHighlight}
        description={heroDescription}
        image={heroImage}
      />
      <CaseStudiesGridSection studies={caseStudies} categories={categories} />
      <Footer />
    </main>
  )
}
