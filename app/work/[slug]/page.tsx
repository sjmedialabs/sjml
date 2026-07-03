import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { normalizeWorkDetailTemplate } from "@/lib/work-detail-template"
import { WorkDetailView } from "@/components/work-detail/work-detail-view"
import { generateSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const works = await db.collection("works").find({}, { projection: { slug: 1 } }).toArray()
    return works.map((work) => ({ slug: work.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const work = await db.collection("works").findOne({ slug })
    if (work) {
      const base = await generateSeoMetadata("Work")
      return {
        ...base,
        title: `${work.title} | ${typeof base.title === "string" ? base.title.split("|").pop()?.trim() || "SJ Media Labs" : "SJ Media Labs"}`,
        description: (work.description as string) || base.description,
        openGraph: {
          ...base.openGraph,
          title: work.title as string,
          description: ((work.description as string) || base.description) ?? undefined,
          images: work.image ? [work.image as string] : base.openGraph?.images,
        },
      }
    }
  } catch {
    /* fall through */
  }
  return generateSeoMetadata("Work")
}

export default async function WorkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  let work: Record<string, unknown> | null = null

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("works").findOne({ slug })
    if (data) {
      work = { ...data, id: data._id?.toString() ?? data.id }
    }
  } catch (error) {
    console.error("Failed to fetch work:", error)
  }

  if (!work || work.isActive === false) {
    notFound()
  }

  const title = work.title as string
  const template = normalizeWorkDetailTemplate(work, title)

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <WorkDetailView title={title} template={template} />
      <Footer />
    </main>
  )
}
