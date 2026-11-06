// Types and Default Mock Content for Template 1
// Separate from UI components so CMS / Backend developers can easily inspect or replace data contracts.

export interface Template1HeaderData {
  logoUrl?: string
  logoText?: string
  taglineLine1?: string
  taglineLine2?: string
  logoHref?: string
  phoneText?: string
  phoneHref?: string
  ctaText?: string
  ctaHref?: string
}

export const defaultTemplate1HeaderData: Required<Template1HeaderData> = {
  logoUrl: "",
  logoText: "SJML",
  taglineLine1: "BRANDING &",
  taglineLine2: "ADVERTISING",
  logoHref: "/",
  phoneText: "+91 40 40268570",
  phoneHref: "tel:+914040268570",
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
}

export interface Template1LeadFormValues {
  fullName: string
  businessEmail: string
  phoneNumber: string
  message: string
}

export interface Template1HeroData {
  badgeText?: string
  headline?: string
  description?: string
  ctaText?: string
  ctaHref?: string
  trustText?: string
  formOverline?: string
  formTitle?: string
  fullNameLabel?: string
  fullNamePlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  phoneLabel?: string
  phonePlaceholder?: string
  messageLabel?: string
  messagePlaceholder?: string
  submitButtonText?: string
  privacyText?: string
  privacyLinkText?: string
  privacyLinkHref?: string
}

export const defaultTemplate1HeroData: Required<Template1HeroData> = {
  badgeText: "DIGITAL MARKETING AGENCY • HYDERABAD",
  headline: "Digital Marketing\nThat Turns Attention\nInto Business\nGrowth.",
  description:
    "Build a stronger digital presence, reach the right audience, and unlock new growth opportunities with creative, data-driven marketing strategies from SJ Media Labs.",
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
  trustText: "12+ Years of Creative & Digital Expertise",
  formOverline: "LET’S BUILD WHAT’S NEXT",
  formTitle: "Let's Talk About Your Growth.",
  fullNameLabel: "Full Name",
  fullNamePlaceholder: "Your full name",
  emailLabel: "Business Email",
  emailPlaceholder: "you@company.com",
  phoneLabel: "Phone Number",
  phonePlaceholder: "Enter 10-digit phone number",
  messageLabel: "Message",
  messagePlaceholder: "Tell us about your project or goals",
  submitButtonText: "Book a Consultation",
  privacyText: "Your details stay private. Used only to respond to your enquiry.",
  privacyLinkText: "Privacy Policy",
  privacyLinkHref: "/privacy",
}

export interface Template1StatItem {
  id: string
  value: string
  label: string
}

export interface Template1ExperienceData {
  overline?: string
  headline?: string
  stats?: Template1StatItem[]
}

export const defaultTemplate1ExperienceData: Required<Template1ExperienceData> = {
  overline: "A CREATIVE PARTNER. A BUSINESS MINDSET.",
  headline: "Built on Experience.\nDriven by Results.",
  stats: [
    {
      id: "experience",
      value: "12+",
      label: "Years of Experience",
    },
    {
      id: "clients",
      value: "800+",
      label: "Clients",
    },
  ],
}

export interface Template1ChallengeItem {
  id: string
  number: string
  title: string
  description: string
}

export interface Template1ChallengeData {
  overline?: string
  headline?: string
  highlightText?: string
  items?: Template1ChallengeItem[]
  bottomLabel?: string
  bottomStatement?: string
}

export const defaultTemplate1ChallengeData: Required<Template1ChallengeData> = {
  overline: "THE CHALLENGE",
  headline: "Your Brand\nDeserves More Than\nJust Visibility.",
  highlightText: "Attention is the beginning.\nThe right enquiry is the opportunity.",
  items: [
    {
      id: "challenge-1",
      number: "01",
      title: "Attention without enquiries.",
      description:
        "Campaigns reach people, but not the people ready to do business.",
    },
    {
      id: "challenge-2",
      number: "02",
      title: "A brand that feels disconnected.",
      description:
        "Inconsistent communication weakens recognition across channels.",
    },
    {
      id: "challenge-3",
      number: "03",
      title: "Spend without a clear picture.",
      description:
        "It is hard to know which marketing investments are working.",
    },
  ],
  bottomLabel: "CREATIVITY × CLARITY",
  bottomStatement:
    "Creative thinking meets strategic execution. We help brands connect with the right audience and turn marketing activity into meaningful business opportunities.",
}

