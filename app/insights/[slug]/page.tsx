import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { notFound } from "next/navigation"
import { clientPromise, ObjectId } from "@/lib/mongodb"
import { sanitizeHtml } from "@/lib/sanitize-html"
import { Breadcrumbs } from "@/components/breadcrumbs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function InsightDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params
  const { slug } = params

  let insight: any = null
  try {
    const client = await clientPromise
    const db = client.db("sjmedialabs")
    const bySlug = await db.collection("insights").findOne({ slug, published: true })
    if (bySlug) {
      insight = bySlug
    } else if (ObjectId.isValid(slug) && String(new ObjectId(slug)) === slug) {
      insight = await db.collection("insights").findOne({ _id: new ObjectId(slug), published: true })
    }
    if (insight) {
      insight = { ...insight, id: insight._id.toString() }
    }
  } catch (error) {
    console.error("Failed to fetch insight:", error)
  }

  if (!insight) notFound()

  const hasHtml = insight.content && /<[a-zA-Z][^>]*>/.test(insight.content)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="px-4 py-2 max-w-6xl mx-auto pt-20">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights" },
            { label: insight.title || "Article" },
          ]}
        />
      </section>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image
            src={insight.image || "/placeholder.svg"}
            alt={insight.title || ""}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {insight.category && <span className="text-[#E63946]">{insight.category}</span>}
          {insight.date && <span>{insight.date}</span>}
          {insight.readTime && <span>{insight.readTime}</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{insight.title}</h1>
        {insight.author && <p className="text-muted-foreground mb-8">By {insight.author}</p>}
        {insight.content ? (
          hasHtml ? (
            <div className="prose prose-invert max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(insight.content) }} />
          ) : (
            <p className="text-muted-foreground whitespace-pre-line">{insight.content}</p>
          )
        ) : insight.excerpt ? (
          <p className="text-muted-foreground">{insight.excerpt}</p>
        ) : null}
      </article>

      <Footer />
    </main>
  )
}
