import { getCollection } from "./mongodb"
import type { Metadata } from "next"

export const SITE_URL = "https://sjmedialabs.com"

const PAGE_SEO: Record<string, { title: string; description: string; path: string }> = {
  Home: {
    title: "Best Digital Marketing Agency in Hyderabad",
    description: "Looking for the best digital marketing agency in Hyderabad, India? SJ Media Labs delivers SEO, social, web design, and performance marketing.",
    path: "/",
  },
  About: {
    title: "About | SJ Media Labs",
    description: "Meet SJ Media Labs, a Hyderabad agency for brand strategy, design, and digital marketing.",
    path: "/about",
  },
  Services: {
    title: "Branding & Digital Marketing Services | SJ Media Labs",
    description: "Branding, advertising, digital marketing, web experience, motion, packaging, and media planning from SJ Media Labs.",
    path: "/services",
  },
  Industries: {
    title: "Industries | SJ Media Labs",
    description: "How SJ Media Labs helps brands in different industries with marketing, design, and digital experience.",
    path: "/industries",
  },
  Work: {
    title: "Our Work | SJ Media Labs",
    description: "Selected branding, campaign, and digital projects delivered by SJ Media Labs.",
    path: "/work",
  },
  Contact: {
    title: "Contact Us | SJ Media Labs",
    description: "Contact SJ Media Labs about a brand, campaign, or website. Send a message or call the studio.",
    path: "/contact",
  },
  Clients: {
    title: "Clients | SJ Media Labs",
    description: "Brands that work with SJ Media Labs on marketing, design, and digital projects.",
    path: "/clients",
  },
  Careers: {
    title: "Careers | SJ Media Labs",
    description: "Open roles at SJ Media Labs in design, marketing, and digital production.",
    path: "/careers",
  },
  Privacy: {
    title: "Privacy Policy | SJ Media Labs",
    description: "How SJ Media Labs collects, uses, and protects personal information.",
    path: "/privacy",
  },
  Terms: {
    title: "Terms of Service | SJ Media Labs",
    description: "Terms that apply when you use the SJ Media Labs website and services.",
    path: "/terms",
  },
  Cookies: {
    title: "Cookie Policy | SJ Media Labs",
    description: "How SJ Media Labs uses cookies and similar technologies on this website.",
    path: "/cookies",
  },
  Insights: {
    title: "Insights | SJ Media Labs",
    description: "Read SJ Media Labs articles on branding, digital marketing, web design, and the strategy behind campaigns that help brands grow.",
    path: "/insights",
  },
  "Case Studies": {
    title: "Case Studies | SJ Media Labs",
    description: "Case studies showing how SJ Media Labs plans and delivers brand and marketing work.",
    path: "/case-studies",
  },
}

export interface SeoData {
  globalTitle: string
  globalDescription: string
  favicon: string
  ogImage: string
  twitterHandle: string
  googleAnalyticsId: string
  pages: Array<{
    page: string
    title: string
    description: string
    keywords: string
    ogImage: string
  }>
}

export async function getSeoData(): Promise<SeoData | null> {
  try {
    const collection = await getCollection("content")
    const seoData = await collection.findOne({ pageKey: "seo" })
    return seoData as SeoData | null
  } catch (error) {
    console.error("Failed to fetch SEO data:", error)
    return null
  }
}

export async function getPageSeo(pageName: string): Promise<any | null> {
  try {
    const seoData = await getSeoData()
    if (!seoData) return null
    
    const pageSeo = seoData.pages?.find(
      (p) => p.page.toLowerCase() === pageName.toLowerCase()
    )
    
    return pageSeo || null
  } catch (error) {
    console.error(`Failed to fetch SEO for page ${pageName}:`, error)
    return null
  }
}

export async function generateSeoMetadata(
  pageName: string,
  override?: { title?: string; description?: string; path?: string }
): Promise<Metadata> {
  const seoData = await getSeoData()
  const pageSeo = seoData?.pages?.find(
    (p) => p.page.toLowerCase() === pageName.toLowerCase()
  )
  const defaults = PAGE_SEO[pageName]
  const globalTitle = (seoData?.globalTitle || "").trim()
  const globalDescription = (seoData?.globalDescription || "").trim()
  const adminTitle = (pageSeo?.title || "").trim()
  const adminDescription = (pageSeo?.description || "").trim()
  const title =
    (override?.title || "").trim() ||
    (adminTitle && (pageName === "Home" || adminTitle !== globalTitle) ? adminTitle : "") ||
    defaults?.title ||
    `${pageName} | SJ Media Labs`
  const description =
    (override?.description || "").trim() ||
    (adminDescription && (pageName === "Home" || adminDescription !== globalDescription) ? adminDescription : "") ||
    defaults?.description ||
    globalDescription ||
    "SJ Media Labs"
  const path = override?.path || defaults?.path || "/"
  const canonical = new URL(path, SITE_URL).toString()
  const ogImage = pageSeo?.ogImage || seoData?.ogImage || "/og-image.jpg"
  const keywords = pageSeo?.keywords || ""
  const favicon = seoData?.favicon?.trim() || "/favicon.ico"

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    alternates: { canonical },
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: seoData?.twitterHandle || "@sjmedialabs",
    },
    robots: { index: true, follow: true },
  }
}
