import { getCollection, type ObjectId } from "@/lib/mongodb"

// Interfaces
export interface ContentData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    description: string
    primaryButtonText: string
    primaryButtonUrl: string
    secondaryButtonText: string
    secondaryButtonUrl: string
    rotatingWords: string[]
    backgroundImage?: string
  }
  stats: Array<{ id: string; value: string; label: string }>
  caseStudies: Array<{
    id: string
    title: string
    description: string
    image: string
    tags: string[]
    stat1Label: string
    stat1Value: string
    stat2Label: string
    stat2Value: string
    slug?: string
  }>
  services: Array<{
    id: string
    title: string
    description: string
    icon: string
    image: string
    link: string
    slug?: string
  }>
  industries: Array<{
    id: string
    title: string
    description: string
    image: string
  }>
  testimonials: Array<{
    id: string
    quote: string
    author: string
    company?: string
    image: string
    rating: number
  }>
  insights: Array<{
    id: string
    title: string
    description: string
    image: string
    date: string
    category: string
    readTime?: string
    slug?: string
  }>
  playbook: {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
    image: string
  }
  partners: Array<{
    id: string
    name: string
    logo: string
  }>
  footer: {
    address: string
    phone: string
    email: string
    copyright: string
    newsletterText: string
  }
  settings: {
    siteName: string
    siteTagline: string
    metaTitle: string
    metaDescription: string
  }
  statsBackgroundImage?: string
  servicesBackgroundImage?: string
  industriesBackgroundImage?: string
  caseStudiesBackgroundImage?: string
  testimonialsBackgroundImage?: string
  insightsBackgroundImage?: string
  trustedByBackgroundImage?: string
  playbookBackgroundImage?: string
  updatedAt?: Date
}

export interface AboutPageData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    highlightedText: string
  }
  about: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
    values: Array<{ title: string; description: string }>
  }
  stats: Array<{ value: string; label: string }>
  achievements: Array<{ year: string; title: string; description: string }>
  vision: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
    values: Array<{ title: string }>
  }
  mission: {
    badge: string
    title: string
    highlightedTitle: string
    description: string
    image: string
    values: Array<{ title: string }>
  }
  team: {
    badge: string
    title: string
    highlightedTitle: string
    buttonText: string
    members: Array<{
      id: string
      name: string
      role: string
      image: string
    }>
  }
  updatedAt?: Date
}

export interface WorkPageData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  portfolio: {
    title: string
    description: string
  }
  projects: Array<{
    id: string
    slug: string
    title: string
    description: string
    image: string
    client?: string
    industry?: string
    role?: string
    technology?: string
    year?: string
    tags?: string[]
    brandOverview?: {
      title: string
      description: string
      points: string[]
    }
    gallery?: string[]
  }>
  updatedAt?: Date
}

export interface ServicesPageData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    highlightedWords: string[]
    backgroundImage: string
    watermark: string
  }
  section: {
    title: string
    subtitle: string
    description: string
  }
  services: Array<{
    id: string
    slug: string
    title: string
    description: string
    icon: string
    linkText: string
    detailPage?: {
      heroImage: string
      showcaseImage: string
      offerings: string[]
      benefits: { title: string; description: string }
      features: { title: string; points: string[] }
      process: Array<{ icon: string; title: string; description: string }>
      faqs: Array<{ question: string; answer: string }>
    }
  }>
  updatedAt?: Date
}

export interface CaseStudiesPageData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    subtitle: string
    description: string
  }
  section: {
    title: string
    description: string
  }
  caseStudies: Array<{
    id: string
    slug: string
    title: string
    description: string
    image: string
    tags: string[]
    stat1Label: string
    stat1Value: string
    stat2Label: string
    stat2Value: string
  }>
  updatedAt?: Date
}

export interface CareersPageData {
  _id?: ObjectId
  pageKey: string
  heroTitle: string
  heroSubtitle: string
  culture: {
    title: string
    description: string
    values: Array<{ title: string; description: string }>
  }
  benefits: Array<{ icon: string; title: string; description: string }>
  jobs: Array<{
    id: string
    title: string
    department: string
    location: string
    type: string
    description: string
    requirements: string[]
    salary: string
    published: boolean
  }>
  updatedAt?: Date
}

export interface ContactPageData {
  _id?: ObjectId
  pageKey: string
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  form: {
    badge: string
    title: string
    highlightedWords: string[]
    buttonText: string
  }
  offices: Array<{
    country: string
    flag: string
    address: string
  }>
  contact: {
    title: string
    phone: string
    email: string
  }
  updatedAt?: Date
}

// Content Model Functions
export async function getHomeContent(): Promise<ContentData | null> {
  const collection = await getCollection<any>("content")
  const content = await collection.findOne({ pageKey: "home" })
  return content
}

export async function updateHomeContent(section: string, data: any): Promise<ContentData | null> {
  const collection = await getCollection<any>("content")
  await collection.updateOne(
    { pageKey: "home" },
    { $set: { [section]: data, updatedAt: new Date() } },
    { upsert: true },
  )
  return getHomeContent()
}

export async function getPageContent(pageKey: string): Promise<any> {
  const collection = await getCollection<any>("content")
  return collection.findOne({ pageKey })
}

export async function updatePageContent(pageKey: string, data: any): Promise<any> {
  const collection = await getCollection<any>("content")
  const { _id, ...updateData } = data
  await collection.updateOne({ pageKey }, { $set: { ...updateData, pageKey, updatedAt: new Date() } }, { upsert: true })
  return getPageContent(pageKey)
}
