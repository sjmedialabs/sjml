// Default content data for all pages
// This is used when database is empty or for initial seeding

export const defaultHomeContent = {
  pageKey: "home",
  hero: {
    title: "We're a Full-Service Creative Agency",
    description:
      "Transforming brands through innovative design, compelling storytelling, and strategic marketing solutions that drive real business results.",
    primaryButtonText: "Start a project",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "View our work",
    secondaryButtonUrl: "/work",
    rotatingWords: ["Digital Marketing", "Brand Strategy", "Web Development", "Creative Design"],
    backgroundImage: "",
  },
  stats: [
    { id: "1", value: "150+", label: "Projects Completed" },
    { id: "2", value: "50+", label: "Happy Clients" },
    { id: "3", value: "10+", label: "Years Experience" },
    { id: "4", value: "25+", label: "Team Members" },
  ],
  caseStudies: [
    {
      id: "1",
      title: "TechCorp Global Rebranding",
      description: "Complete brand transformation resulting in 250% increase in brand recognition.",
      image: "/tech-branding-project.jpg",
      tags: ["Branding", "Strategy"],
      stat1Label: "Brand Recognition",
      stat1Value: "250%",
      stat2Label: "Duration",
      stat2Value: "6 months",
      slug: "techcorp-rebranding",
    },
  ],
  services: [
    {
      id: "1",
      title: "Research & Strategy",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "research-strategy",
      image: "/research-strategy.jpg",
      link: "/services/research-strategy",
      slug: "research-strategy",
    },
    {
      id: "2",
      title: "Branding",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "branding",
      image: "/abstract-branding-elements.png",
      link: "/services/branding",
      slug: "branding",
    },
    {
      id: "3",
      title: "Web & Experience",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "web-experience",
      image: "/web-design-concept.png",
      link: "/services/web-experience",
      slug: "web-experience",
    },
    {
      id: "4",
      title: "Digital Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "digital-marketing",
      image: "/digital-marketing-strategy.png",
      link: "/services/digital-marketing",
      slug: "digital-marketing",
    },
    {
      id: "5",
      title: "Commercial Ads",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "commercial-ads",
      image: "/commercial-advertising.jpg",
      link: "/services/commercial-ads",
      slug: "commercial-ads",
    },
    {
      id: "6",
      title: "Advertising",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "advertising",
      image: "/advertising-campaign.jpg",
      link: "/services/advertising",
      slug: "advertising",
    },
    {
      id: "7",
      title: "Influencer Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "influencer-marketing",
      image: "/influencer-marketing.png",
      link: "/services/influencer-marketing",
      slug: "influencer-marketing",
    },
    {
      id: "8",
      title: "Affiliate Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "affiliate-marketing",
      image: "/affiliate-marketing-concept.png",
      link: "/services/affiliate-marketing",
      slug: "affiliate-marketing",
    },
  ],
  industries: [
    {
      id: "1",
      title: "Technology",
      description: "Innovative solutions for tech companies",
      image: "/technology-industry.png",
    },
    {
      id: "2",
      title: "Healthcare",
      description: "Digital transformation for healthcare",
      image: "/healthcare-industry.png",
    },
    { id: "3", title: "Finance", description: "Financial services marketing", image: "/finance-industry.jpg" },
    { id: "4", title: "Retail", description: "E-commerce and retail solutions", image: "/retail-industry.jpg" },
  ],
  testimonials: [
    {
      id: "1",
      quote:
        "Working with SJ Media Labs transformed our brand completely. Their strategic approach exceeded all expectations.",
      author: "Sarah Johnson",
      company: "TechCorp Inc.",
      image: "/professional-woman-headshot.png",
      rating: 5,
    },
  ],
  insights: [
    {
      id: "1",
      title: "The Future of Digital Marketing",
      description: "Exploring emerging trends and technologies shaping the digital marketing landscape.",
      image: "/digital-marketing-trends.png",
      date: "2024-01-15",
      category: "Marketing",
      readTime: "5 min",
      slug: "future-digital-marketing",
    },
  ],
  playbook: {
    title: "Get Our Brand Strategy Playbook",
    description: "Download our comprehensive guide to building a powerful brand presence in the digital age.",
    buttonText: "Download Free",
    buttonUrl: "/playbook",
    image: "/brand-strategy-playbook.jpg",
  },
  partners: [
    { id: "1", name: "Google", logo: "/google-logo.png" },
    { id: "2", name: "Meta", logo: "/meta-logo-abstract.png" },
    { id: "3", name: "Amazon", logo: "/amazon-logo.png" },
  ],
  footer: {
    address: "Realtor Office Building 5F, 123 Anywhere St., Any City, 12345 Any State",
    phone: "123-456-7890",
    email: "support@sjmedialabs.com",
    copyright: "© 2025 sjmedialabs All rights reserved.",
    newsletterText: "Subscribe to get the latest insights and updates.",
  },
  settings: {
    siteName: "SJ Media Labs",
    siteTagline: "Igniting Brilliance",
    metaTitle: "SJ Media Labs - Full-Service Creative Agency",
    metaDescription: "Transforming brands through innovative design, compelling storytelling, and strategic marketing.",
  },
}

