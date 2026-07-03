import { createDefaultServiceDetailTemplate } from "@/lib/service-detail-template"

export interface DefaultServiceRecord {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  linkText: string
  displayOrder: number
  isActive: boolean
  detailTemplate: ReturnType<typeof createDefaultServiceDetailTemplate>
}

export const DEFAULT_SERVICES_LIST: DefaultServiceRecord[] = [
  {
    id: "svc-branding",
    slug: "branding",
    title: "BRANDING",
    description: "We create powerful brand identities that build trust, create recognition and leave a lasting impression.",
    icon: "branding",
    linkText: "EXPLORE SERVICES",
    displayOrder: 0,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Branding", "BRANDING"),
  },
  {
    id: "svc-advertising",
    slug: "advertising",
    title: "ADVERTISING",
    description: "Creative campaigns across traditional and digital platforms that drive awareness and results.",
    icon: "advertising",
    linkText: "EXPLORE SERVICES",
    displayOrder: 1,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Advertising", "ADVERTISING"),
  },
  {
    id: "svc-digital-marketing",
    slug: "digital-marketing",
    title: "DIGITAL MARKETING",
    description: "Data-driven strategies that increase visibility, engage audiences and generate measurable growth.",
    icon: "digital-marketing",
    linkText: "EXPLORE SERVICES",
    displayOrder: 2,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Digital Marketing", "DIGITAL MARKETING"),
  },
  {
    id: "svc-web-experience",
    slug: "web-experience",
    title: "WEB & EXPERIENCE",
    description: "We build fast, responsive and engaging websites and applications that deliver exceptional experiences.",
    icon: "web-experience",
    linkText: "EXPLORE SERVICES",
    displayOrder: 3,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Web & Experience", "WEB & EXPERIENCE"),
  },
  {
    id: "svc-motion-video",
    slug: "motion-video",
    title: "MOTION & VIDEO",
    description: "Engaging motion graphics and videos that communicate your brand story with impact.",
    icon: "motion-video",
    linkText: "EXPLORE SERVICES",
    displayOrder: 4,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Motion & Video", "MOTION & VIDEO"),
  },
  {
    id: "svc-packaging",
    slug: "packaging-design",
    title: "PACKAGING DESIGN",
    description: "Creative packaging that enhances product appeal and strengthens brand recall.",
    icon: "packaging",
    linkText: "EXPLORE SERVICES",
    displayOrder: 5,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Packaging Design", "PACKAGING DESIGN"),
  },
  {
    id: "svc-strategy",
    slug: "strategy-consulting",
    title: "STRATEGY & CONSULTING",
    description: "Insight-led strategies and consulting to help you make smarter decisions and grow faster.",
    icon: "strategy",
    linkText: "EXPLORE SERVICES",
    displayOrder: 6,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Strategy & Consulting", "STRATEGY & CONSULTING"),
  },
  {
    id: "svc-media-planning",
    slug: "media-planning",
    title: "MEDIA PLANNING & BUYING",
    description: "Targeted media planning and buying across platforms to maximize reach and ROI.",
    icon: "media-planning",
    linkText: "EXPLORE SERVICES",
    displayOrder: 7,
    isActive: true,
    detailTemplate: createDefaultServiceDetailTemplate("Media Planning & Buying", "MEDIA PLANNING & BUYING"),
  },
]