export interface Template1ServiceItem {
  id: string
  number: string
  title: string
  tags: string
  description: string
}

export interface Template1ServicesData {
  overline?: string
  headline?: string
  subtitle?: string
  services?: Template1ServiceItem[]
  ctaText?: string
  ctaHref?: string
}

export const defaultTemplate1ServicesData: Required<Template1ServicesData> = {
  overline: "WHAT WE DO",
  headline: "Every Channel.\nOne Clear Growth Strategy.",
  subtitle:
    "Connected thinking. Focused execution. Marketing built around your business.",
  services: [
    {
      id: "service-1",
      number: "01",
      title: "Performance Marketing\n& Paid Ads",
      tags: "GOOGLE ADS / PAID SOCIAL / LEAD QUALITY",
      description:
        "Strategic Google Ads and paid social campaigns built around audience relevance, lead quality, and continuous optimization.",
    },
    {
      id: "service-2",
      number: "02",
      title: "Search Engine\nOptimization",
      tags: "TECHNICAL SEO / CONTENT / DISCOVERY",
      description:
        "Improve organic visibility and help potential customers discover your business through search.",
    },
    {
      id: "service-3",
      number: "03",
      title: "Social Media &\nContent Marketing",
      tags: "SOCIAL STRATEGY / CONTENT / CAMPAIGNS",
      description:
        "Build stronger audience connections with purposeful content, creative campaigns, and consistent storytelling.",
    },
    {
      id: "service-4",
      number: "04",
      title: "Website &\nConversion Optimization",
      tags: "WEB EXPERIENCE / UX / CONVERSION",
      description:
        "Turn digital traffic into meaningful actions through faster, more engaging, conversion-focused experiences.",
    },
  ],
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
}


export interface Template1FeaturedWork {
  badge: string
  title: string
  industry: string
  serviceType: string
  image: string
  imageAlt?: string
  narrativeLabel: string
  narrativeHeadline: string
  challengeLabel?: string
  challengeText: string
  approachLabel?: string
  approachText: string
  evidenceLabel?: string
  evidenceText: string
  href?: string
}

export interface Template1SecondaryWorkItem {
  id: string
  title: string
  category: string
  image: string
  imageAlt?: string
  statusNote?: string
  challenge: string
  approach: string
  href?: string
}

export interface Template1WorkData {
  overline?: string
  headline?: string
  featured?: Template1FeaturedWork
  projects?: Template1SecondaryWorkItem[]
  ctaText?: string
  ctaHref?: string
  disclaimer?: string
}