export const defaultAboutContent = {
  pageKey: "about",
  hero: {
    title: "We are Creative Thinkers, Problem Solvers & Exceptional Communicators",
    highlightedText: "Creative Thinkers",
  },
  about: {
    badge: "About Us",
    title: "A team of",
    highlightedTitle: "creative thinkers",
    description:
      "We're a full-service design agency specializing in branding, web design, and creative strategies that elevate businesses.",
    image: "/modern-creative-team.png",
    values: [
      { title: "Creativity and Innovation", description: "" },
      { title: "Client-Centricity", description: "" },
      { title: "Integrity and Transparency", description: "" },
      { title: "Excellence and Quality", description: "" },
    ],
  },
  stats: [
    { value: "1000+", label: "Project Completed" },
    { value: "15+", label: "Years Of Experience" },
    { value: "100+", label: "Client Satisfaction" },
  ],
  achievements: [
    {
      year: "2015 - 2016",
      title: "Best Design Award",
      description: "We design by getting to know you and your brand.",
    },
    { year: "2016 - 2017", title: "Dribbble Winner", description: "We design by getting to know you and your brand." },
    {
      year: "2017 - 2018",
      title: "Design Of The Year",
      description: "We design by getting to know you and your brand.",
    },
    { year: "2018 - 2019", title: "Awwward Winner", description: "We design by getting to know you and your brand." },
  ],
  vision: {
    badge: "Our Vision",
    title: "Driving the Future of",
    highlightedTitle: "Creativity",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies.",
    image: "/social-media-marketing-dashboard-on-laptop.jpg",
    values: [
      { title: "Creativity and Innovation" },
      { title: "Client-Centricity" },
      { title: "Integrity and Transparency" },
    ],
  },
  mission: {
    badge: "Our Mission",
    title: "Bringing ideas to life through",
    highlightedTitle: "creativity",
    description: "We're a full-service design agency specializing in branding, web design, and creative strategies.",
    image: "/mobile-app-design-showcase-on-phone.jpg",
    values: [
      { title: "Creativity and Innovation" },
      { title: "Client-Centricity" },
      { title: "Integrity and Transparency" },
    ],
  },
  team: {
    badge: "Our Team",
    title: "The minds behind the",
    highlightedTitle: "magic",
    buttonText: "All Team Members",
    members: [
      { id: "1", name: "John Smith", role: "CEO & Founder", image: "/professional-man-headshot.png" },
      { id: "2", name: "Sarah Johnson", role: "Creative Director", image: "/professional-woman-headshot.png" },
      { id: "3", name: "Michael Chen", role: "Tech Lead", image: "/professional-asian-man-headshot.png" },
      { id: "4", name: "Emily Davis", role: "Marketing Director", image: "/professional-blonde-woman-headshot.png" },
    ],
  },
}

export const defaultServicesContent = {
  pageKey: "services",
  hero: {
    title: "Redefining Digital Success with Strategy, Design, and Development",
    highlightedWords: ["Success", "Strategy, Design"],
    backgroundImage: "/business-people-working-on-laptops-hands-typing-pr.jpg",
    watermark: "SERVICES",
  },
  section: {
    title: "Our Services we're providing",
    subtitle: "to our customers",
    description: "Comprehensive solutions to elevate your brand and drive business growth across all channels.",
  },
  services: [
    {
      id: "1",
      slug: "research-strategy",
      title: "Research & Strategy",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "research-strategy",
      linkText: "Explore Branding",
    },
    {
      id: "2",
      slug: "branding",
      title: "Branding",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "branding",
      linkText: "Explore Branding",
    },
    {
      id: "3",
      slug: "web-experience",
      title: "Web & Experience",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "web-experience",
      linkText: "Explore Branding",
    },
    {
      id: "4",
      slug: "digital-marketing",
      title: "Digital Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "digital-marketing",
      linkText: "Explore Branding",
    },
    {
      id: "5",
      slug: "commercial-ads",
      title: "Commercial Ads",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "commercial-ads",
      linkText: "Explore Branding",
    },
    {
      id: "6",
      slug: "advertising",
      title: "Advertising",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "advertising",
      linkText: "Explore Branding",
    },
    {
      id: "7",
      slug: "influencer-marketing",
      title: "Influencer Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "influencer-marketing",
      linkText: "Explore Branding",
    },
    {
      id: "8",
      slug: "affiliate-marketing",
      title: "Affiliate Marketing",
      description: "Strategic brand development, identity design, and brand management.",
      icon: "affiliate-marketing",
      linkText: "Explore Branding",
    },
  ],
}

