import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { Document } from "mongodb"
import { Template1Page } from "@/components/template-1/template-1-page"
import type {
  Template1PageData,
  Template1SectionVisibility,
} from "@/components/template-1/default-data"
import { clientPromise } from "@/lib/mongodb"
import type { LandingPageSeo } from "@/lib/landing-pages"

export const dynamic = "force-dynamic"

interface LandingPageRecord extends Document {
  title: string
  slug: string
  template: string
  status: string
  sectionData?: Template1PageData
  enabledSections?: Template1SectionVisibility
  seoData?: LandingPageSeo
}

async function getLandingPage(slug: string, preview: boolean) {
  const client = await clientPromise
  const page = await client
    .db("sjmedialabs")
    .collection<LandingPageRecord>("landingPages")
    .findOne({ slug, template: "Template 1" })
  return page?.status === "Enabled" || preview ? page : null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = await getLandingPage(slug, query.preview === "1")
  if (!page) return { title: "Page not found" }

  const seoTitle = page.seoData?.title.trim() || page.title
  const description = page.seoData?.description.trim()
  const keywords = page.seoData?.keywords
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)

  return {
    title: seoTitle,
    ...(description ? { description } : {}),
    ...(keywords?.length ? { keywords } : {}),
    openGraph: {
      title: seoTitle,
      ...(description ? { description } : {}),
      ...(page.seoData?.ogImage
        ? { images: [{ url: page.seoData.ogImage }] }
        : {}),
    },
  }
}

export default async function LandingPageRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = await getLandingPage(slug, query.preview === "1")
  if (!page) notFound()

  return (
    <Template1Page
      data={page.sectionData}
      enabledSections={page.enabledSections}
    />
  )
}