export const defaultTemplate1WorkData: Required<Template1WorkData> = {
  overline: "THE WORK",
  headline: "Creative Thinking.\nReal-World Impact.",
  featured: {
    badge: "01 / FEATURED PROJECT",
    title: "NCL Buildtek",
    industry: "Building materials",
    serviceType: "Social Media Marketing",
    image: "/construction-branding.jpg",
    imageAlt: "NCL Buildtek social media campaign creative",
    narrativeLabel: "CASE NARRATIVE / FOR APPROVAL",
    narrativeHeadline: "Making product stories\nwork harder.",
    challengeLabel: "Challenge",
    challengeText:
      "Make technical building products clear and relevant to potential buyers.",
    approachLabel: "Approach",
    approachText:
      "Product-led social creatives pair architectural context with focused benefit messaging.",
    evidenceLabel: "Evidence",
    evidenceText:
      "Published creative shown. Campaign performance data has not been supplied.",
    href: "/work",
  },
  projects: [
    {
      id: "work-hegde",
      title: "Hegde Hospitals",
      category: "Healthcare / Advertising",
      image: "/healthcare-platform-case-study.jpg",
      imageAlt: "Hegde Hospitals print and advertising collateral",
      statusNote: "Narrative for approval",
      challenge: "Communicate care with clarity.",
      approach: "Human-led imagery and focused service communication.",
      href: "/work",
    },
    {
      id: "work-rightdata",
      title: "RightData",
      category: "Enterprise technology / Web & Experience",
      image: "/laptop-dashboard-analytics-business.jpg",
      imageAlt: "RightData web and digital experience on laptop",
      statusNote: "Narrative for approval",
      challenge: "Simplify a complex digital offering.",
      approach:
        "A structured digital experience with clear information hierarchy.",
      href: "/work",
    },
  ],
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
  disclaimer:
    "Authentic visuals from SJML's portfolio. Case narratives and campaign-use permissions require approval; no measurable outcomes are claimed.",
}


export interface Template1WhySjmlPoint {
  id: string
  number: string
  title: string
  description: string
}

export interface Template1WhySjmlData {
  overline?: string
  headline?: string
  image?: string
  imageAlt?: string
  imageCaption?: string
  ctaText?: string
  ctaHref?: string
  points?: Template1WhySjmlPoint[]
}

export const defaultTemplate1WhySjmlData: Required<Template1WhySjmlData> = {
  overline: "WHY SJML",
  headline: "Creative Minds.\nStrategic Thinking.\nOne Growth Partner.",
  image: "/healthcare-platform-case-study.jpg",
  imageAlt: "SJML creative and strategic work showcase",
  imageCaption: "CREATIVITY WITH A COMMERCIAL PURPOSE",
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
  points: [
    {
      id: "why-1",
      number: "01",
      title: "Strategy Before Execution",
      description:
        "Research the market, understand the audience, and identify the right opportunities.",
    },
    {
      id: "why-2",
      number: "02",
      title: "Creative That Connects",
      description: "Build memorable communication that speaks to people.",
    },
    {
      id: "why-3",
      number: "03",
      title: "Integrated Digital Expertise",
      description:
        "Connect campaigns, content, brand identity, and digital experiences.",
    },
    {
      id: "why-4",
      number: "04",
      title: "Focused on Improvement",
      description:
        "Review performance, learn from insights, and refine the approach.",
    },
  ],
}


export interface Template1ProcessStep {
  id: string
  number: string
  title: string
  description: string
}

export interface Template1ProcessData {
  overline?: string
  headline?: string
  steps?: Template1ProcessStep[]
}

export const defaultTemplate1ProcessData: Required<Template1ProcessData> = {
  overline: "HOW WE WORK",
  headline: "A Clear Process.\nFrom Insight to Impact.",
  steps: [
    {
      id: "step-1",
      number: "01",
      title: "Discover",
      description:
        "Understand your brand, business objectives, audience, and challenges.",
    },
    {
      id: "step-2",
      number: "02",
      title: "Strategize",
      description:
        "Develop a tailored marketing direction and channel plan.",
    },
    {
      id: "step-3",
      number: "03",
      title: "Execute",
      description:
        "Bring campaigns, content, and experiences to life.",
    },
    {
      id: "step-4",
      number: "04",
      title: "Optimize",
      description:
        "Monitor performance, identify opportunities, and improve continuously.",
    },
  ],
}


export interface Template1ClientItem {
  id: string
  name: string
  subtext?: string
  logoUrl?: string
  variant?: "text-dark" | "badge-light" | "badge-navy" | "badge-gar"
}

export interface Template1ClientsData {
  overline?: string
  headline?: string
  statValue?: string
  statLabel?: string
  clients?: Template1ClientItem[]
}