export const defaultWorkContent = {
  pageKey: "work",
  hero: {
    title: "Elevate Beyond the Ordinary.",
    subtitle: "We're a creative agency dedicated to design that moves brands from good to unforgettable.",
    description: "We craft everything from branding and web design to 3D, motion, and UI/UX.",
  },
  portfolio: {
    title: "Our Portfolio",
    description: "Discover how we've helped brands achieve extraordinary results through innovative strategies.",
  },
  projects: [
    {
      id: "1",
      slug: "techcorp-rebranding",
      title: "TechCorp Global Rebranding",
      description: "Complete brand transformation.",
      image: "/tech-branding.jpg",
    },
    {
      id: "2",
      slug: "unve-design",
      title: "Unve Design System",
      description: "Complete brand transformation.",
      image: "/design-system-abstract.png",
    },
    {
      id: "3",
      slug: "medicare-platform",
      title: "MediCare+ Patient Platform",
      description: "Award-winning healthcare platform.",
      image: "/healthcare-app-interface.png",
    },
  ],
}

export const defaultCaseStudiesContent = {
  pageKey: "case-studies",
  hero: {
    title: "Case Studies",
    subtitle: "Explore our success stories",
    description: "Discover how we've helped brands achieve extraordinary results.",
  },
  section: {
    title: "Our Case Studies",
    description: "Real results for real businesses.",
  },
  caseStudies: [
    {
      id: "1",
      slug: "techcorp-rebranding",
      title: "TechCorp Global Rebranding",
      description: "Complete brand transformation.",
      image: "/tech-branding-project.jpg",
      tags: ["Branding", "Strategy"],
      stat1Label: "Brand Recognition",
      stat1Value: "250%",
      stat2Label: "Duration",
      stat2Value: "6 months",
    },
  ],
}

export const defaultCareersContent = {
  pageKey: "careers",
  heroTitle: "Join Our Team",
  heroSubtitle: "Build your career with us",
  culture: {
    title: "Our Culture",
    description: "We believe in fostering creativity, collaboration, and continuous growth.",
    values: [
      { title: "Innovation", description: "We encourage bold ideas" },
      { title: "Collaboration", description: "We work together" },
      { title: "Growth", description: "We invest in our people" },
    ],
  },
  benefits: [
    { icon: "health", title: "Health Insurance", description: "Comprehensive health coverage" },
    { icon: "vacation", title: "Paid Time Off", description: "Generous vacation policy" },
    { icon: "learning", title: "Learning Budget", description: "Annual learning allowance" },
  ],
  jobs: [],
}

export const defaultContactContent = {
  pageKey: "contact",
  hero: {
    title: "Let's Work Together",
    subtitle: "Get in touch with us",
    backgroundImage: "/contact-hero-bg.jpg",
  },
  form: {
    badge: "Contact Us",
    title: "Send us a message",
    highlightedWords: ["message"],
    buttonText: "Send Message",
  },
  offices: [{ country: "United States", flag: "🇺🇸", address: "123 Business Ave, New York, NY 10001" }],
  contact: {
    title: "Contact Information",
    phone: "123-456-7890",
    email: "support@sjmedialabs.com",
  },
}

