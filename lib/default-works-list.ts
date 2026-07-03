import {
  createDefaultWorkDetailTemplate,
  type WorkDetailTemplate,
} from "@/lib/work-detail-template"

export interface DefaultWorkRecord {
  id: string
  slug: string
  title: string
  description: string
  image: string
  cardSubtitle: string
  categoryTags: string
  categories: string[]
  industry: string
  client: string
  year: string
  displayOrder: number
  isActive: boolean
  isFeatured: boolean
  detailTemplate: WorkDetailTemplate
}

const IMG = {
  coffee: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  skincare: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
  finova: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
  snacks: "https://images.unsplash.com/photo-1621939514649-dfbf4c5a1b4e?auto=format&fit=crop&w=800&q=80",
  billboard: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  speaker: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
  wellness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
  video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
  social: "https://images.unsplash.com/photo-1611162617474-5b21e939e113?auto=format&fit=crop&w=800&q=80",
}

function auroraDetail(): WorkDetailTemplate {
  const base = createDefaultWorkDetailTemplate("Aurora Skincare")
  return {
    ...base,
    categoryTags: "BRANDING, PACKAGING",
    subtitle: "Building a premium skincare brand from the ground up.",
    introParagraph:
      "We partnered with Aurora Skincare to create a distinctive brand identity and packaging system that reflects quality, trust and modern aesthetics.",
    heroImage: IMG.skincare,
    meta: { year: "2024", industry: "Skincare", location: "India" },
    overviewText:
      "Aurora Skincare envisioned a brand that felt premium, natural and trustworthy — one that would resonate with modern consumers seeking quality skincare rooted in authenticity.",
    pillars: [
      {
        id: "1",
        icon: "target",
        title: "Objective",
        description: "Create a memorable brand identity that resonates with the target audience and builds trust.",
      },
      {
        id: "2",
        icon: "users",
        title: "Solution",
        description: "Developed a complete visual system including logo, packaging and brand guidelines.",
      },
      {
        id: "3",
        icon: "lightbulb",
        title: "Approach",
        description: "A minimalist, earth-toned design strategy focused on premium positioning and shelf appeal.",
      },
      {
        id: "4",
        icon: "star",
        title: "Deliverables",
        description: "",
        bullets: ["Brand Identity", "Packaging Design", "Brand Guidelines", "Marketing Collateral", "Social Media Creatives"],
      },
    ],
    galleryImages: [IMG.skincare, IMG.skincare, IMG.skincare, IMG.skincare],
    resultsText:
      "The new brand identity helped Aurora establish strong market presence and increased customer engagement across all touchpoints.",
    metrics: [
      { id: "1", icon: "chart", value: "120%", label: "Increase in Brand Awareness" },
      { id: "2", icon: "users", value: "85%", label: "Growth in Social Media Engagement" },
      { id: "3", icon: "bag", value: "65%", label: "Increase in Online Sales" },
      { id: "4", icon: "star", value: "4.8/5", label: "Average Customer Satisfaction" },
    ],
    testimonial: {
      quote:
        "SJML transformed our brand into something powerful and memorable. Their team truly understands our vision and delivers beyond expectations.",
      author: "Ananya Sharma",
      role: "Founder, Aurora Skincare",
      image: "",
    },
    projectDetails: {
      client: "Aurora Skincare",
      industry: "Skincare",
      services: "Branding, Packaging, Digital",
      duration: "8 Weeks",
      team: "Brand Strategists, Designers, Copywriters",
      website: "www.auroraskincare.com",
    },
    sideImage: IMG.skincare,
  }
}

