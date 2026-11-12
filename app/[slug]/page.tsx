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
import { isAdminOrSuperadmin } from "@/lib/admin-auth"

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

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    preview?: string
    token?: string
    preview_token?: string
  }>
}

async function getLandingPage(slug: string, isAuthorizedAdmin: boolean) {
  const client = await clientPromise
  const page = await client
    .db("sjmedialabs")
    .collection<LandingPageRecord>("landingPages")
    .findOne({ slug, template: "Template 1" })

  if (!page) return null

  // Published pages (status: "Enabled") are publicly visible to everyone
  if (page.status === "Enabled") {
    return page
  }

  // Unpublished / disabled pages are strictly restricted to authenticated admins & superadmins
  if (isAuthorizedAdmin) {
    return page
  }

  return null
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const isAuthorizedAdmin = await isAdminOrSuperadmin(query.token || query.preview_token)
  const page = await getLandingPage(slug, isAuthorizedAdmin)

  if (!page) {
    // Template preview metadata only available for authorized admins
    if (slug === "template-1" && isAuthorizedAdmin) {
      return {
        title: "Template 1 Preview | SJ Media Labs",
        description: "UI Template 1 section-by-section preview (CMS Preview)",
        robots: { index: false, follow: false },
      }
    }
    return {
      title: "Page not found",
      robots: { index: false, follow: false },
    }
  }

  const isUnpublished = page.status !== "Enabled"
  const seoTitle = page.seoData?.title?.trim() || page.title
  const description = page.seoData?.description?.trim()
  const keywords = page.seoData?.keywords
    ?.split(",")
    ?.map((keyword) => keyword.trim())
    ?.filter(Boolean)

  return {
    title: seoTitle,
    ...(description ? { description } : {}),
    ...(keywords?.length ? { keywords } : {}),
    ...(isUnpublished ? { robots: { index: false, follow: false } } : {}),
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
}: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const isAuthorizedAdmin = await isAdminOrSuperadmin(query.token || query.preview_token)
  const page = await getLandingPage(slug, isAuthorizedAdmin)

  if (!page) {
    // Blueprint templates are never public; only accessible to authorized admins/superadmins
    if (slug === "template-1" && isAuthorizedAdmin) {
      return (
        <>
          <div className="bg-[#161617] text-[#FCC50E] border-b border-[#FCC50E]/30 px-4 py-2 text-xs font-medium text-center sticky top-0 z-50 flex items-center justify-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>CMS Preview • Template 1 Blueprint</span>
            <span className="text-white/60">• Only visible to authenticated admins and superadmins</span>
          </div>
          <Template1Page />
        </>
      )
    }
    notFound()
  }

  const isUnpublished = page.status !== "Enabled"

  return (
    <>
      {isUnpublished && isAuthorizedAdmin && (
        <div className="bg-[#161617] text-[#FCC50E] border-b border-[#FCC50E]/30 px-4 py-2 text-xs font-medium text-center sticky top-0 z-50 flex items-center justify-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>CMS Preview • Unpublished Page ({page.status})</span>
          <span className="text-white/60">• Only visible to authenticated admins and superadmins</span>
        </div>
      )}
      <Template1Page
        data={page.sectionData}
        enabledSections={page.enabledSections}
      />
    </>
  )
}