export const defaultInsightsContent = {
  pageKey: "insights",
  hero: {
    title: "Insights & Resources",
    subtitle: "Expert perspectives on branding, marketing, and digital transformation.",
  },
  posts: [
    {
      id: "1",
      title: "The Ultimate Guide to Brand Strategy in 2024",
      excerpt:
        "Discover the essential elements that make up a successful brand strategy in today's rapidly evolving digital landscape.",
      image: "/brand-strategy-guide.jpg",
      category: "Brand Strategy",
      author: "John Smith",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      slug: "brand-strategy-2024",
    },
    {
      id: "2",
      title: "10 Digital Marketing Trends You Can't Ignore",
      excerpt:
        "As we head into the new year, here are the top digital marketing trends that will shape how brands connect with audiences.",
      image: "/digital-marketing-trends.png",
      category: "Digital Marketing",
      author: "Sarah Johnson",
      date: "Dec 12, 2024",
      readTime: "6 min read",
      slug: "digital-marketing-trends",
    },
    {
      id: "3",
      title: "UX Design Best Practices for Conversion",
      excerpt:
        "Learn how thoughtful UX design can dramatically improve your website's conversion rates and user satisfaction.",
      image: "/ux-design-conversion.jpg",
      category: "UX Design",
      author: "Michael Chen",
      date: "Dec 10, 2024",
      readTime: "5 min read",
      slug: "ux-design-conversion",
    },
  ],
  categories: ["All", "Brand Strategy", "Digital Marketing", "UX Design", "Social Media", "Content Marketing", "SEO"],
  newsletter: {
    title: "Subscribe to Our Newsletter",
    description: "Get the latest insights and resources delivered to your inbox.",
    buttonText: "Subscribe",
  },
}

export const defaultTestimonialsContent = {
  pageKey: "testimonials",
  hero: {
    title: "What Our Clients Say",
    subtitle: "Don't just take our word for it. Hear from the brands we've helped transform.",
  },
  testimonials: [
    {
      id: "1",
      quote:
        "This is due to their excellent service, competitive pricing and customer support. It's thoroughly refreshing to get such a personal touch.",
      author: "Archana Patel",
      role: "CEO",
      company: "MediTravel",
      image: "/professional-indian-woman.png",
      rating: 5,
    },
    {
      id: "2",
      quote:
        "Working with SJ Media Labs transformed our brand presence. Their strategic approach and creative execution exceeded all expectations.",
      author: "Michael Chen",
      role: "Founder",
      company: "TechVentures",
      image: "/professional-asian-man.png",
      rating: 5,
    },
    {
      id: "3",
      quote:
        "The team's dedication to understanding our business needs resulted in a website that truly represents our brand values.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "GreenLeaf Co",
      image: "/professional-blonde-woman.png",
      rating: 5,
    },
  ],
  cta: {
    title: "Ready to Join Our Success Stories?",
    description: "Let's create something extraordinary together.",
    buttonText: "Start Your Project",
    buttonUrl: "/contact",
  },
}

export const defaultClientsContent = {
  pageKey: "clients",
  hero: {
    title: "Our Clients",
    subtitle: "Trusted by industry leaders worldwide to deliver exceptional results.",
  },
  clients: [
    { id: "1", name: "TechCorp", logo: "/tech-company-logo.jpg", industry: "Technology" },
    { id: "2", name: "FinanceFlow", logo: "/finance-company-logo.png", industry: "Finance" },
    { id: "3", name: "MediCare+", logo: "/healthcare-company-logo.png", industry: "Healthcare" },
    { id: "4", name: "GreenLeaf", logo: "/eco-company-logo.png", industry: "Retail" },
    { id: "5", name: "AutoDrive", logo: "/automotive-company-logo.png", industry: "Automotive" },
    { id: "6", name: "FoodieHub", logo: "/food-delivery-logo.png", industry: "Food & Beverage" },
  ],
  industries: ["All Industries", "Technology", "Finance", "Healthcare", "Retail", "Automotive", "Education"],
  stats: [
    { value: "200+", label: "Happy Clients" },
    { value: "40+", label: "Countries" },
    { value: "98%", label: "Client Retention" },
    { value: "500+", label: "Projects Completed" },
  ],
  cta: {
    title: "Join Our Growing Client List",
    description: "Partner with us and experience the difference.",
    buttonText: "Become a Client",
    buttonUrl: "/contact",
  },
}

export function getDefaultPageContent(page: string) {
  const defaults: Record<string, any> = {
    home: defaultHomeContent,
    about: defaultAboutContent,
    services: defaultServicesContent,
    work: defaultWorkContent,
    "case-studies": defaultCaseStudiesContent,
    careers: defaultCareersContent,
    contact: defaultContactContent,
    insights: defaultInsightsContent,
    testimonials: defaultTestimonialsContent,
    clients: defaultClientsContent,
  }
  return defaults[page] || {}
}
