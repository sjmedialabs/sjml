import { createDefaultInsightDetailTemplate, type InsightDetailTemplate } from "@/lib/insight-detail-template"

export interface DefaultInsightRecord {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  categoryTags: string
  categories: string[]
  category: string
  author: string
  date: string
  readTime: string
  displayOrder: number
  published: boolean
  featured: boolean
  detailTemplate: InsightDetailTemplate
}

const IMG = {
  psychologyFeatured:
    "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
  brands: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80",
  marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
  digital: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  business: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
  trends: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
}

function psychologyDetail(): InsightDetailTemplate {
  const base = createDefaultInsightDetailTemplate("The Psychology of Strong Brands")
  return {
    ...base,
    introParagraph:
      "Strong brands aren't built overnight. They live in the minds of consumers, shaped by experiences, emotions and consistent messaging that creates lasting recognition and trust.",
    sections: [
      {
        id: "1",
        heading: "1. Brands Live in Our Minds",
        paragraphs: [
          "A brand is more than a logo or a product — it's the sum of every interaction, impression and memory a person associates with your business. Psychology plays a central role in how those associations form and strengthen over time.",
        ],
      },
      {
        id: "2",
        heading: "2. Emotion Drives Decisions",
        paragraphs: [
          "People remember how a brand made them feel long after they forget specific details. Emotional resonance creates stronger recall, loyalty and advocacy than feature lists alone.",
        ],
      },
      {
        id: "3",
        heading: "3. Consistency Builds Trust",
        paragraphs: [
          "Repeated exposure to consistent visual identity, tone of voice and brand experience reinforces familiarity — and familiarity breeds confidence in purchase decisions.",
        ],
      },
      {
        id: "4",
        heading: "4. Perception Shapes Reality",
        paragraphs: [
          "How customers perceive your brand often matters more than what you actually deliver. Strategic positioning and messaging help align perception with the value you want to be known for.",
        ],
      },
      {
        id: "5",
        heading: "5. Social Proof Influences Choice",
        paragraphs: [
          "Testimonials, reviews and visible client success signal credibility. When people see others trusting your brand, they're more likely to choose you over alternatives.",
        ],
      },
      {
        id: "6",
        heading: "6. Memory Anchors Loyalty",
        paragraphs: [
          "Distinctive brand assets — colors, taglines, visual cues — act as memory triggers. The easier you are to recall, the more likely customers are to return and recommend you.",
        ],
      },
    ],
    closingStatement: "Build a brand that people don't just remember, but believe in.",
  }
}

export const DEFAULT_INSIGHTS_LIST: DefaultInsightRecord[] = [
  {
    id: "insight-psychology-brands",
    slug: "the-psychology-of-strong-brands",
    title: "The Psychology of Strong Brands",
    excerpt: "Discover how emotional connection, consistency and perception shape the brands people remember and trust.",
    content: "",
    image: IMG.psychologyFeatured,
    categoryTags: "BRANDING",
    categories: ["branding"],
    category: "Branding",
    author: "SJML Team",
    date: "2025-05-24",
    readTime: "6 min read",
    displayOrder: 0,
    published: true,
    featured: true,
    detailTemplate: psychologyDetail(),
  },
  {
    id: "insight-brand-strategy",
    slug: "brand-strategy-in-2025",
    title: "Brand Strategy in 2025: What Really Matters",
    excerpt: "The brand strategy priorities that separate leaders from followers in a fast-changing market.",
    content: "",
    image: IMG.marketing,
    categoryTags: "STRATEGY",
    categories: ["marketing"],
    category: "Marketing",
    author: "SJML Team",
    date: "2025-05-20",
    readTime: "5 min read",
    displayOrder: 1,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Brand Strategy in 2025: What Really Matters"),
  },
  {
    id: "insight-visual-identity",
    slug: "how-design-shapes-brand-perception",
    title: "How Design Shapes Brand Perception",
    excerpt: "Why visual design is one of the fastest ways to influence how people feel about your brand.",
    content: "",
    image: IMG.design,
    categoryTags: "DESIGN",
    categories: ["design"],
    category: "Design",
    author: "SJML Team",
    date: "2025-05-15",
    readTime: "7 min read",
    displayOrder: 2,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("How Design Shapes Brand Perception"),
  },
  {
    id: "insight-digital-growth",
    slug: "emotional-branding-that-converts",
    title: "Emotional Branding That Converts",
    excerpt: "How emotional storytelling turns brand awareness into action and long-term customer loyalty.",
    content: "",
    image: IMG.digital,
    categoryTags: "MARKETING",
    categories: ["marketing"],
    category: "Marketing",
    author: "SJML Team",
    date: "2025-05-10",
    readTime: "6 min read",
    displayOrder: 3,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Emotional Branding That Converts"),
  },
  {
    id: "insight-packaging-design",
    slug: "why-brand-consistency-matters",
    title: "Why Brand Consistency Matters More Than Ever",
    excerpt: "Consistency across touchpoints builds recognition, trust and stronger brand equity over time.",
    content: "",
    image: IMG.design,
    categoryTags: "BRANDING",
    categories: ["branding"],
    category: "Branding",
    author: "SJML Team",
    date: "2025-05-05",
    readTime: "5 min read",
    displayOrder: 4,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Why Brand Consistency Matters More Than Ever"),
  },
  {
    id: "insight-campaign-creative",
    slug: "campaign-creative-that-converts",
    title: "Campaign Creative That Converts",
    excerpt: "What separates campaigns that get noticed from campaigns that drive real business results.",
    content: "",
    image: IMG.marketing,
    categoryTags: "MARKETING",
    categories: ["marketing"],
    category: "Marketing",
    author: "SJML Team",
    date: "2025-04-28",
    readTime: "6 min read",
    displayOrder: 5,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Campaign Creative That Converts"),
  },
  {
    id: "insight-brand-leadership",
    slug: "brand-leadership-in-2025",
    title: "Brand Leadership in 2025",
    excerpt: "How business leaders can align brand vision with market reality to stay competitive and relevant.",
    content: "",
    image: IMG.business,
    categoryTags: "BUSINESS",
    categories: ["business"],
    category: "Business",
    author: "SJML Team",
    date: "2025-04-20",
    readTime: "7 min read",
    displayOrder: 6,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Brand Leadership in 2025"),
  },
  {
    id: "insight-industry-trends",
    slug: "industry-trends-to-watch",
    title: "Industry Trends to Watch",
    excerpt: "The branding and marketing shifts shaping how companies connect with audiences this year.",
    content: "",
    image: IMG.trends,
    categoryTags: "INDUSTRY TRENDS",
    categories: ["industry-trends"],
    category: "Industry Trends",
    author: "SJML Team",
    date: "2025-04-14",
    readTime: "5 min read",
    displayOrder: 7,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Industry Trends to Watch"),
  },
  {
    id: "insight-social-media",
    slug: "social-media-brand-building",
    title: "Social Media Brand Building",
    excerpt: "Turn social platforms into brand-building channels with consistent creative and strategic storytelling.",
    content: "",
    image: IMG.digital,
    categoryTags: "DIGITAL",
    categories: ["digital"],
    category: "Digital",
    author: "SJML Team",
    date: "2025-04-08",
    readTime: "6 min read",
    displayOrder: 8,
    published: true,
    featured: false,
    detailTemplate: createDefaultInsightDetailTemplate("Social Media Brand Building"),
  },
]
