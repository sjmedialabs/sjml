import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { normalizeServiceDetailTemplate } from "@/lib/service-detail-template"
import { normalizeSubServiceMeta } from "@/lib/sub-service-document"
import { ServiceDetailLayout } from "@/components/services/service-detail-layout"
import { sortByDisplayOrder } from "@/lib/service-order"
import { generateSeoMetadata } from "@/lib/seo"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateMetadata(props: {
  params: Promise<{ slug: string; subslug: string }>
}): Promise<Metadata> {
  const { slug: parentSlug, subslug } = await props.params
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const sub = await db.collection("sub-services").findOne({ parentSlug, slug: subslug, isActive: true })
    if (sub) {
      const meta = normalizeSubServiceMeta(sub as Record<string, unknown>, String(sub.name ?? ""))
      const base = await generateSeoMetadata("Services")
      const siteName =
        typeof base.title === "string" ? base.title.split("|").pop()?.trim() || "SJ Media Labs" : "SJ Media Labs"
      const title = meta.metaTitle.includes("|") ? meta.metaTitle : `${meta.metaTitle} | ${siteName}`
      const description = meta.metaDescription || base.description
      const image = String(sub.bannerImage ?? "").trim() || undefined
      return {
        ...base,
        title,
        description,
        openGraph: {
          ...base.openGraph,
          title: meta.metaTitle,
          description: description ?? undefined,
          images: image ? [image] : base.openGraph?.images,
        },
        twitter: {
          ...base.twitter,
          title: meta.metaTitle,
          description: description ?? undefined,
          images: image ? [image] : base.twitter?.images,
        },
      }
    }
  } catch {
    /* fall through */
  }
  return generateSeoMetadata("Services")
}

export default async function SubServiceDetailPage(props: {
  params: Promise<{ slug: string; subslug: string }>
}) {
  const { slug: parentSlug, subslug } = await props.params

  let parent: { title: string } | null = null
  let sub: Record<string, unknown> | null = null
  let subServices: Array<{ slug: string; name: string }> = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const parentDoc = await db.collection("services").findOne({ slug: parentSlug }, { projection: { title: 1 } })
    parent = parentDoc ? { title: parentDoc.title as string } : null
    const subDoc = await db.collection("sub-services").findOne({ parentSlug, slug: subslug, isActive: true })
    sub = subDoc ? { ...subDoc, id: subDoc._id.toString() } : null
    const subs = await db.collection("sub-services").find({ parentSlug, isActive: true }).toArray()
    subServices = sortByDisplayOrder(subs as Array<{ displayOrder?: unknown; slug: string; name: string }>).map((s) => ({
      slug: s.slug,
      name: s.name,
    }))
  } catch (error) {
    console.error("Failed to fetch sub-service:", error)
  }

  if (!parent || !sub) notFound()

  const name = sub.name as string
  const categoryLabel = parent.title.toUpperCase()
  const template = normalizeServiceDetailTemplate(sub, name, categoryLabel)

  const navItems = subServices.map((item) => ({
    slug: item.slug,
    name: item.name,
    href: `/services/${parentSlug}/${item.slug}`,
    active: item.slug === subslug,
  }))

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <ServiceDetailLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: parent.title, href: `/services/${parentSlug}` },
          { label: name },
        ]}
        parentTitle={categoryLabel}
        parentSlug={parentSlug}
        navItems={navItems}
        template={template}
      />
      <Footer />
    </main>
  )
}
