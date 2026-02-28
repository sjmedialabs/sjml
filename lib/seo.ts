import { getCollection } from "./mongodb"
import type { Metadata } from "next"

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

export async function generateSeoMetadata(pageName: string): Promise<Metadata> {
  const seoData = await getSeoData()
  const pageSeo = seoData?.pages?.find(
    (p) => p.page.toLowerCase() === pageName.toLowerCase()
  )
  
  const title = pageSeo?.title || seoData?.globalTitle || "SJ Media Labs"
  const description = pageSeo?.description || seoData?.globalDescription || "Transform Your Brand"
  const ogImage = pageSeo?.ogImage || seoData?.ogImage || "/og-image.jpg"
  const keywords = pageSeo?.keywords || ""
  
  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: seoData?.twitterHandle || "@sjmedialabs",
    },
  }
}