export const defaultTemplate1ClientsData: Required<Template1ClientsData> = {
  overline: "CLIENTS",
  headline: "Brands We've Worked With.",
  statValue: "800+",
  statLabel: "Clients",
  clients: [
    {
      id: "client-techoptum",
      name: "techoptum",
      subtext: "S O L U T I O N S",
      logoUrl: "",
      variant: "text-dark",
    },
    {
      id: "client-alakananda",
      name: "ALAKANANDA",
      subtext: "HOMES",
      logoUrl: "",
      variant: "badge-light",
    },
    {
      id: "client-sribhramara",
      name: "SRI BHRAMARA",
      subtext: "TOWNSHIPS PVT. LTD.",
      logoUrl: "",
      variant: "badge-navy",
    },
    {
      id: "client-gar",
      name: "GAR",
      subtext: "CORP",
      logoUrl: "",
      variant: "badge-gar",
    },
  ],
}


export interface Template1FaqItem {
  id: string
  question: string
  answer: string
}

export interface Template1FaqData {
  overline?: string
  headline?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
  faqs?: Template1FaqItem[]
}

export const defaultTemplate1FaqData: Required<Template1FaqData> = {
  overline: "A LITTLE MORE CLARITY",
  headline: "Everything You\nNeed to Know.",
  subtitle: "Clear answers. No big promises.\nJust the right place to start.",
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
  faqs: [
    {
      id: "faq-1",
      question: "What digital marketing services does SJ Media Labs offer?",
      answer:
        "We support performance marketing and paid ads, SEO, social media and content, and website conversion optimization. The right mix depends on your objectives and audience.",
    },
    {
      id: "faq-2",
      question: "How do you develop a marketing strategy for my business?",
      answer:
        "We start by understanding your business goals, target audience, and competitive landscape, then build a tailored channel and creative roadmap aligned with measurable commercial outcomes.",
    },
    {
      id: "faq-3",
      question: "How long does it take to see results?",
      answer:
        "Paid campaigns can generate initial enquiries within weeks, while organic channels like SEO and content marketing build compounding momentum over three to six months.",
    },
    {
      id: "faq-4",
      question: "How much do digital marketing services cost?",
      answer:
        "Investment depends on your scope, channels, and growth targets. After an initial consultation, we recommend a transparent plan tailored to your stage and budget.",
    },
    {
      id: "faq-5",
      question: "How do I get started with SJ Media Labs?",
      answer:
        "Book a consultation using the form on this page or call our Hyderabad office directly. We will review your current digital presence and outline clear next steps.",
    },
  ],
}


export interface Template1CtaData {
  overline?: string
  headline?: string
  subtitle?: string
  ctaText?: string
  ctaHref?: string
}

export const defaultTemplate1CtaData: Required<Template1CtaData> = {
  overline: "INSPIRE. CONNECT. PERFORM.",
  headline: "Your Next Stage\nof Growth\nStarts Here.",
  subtitle:
    "Let's create a smarter digital strategy that connects your brand with the right people.",
  ctaText: "Book a Consultation",
  ctaHref: "#consultation-form",
}


export interface Template1FooterLink {
  label: string
  href: string
}

export interface Template1FooterData {
  logoUrl?: string
  logoText?: string
  taglineLine1?: string
  taglineLine2?: string
  logoHref?: string
  brandMotto?: string
  phoneText?: string
  phoneHref?: string
  emailText?: string
  emailHref?: string
  addressText?: string
  legalLinks?: Template1FooterLink[]
  copyrightText?: string
}

export const defaultTemplate1FooterData: Required<Template1FooterData> = {
  logoUrl: "",
  logoText: "SJML",
  taglineLine1: "BRANDING &",
  taglineLine2: "ADVERTISING",
  logoHref: "/",
  brandMotto: "Igniting Brilliance",
  phoneText: "+91 40 40268570",
  phoneHref: "tel:+914040268570",
  emailText: "info@sjmedialabs.com",
  emailHref: "mailto:info@sjmedialabs.com",
  addressText: "Hyderabad, Telangana, India",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  copyrightText: "© 2026 SJ Media Labs. All rights reserved.",
}