export const DEFAULT_WORKS_LIST: DefaultWorkRecord[] = [
  {
    id: "work-kafi-coffee",
    slug: "kafi-coffee-co",
    title: "Káfi Coffee Co.",
    description: "A bold coffee brand identity rooted in craft and culture.",
    image: IMG.coffee,
    cardSubtitle: "Brand Identity",
    categoryTags: "BRANDING",
    categories: ["branding"],
    industry: "Food & Beverage",
    client: "Káfi Coffee Co.",
    year: "2024",
    displayOrder: 0,
    isActive: true,
    isFeatured: true,
    detailTemplate: createDefaultWorkDetailTemplate("Káfi Coffee Co."),
  },
  {
    id: "work-aurora-skincare",
    slug: "aurora-skincare",
    title: "Aurora Skincare",
    description: "Building a premium skincare brand from the ground up.",
    image: IMG.skincare,
    cardSubtitle: "Brand Identity, Packaging Design",
    categoryTags: "BRANDING, PACKAGING",
    categories: ["branding", "packaging"],
    industry: "Skincare",
    client: "Aurora Skincare",
    year: "2024",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
    detailTemplate: auroraDetail(),
  },
  {
    id: "work-finova",
    slug: "finova",
    title: "Finova",
    description: "A modern fintech platform with intuitive digital experience.",
    image: IMG.finova,
    cardSubtitle: "Website Design & Development",
    categoryTags: "DIGITAL, WEB & EXPERIENCE",
    categories: ["digital", "web-experience"],
    industry: "Finance",
    client: "Finova",
    year: "2023",
    displayOrder: 2,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Finova"),
  },
  {
    id: "work-terra-bites",
    slug: "terra-bites",
    title: "Terra Bites",
    description: "Playful packaging for a healthy snack brand.",
    image: IMG.snacks,
    cardSubtitle: "Packaging Design",
    categoryTags: "PACKAGING DESIGN",
    categories: ["packaging"],
    industry: "Food & Beverage",
    client: "Terra Bites",
    year: "2024",
    displayOrder: 3,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Terra Bites"),
  },
  {
    id: "work-flexon",
    slug: "flexon-performance",
    title: "Flexon Performance",
    description: "High-impact advertising campaign for an athletic brand.",
    image: IMG.billboard,
    cardSubtitle: "Campaign Design",
    categoryTags: "ADVERTISING",
    categories: ["advertising"],
    industry: "Sports & Fitness",
    client: "Flexon Performance",
    year: "2023",
    displayOrder: 4,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Flexon Performance"),
  },
  {
    id: "work-orbit-audio",
    slug: "orbit-audio",
    title: "Orbit Audio",
    description: "Premium audio brand identity and digital presence.",
    image: IMG.speaker,
    cardSubtitle: "Brand Identity, Website",
    categoryTags: "BRANDING, WEB & EXPERIENCE",
    categories: ["branding", "web-experience"],
    industry: "Consumer Electronics",
    client: "Orbit Audio",
    year: "2024",
    displayOrder: 5,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Orbit Audio"),
  },
  {
    id: "work-wellness-club",
    slug: "the-wellness-club",
    title: "The Wellness Club",
    description: "Elevated wellness brand with refined visual identity.",
    image: IMG.wellness,
    cardSubtitle: "Brand Identity",
    categoryTags: "BRANDING",
    categories: ["branding"],
    industry: "Health & Wellness",
    client: "The Wellness Club",
    year: "2023",
    displayOrder: 6,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("The Wellness Club"),
  },
  {
    id: "work-quiet-within",
    slug: "quiet-within",
    title: "Quiet Within",
    description: "Emotional brand film capturing mindfulness and calm.",
    image: IMG.video,
    cardSubtitle: "Brand Film",
    categoryTags: "MOTION & VIDEO",
    categories: ["motion-video"],
    industry: "Health & Wellness",
    client: "Quiet Within",
    year: "2024",
    displayOrder: 7,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Quiet Within"),
  },
  {
    id: "work-fresko",
    slug: "fresko",
    title: "Fresko",
    description: "Vibrant social media campaign for a food delivery app.",
    image: IMG.social,
    cardSubtitle: "Social Media Campaign",
    categoryTags: "DIGITAL",
    categories: ["digital"],
    industry: "Food & Beverage",
    client: "Fresko",
    year: "2024",
    displayOrder: 8,
    isActive: true,
    isFeatured: false,
    detailTemplate: createDefaultWorkDetailTemplate("Fresko"),
  },
]
