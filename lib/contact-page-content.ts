/** Contact page (`/contact`) content + typography. */

export interface ContactPageHero {
  titleLine1: string
  titleHighlight: string
  titleLine2: string
  description: string
  image: string
}

export interface ContactInfoItem {
  id: string
  icon: "address" | "phone" | "email" | "hours"
  value: string
  href?: string
}

export interface ContactInfoBlock {
  label: string
  heading: string
  items: ContactInfoItem[]
  emailCalloutText: string
  emailCalloutEmail: string
}

export interface ContactFormBlock {
  label: string
  heading: string
  namePlaceholder: string
  emailPlaceholder: string
  phonePlaceholder: string
  companyPlaceholder: string
  servicePlaceholder: string
  serviceOptions: string[]
  messagePlaceholder: string
  privacyLabel: string
  privacyUrl: string
  buttonText: string
}

export interface ContactMapBlock {
  embedUrl: string
}

export interface ContactBottomCta {
  text: string
  buttonText: string
  buttonUrl: string
}

export interface ContactPageTypography {
  heroTitleFontSize: number
  heroDescriptionFontSize: number
  sectionLabelFontSize: number
  sectionHeadingFontSize: number
  infoValueFontSize: number
  formLabelFontSize: number
  ctaTextFontSize: number
  ctaButtonFontSize: number
}

export interface NormalizedContactPageContent {
  hero: ContactPageHero
  info: ContactInfoBlock
  form: ContactFormBlock
  map: ContactMapBlock
  bottomCta: ContactBottomCta
  typography: ContactPageTypography
}

export const DEFAULT_CONTACT_PAGE_TYPOGRAPHY: ContactPageTypography = {
  heroTitleFontSize: 36,
  heroDescriptionFontSize: 14,
  sectionLabelFontSize: 11,
  sectionHeadingFontSize: 28,
  infoValueFontSize: 14,
  formLabelFontSize: 13,
  ctaTextFontSize: 15,
  ctaButtonFontSize: 11,
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1540?auto=format&fit=crop&w=1200&q=80"

const DEFAULT_MAP_EMBED =
  "https://maps.google.com/maps?q=Road+No+36+Jubilee+Hills+Hyderabad+Telangana&t=&z=15&ie=UTF8&iwloc=&output=embed"

export function createDefaultContactPageContent(): NormalizedContactPageContent {
  return {
    hero: {
      titleLine1: "Let's create",
      titleHighlight: "something great",
      titleLine2: "together.",
      description: "Have a project in mind or just want to say hello? We'd love to hear from you.",
      image: DEFAULT_HERO_IMAGE,
    },
    info: {
      label: "GET IN TOUCH",
      heading: "We're here to help",
      items: [
        {
          id: "address",
          icon: "address",
          value:
            "SJ Media Labs Pvt. Ltd. Plot No. 8-2-293/82/A/1130, Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033, India",
        },
        {
          id: "phone",
          icon: "phone",
          value: "+91 86393 50029",
          href: "tel:+918639350029",
        },
        {
          id: "email",
          icon: "email",
          value: "hello@sjmlabs.com",
          href: "mailto:hello@sjmlabs.com",
        },
        {
          id: "hours",
          icon: "hours",
          value: "Monday - Saturday, 10:00 AM - 7:00 PM",
        },
      ],
      emailCalloutText: "Prefer to write to us? Drop us an email anytime.",
      emailCalloutEmail: "hello@sjmlabs.com",
    },
    form: {
      label: "SEND A MESSAGE",
      heading: "Tell us about your project",
      namePlaceholder: "Your Name*",
      emailPlaceholder: "Your Email*",
      phonePlaceholder: "Phone Number*",
      companyPlaceholder: "Company Name",
      servicePlaceholder: "What service are you looking for?",
      serviceOptions: [
        "Branding",
        "Advertising",
        "Digital Marketing",
        "Web & Experience",
        "Motion & Video",
        "Packaging Design",
      ],
      messagePlaceholder: "Tell us about your project*",
      privacyLabel: "I agree to the Privacy Policy",
      privacyUrl: "/privacy-policy",
      buttonText: "SEND MESSAGE",
    },
    map: {
      embedUrl: DEFAULT_MAP_EMBED,
    },
    bottomCta: {
      text: "Ready to start your project? Let's discuss how we can help your brand grow.",
      buttonText: "LET'S TALK",
      buttonUrl: "/contact",
    },
    typography: { ...DEFAULT_CONTACT_PAGE_TYPOGRAPHY },
  }
}

export function normalizeContactPageContent(data: Record<string, unknown>): NormalizedContactPageContent {
  const defaults = createDefaultContactPageContent()
  const page = (data.contactPage as Record<string, unknown>) ?? data
  const heroRaw = (page.hero as Partial<ContactPageHero & { title?: string; subtitle?: string }>) ?? {}

  return {
    hero: {
      titleLine1: heroRaw.titleLine1 ?? defaults.hero.titleLine1,
      titleHighlight: heroRaw.titleHighlight ?? defaults.hero.titleHighlight,
      titleLine2: heroRaw.titleLine2 ?? defaults.hero.titleLine2,
      description:
        heroRaw.description ?? heroRaw.subtitle ?? (heroRaw as { subtitle?: string }).subtitle ?? defaults.hero.description,
      image: heroRaw.image ?? (heroRaw as { backgroundImage?: string }).backgroundImage ?? defaults.hero.image,
    },
    info: {
      ...defaults.info,
      ...(page.info as Partial<ContactInfoBlock>),
      items: Array.isArray((page.info as ContactInfoBlock)?.items)
        ? (page.info as ContactInfoBlock).items
        : defaults.info.items,
    },
    form: {
      ...defaults.form,
      ...(page.form as Partial<ContactFormBlock>),
      serviceOptions: Array.isArray((page.form as ContactFormBlock)?.serviceOptions)
        ? (page.form as ContactFormBlock).serviceOptions
        : defaults.form.serviceOptions,
    },
    map: { ...defaults.map, ...(page.map as Partial<ContactMapBlock>) },
    bottomCta: { ...defaults.bottomCta, ...(page.bottomCta as Partial<ContactBottomCta>) },
    typography: { ...defaults.typography, ...((page.typography as Partial<ContactPageTypography>) ?? {}) },
  }
}
