import { createDefaultServiceDetailTemplate } from "@/lib/service-detail-template"

export interface DefaultSubServiceRecord {
  parentSlug: string
  slug: string
  name: string
  displayOrder: number
  isActive: boolean
  shortDescription: string
  detailTemplate?: ReturnType<typeof createDefaultServiceDetailTemplate>
}

export const DEFAULT_BRANDING_SUB_SERVICES: DefaultSubServiceRecord[] = [
  {
    parentSlug: "branding",
    slug: "brand-strategy",
    name: "Brand Strategy",
    displayOrder: 0,
    isActive: true,
    shortDescription: "Strategic brand positioning and messaging that defines how your business stands out.",
  },
  {
    parentSlug: "branding",
    slug: "logo-design",
    name: "Logo Design",
    displayOrder: 1,
    isActive: true,
    shortDescription:
      "Your logo is the face of your brand. We design distinctive, memorable logos that communicate your brand's essence and make a strong first impression.",
    detailTemplate: createDefaultServiceDetailTemplate("Logo Design", "BRANDING"),
  },
  {
    parentSlug: "branding",
    slug: "brand-identity-design",
    name: "Brand Identity Design",
    displayOrder: 2,
    isActive: true,
    shortDescription: "Complete visual identity systems including color, typography and brand elements.",
  },
  {
    parentSlug: "branding",
    slug: "brand-guidelines",
    name: "Brand Guidelines",
    displayOrder: 3,
    isActive: true,
    shortDescription: "Comprehensive brand guidelines to ensure consistency across all touchpoints.",
  },
  {
    parentSlug: "branding",
    slug: "brand-naming",
    name: "Brand Naming",
    displayOrder: 4,
    isActive: true,
    shortDescription: "Creative naming solutions that capture your brand personality and resonate with audiences.",
  },
  {
    parentSlug: "branding",
    slug: "brand-collateral-design",
    name: "Brand Collateral Design",
    displayOrder: 5,
    isActive: true,
    shortDescription: "Business cards, stationery and marketing materials that reinforce your brand identity.",
  },
  {
    parentSlug: "branding",
    slug: "rebranding",
    name: "Rebranding",
    displayOrder: 6,
    isActive: true,
    shortDescription: "Transform your existing brand with a fresh identity that reflects your evolution.",
  },
]
