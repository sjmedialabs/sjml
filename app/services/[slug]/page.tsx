import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notFound, redirect } from "next/navigation"
import { clientPromise } from "@/lib/mongodb"
import { normalizeServiceDetailTemplate } from "@/lib/service-detail-template"
import { ServiceDetailLayout } from "@/components/services/service-detail-layout"
import { sortByDisplayOrder } from "@/lib/service-order"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function generateStaticParams() {
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const services = await db.collection("services").find({}, { projection: { slug: 1 } }).toArray()
    return services.map((service) => ({ slug: service.slug as string }))
  } catch {
    return []
  }
}

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  let service: Record<string, unknown> | null = null
  let subServices: Array<{ slug: string; name: string }> = []

  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const data = await db.collection("services").findOne({ slug })
    if (data) {
      service = { ...data, id: data._id.toString() }
    }
    const subs = await db.collection("sub-services").find({ parentSlug: slug, isActive: true }).toArray()
    subServices = sortByDisplayOrder(subs as Array<{ displayOrder?: unknown; slug: string; name: string }>).map((s) => ({
      slug: s.slug,
      name: s.name,
    }))
  } catch (error) {
    console.error("Failed to fetch service:", error)
  }

  if (!service) notFound()

  if (subServices.length > 0) {
    redirect(`/services/${slug}/${subServices[0].slug}`)
  }

  const title = service.title as string
  const template = normalizeServiceDetailTemplate(service, title, title)

  return (
    <main className="site-page min-h-screen bg-white">
      <Header />
      <ServiceDetailLayout
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: title },
        ]}
        parentTitle={template.categoryLabel || title.toUpperCase()}
        parentSlug={slug}
        navItems={[]}
        template={template}
      />
      <Footer />
    </main>
  )
}
