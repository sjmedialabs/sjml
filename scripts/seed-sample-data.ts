import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "sjmedialabs"

console.log("🔗 Connecting to:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"))

async function seedDatabase() {
  const client = await MongoClient.connect(MONGODB_URI)
  const db = client.db(DB_NAME)

  console.log("🌱 Starting database seeding...")

  // Clear existing data to avoid duplicates
  await db.collection("works").deleteMany({})
  await db.collection("services").deleteMany({})
  await db.collection("case-studies").deleteMany({})
  await db.collection("insights").deleteMany({})
  await db.collection("clients").deleteMany({})
  await db.collection("testimonials").deleteMany({})
  await db.collection("careers").deleteMany({})
  console.log("🗑️  Cleared existing data")

  // =====================
  // WORKS / PORTFOLIO
  // =====================
  const works = [
    {
      id: "1",
      slug: "urban-retail-rebrand",
      title: "Urban Retail Rebrand",
      description: "Complete brand transformation for a leading urban retail chain",
      image: "/placeholder.svg?height=400&width=600",
      category: "Branding",
      client: "Urban Trends Inc",
      industry: "Retail",
      role: "Brand Strategy / Visual Identity",
      technology: "Brand Guidelines | UI/UX",
      year: "2024",
      tags: ["Brand Identity", "Retail", "Visual Design"],
      overview: {
        title: "Project Overview",
        description: "A comprehensive rebranding project that modernized the entire brand identity while maintaining customer loyalty.",
        points: [
          "Strategic brand positioning",
          "Complete visual identity redesign",
          "Multi-channel brand rollout"
        ]
      },
      logoVariations: [],
      gallery: [],
      process: [
        { step: "01", title: "Research & Discovery", description: "Understanding market position and customer perceptions" },
        { step: "02", title: "Brand Strategy", description: "Defining brand positioning and messaging" },
        { step: "03", title: "Visual Design", description: "Creating the new visual identity system" },
        { step: "04", title: "Implementation", description: "Rolling out across all touchpoints" }
      ],
      showcase: [],
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      slug: "fintech-app-design",
      title: "FinTech Mobile App",
      description: "User-centered mobile banking application design",
      image: "/placeholder.svg?height=400&width=600",
      category: "Digital Product",
      client: "PayFlow Solutions",
      industry: "Financial Technology",
      role: "UX/UI Design / Product Strategy",
      technology: "React Native | Node.js",
      year: "2024",
      tags: ["Mobile App", "FinTech", "UX Design"],
      overview: {
        title: "Project Overview",
        description: "Designed an intuitive mobile banking experience that increased user engagement by 150%.",
        points: [
          "User research and persona development",
          "Wireframing and prototyping",
          "Visual design and design system"
        ]
      },
      logoVariations: [],
      gallery: [],
      process: [
        { step: "01", title: "User Research", description: "Understanding user needs and pain points" },
        { step: "02", title: "Wireframing", description: "Creating low-fidelity prototypes" },
        { step: "03", title: "Visual Design", description: "High-fidelity UI design" },
        { step: "04", title: "Testing", description: "User testing and iterations" }
      ],
      showcase: [],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      slug: "eco-wellness-brand",
      title: "Eco Wellness Brand Launch",
      description: "Brand creation for sustainable wellness products",
      image: "/placeholder.svg?height=400&width=600",
      category: "Branding",
      client: "Green Vitality",
      industry: "Health & Wellness",
      role: "Brand Strategy / Packaging Design",
      technology: "Brand Identity | Packaging",
      year: "2024",
      tags: ["Sustainability", "Packaging", "Brand Launch"],
      overview: {
        title: "Project Overview",
        description: "Launched a new eco-conscious wellness brand with emphasis on sustainability and natural aesthetics.",
        points: [
          "Sustainable packaging design",
          "Brand storytelling",
          "Market launch strategy"
        ]
      },
      logoVariations: [],
      gallery: [],
      process: [
        { step: "01", title: "Brand Strategy", description: "Defining the eco-conscious positioning" },
        { step: "02", title: "Identity Design", description: "Creating nature-inspired visual identity" },
        { step: "03", title: "Packaging", description: "Sustainable packaging solutions" }
      ],
      showcase: [],
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("works").insertMany(works)
  console.log("✅ Works/Portfolio data seeded")

  // =====================
  // SERVICES
  // =====================
  const services = [
    {
      id: "1",
      slug: "brand-strategy",
      title: "Brand Strategy & Identity",
      description: "Strategic brand development, identity design, and brand management to create memorable experiences.",
      icon: "strategy",
      linkText: "Explore Service",
      image: "/placeholder.svg?height=400&width=600",
      fullDescription: "We help businesses define their brand purpose, position, and personality through strategic planning and creative execution.",
      offerings: [
        "Brand positioning and messaging",
        "Visual identity design",
        "Brand guidelines and systems",
        "Brand audits and refreshes",
        "Naming and tagline development"
      ],
      benefits: {
        title: "Why Brand Strategy Matters",
        description: "A strong brand strategy differentiates you from competitors and builds lasting customer relationships."
      },
      features: {
        title: "Our Approach",
        points: ["Research-driven insights", "Strategic positioning", "Creative excellence", "Consistent execution"]
      },
      process: [
        { icon: "research", title: "Discovery", description: "Understanding your business and market" },
        { icon: "strategy", title: "Strategy", description: "Defining positioning and messaging" },
        { icon: "design", title: "Design", description: "Creating visual identity" },
        { icon: "launch", title: "Launch", description: "Implementation and rollout" }
      ],
      faqs: [
        {
          question: "How long does brand strategy take?",
          answer: "Typically 6-8 weeks depending on project scope and complexity."
        },
        {
          question: "What deliverables do I receive?",
          answer: "Brand guidelines, logo files, color palettes, typography systems, and application examples."
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      slug: "web-design-development",
      title: "Web Design & Development",
      description: "User-centered websites and digital experiences that drive engagement and conversions.",
      icon: "globe",
      linkText: "Explore Service",
      image: "/placeholder.svg?height=400&width=600",
      fullDescription: "We create beautiful, functional websites that deliver exceptional user experiences and business results.",
      offerings: [
        "Website design and development",
        "E-commerce solutions",
        "Web applications",
        "Responsive design",
        "CMS implementation"
      ],
      benefits: {
        title: "Digital Excellence",
        description: "Your website is often the first impression customers have of your brand. Make it count."
      },
      features: {
        title: "What We Deliver",
        points: ["Mobile-first design", "Fast performance", "SEO optimized", "Scalable architecture"]
      },
      process: [
        { icon: "plan", title: "Planning", description: "Sitemap and wireframes" },
        { icon: "design", title: "Design", description: "Visual design and prototypes" },
        { icon: "develop", title: "Development", description: "Front-end and back-end coding" },
        { icon: "launch", title: "Launch", description: "Testing and deployment" }
      ],
      faqs: [
        {
          question: "What technologies do you use?",
          answer: "We use modern frameworks like React, Next.js, and Node.js for optimal performance."
        }
      ],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      slug: "digital-marketing",
      title: "Digital Marketing",
      description: "Data-driven marketing strategies that increase visibility and drive growth.",
      icon: "trending",
      linkText: "Explore Service",
      image: "/placeholder.svg?height=400&width=600",
      fullDescription: "Comprehensive digital marketing services to reach your audience and achieve your business goals.",
      offerings: [
        "SEO and content marketing",
        "Social media strategy",
        "PPC advertising",
        "Email marketing campaigns",
        "Analytics and reporting"
      ],
      benefits: {
        title: "Measurable Growth",
        description: "Data-driven strategies that deliver real ROI and sustainable growth."
      },
      features: {
        title: "Our Services",
        points: ["Multi-channel campaigns", "Performance tracking", "Audience targeting", "Continuous optimization"]
      },
      process: [
        { icon: "research", title: "Audit", description: "Analyzing current performance" },
        { icon: "strategy", title: "Strategy", description: "Developing marketing plan" },
        { icon: "execute", title: "Execute", description: "Implementing campaigns" },
        { icon: "optimize", title: "Optimize", description: "Continuous improvement" }
      ],
      faqs: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("services").insertMany(services)
  console.log("✅ Services data seeded")

  // =====================
  // CASE STUDIES
  // =====================
  const caseStudies = [
    {
      id: "1",
      slug: "tech-startup-growth",
      title: "TechVision Growth Strategy",
      client: "TechVision Inc",
      industry: "Technology",
      tags: ["Digital Marketing", "Brand Strategy", "Growth"],
      description: "Helped a B2B SaaS startup achieve 300% growth in 12 months through integrated marketing strategy.",
      challenge: "TechVision struggled with low brand awareness and needed to establish credibility in a competitive market.",
      solution: "We developed a comprehensive brand and content strategy, optimized their digital presence, and launched targeted campaigns.",
      results: [
        "300% increase in qualified leads",
        "150% growth in organic traffic",
        "85% improvement in conversion rate"
      ],
      image: "/placeholder.svg?height=400&width=600",
      gallery: [],
      stats: [
        { label: "Lead Growth", value: "300%" },
        { label: "Traffic Increase", value: "150%" },
        { label: "Conversion Rate", value: "+85%" }
      ],
      stat1Value: "300%",
      stat1Label: "Growth",
      stat2Value: "12 months",
      stat2Label: "Duration",
      testimonial: {
        quote: "SJ Media Labs transformed our entire go-to-market strategy. The results exceeded our expectations.",
        author: "Sarah Chen",
        role: "CEO, TechVision"
      },
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      slug: "retail-digital-transformation",
      title: "Retail Chain Digital Transformation",
      client: "Metro Retail Group",
      industry: "Retail",
      tags: ["E-commerce", "Digital Transformation", "UX Design"],
      description: "Transformed a traditional retail chain into an omnichannel powerhouse with seamless online and offline experiences.",
      challenge: "Declining foot traffic and lack of online presence threatened the business model.",
      solution: "Built a comprehensive e-commerce platform, mobile app, and integrated in-store digital experiences.",
      results: [
        "250% increase in online sales",
        "40% of revenue now from digital channels",
        "92% customer satisfaction score"
      ],
      image: "/placeholder.svg?height=400&width=600",
      gallery: [],
      stats: [
        { label: "Online Sales", value: "+250%" },
        { label: "Digital Revenue", value: "40%" },
        { label: "Satisfaction", value: "92%" }
      ],
      stat1Value: "+250%",
      stat1Label: "Sales",
      stat2Value: "40%",
      stat2Label: "Digital Revenue",
      testimonial: {
        quote: "They didn't just build us a website—they transformed our entire business model.",
        author: "Michael Rodriguez",
        role: "Director of Digital, Metro Retail"
      },
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("case-studies").insertMany(caseStudies)
  console.log("✅ Case Studies data seeded")

  // =====================
  // INSIGHTS / BLOG
  // =====================
  const insights = [
    {
      id: "1",
      slug: "brand-strategy-2024",
      title: "5 Brand Strategy Trends Shaping 2024",
      excerpt: "Discover the emerging brand strategy trends that forward-thinking companies are leveraging for competitive advantage.",
      content: "The landscape of brand strategy is evolving rapidly. Here are the key trends we're seeing...\n\n1. Purpose-driven branding\n2. Hyper-personalization\n3. Sustainability storytelling\n4. Community-building\n5. AI-enhanced experiences\n\nEach of these trends represents an opportunity for brands to connect more deeply with their audiences.",
      image: "/placeholder.svg?height=400&width=600",
      category: "Brand Strategy",
      author: "Jessica Williams",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-01-15",
      readTime: "5 min read",
      tags: ["Branding", "Strategy", "Trends"],
      pdfUrl: "/sample-insight-brand-strategy.pdf",
      featured: true,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      slug: "web-design-best-practices",
      title: "Web Design Best Practices for 2024",
      excerpt: "Essential web design principles and best practices to create engaging, high-performing websites.",
      content: "Modern web design requires balancing aesthetics with functionality...\n\nKey principles:\n- Mobile-first approach\n- Fast loading times\n- Accessibility\n- Clear information hierarchy\n- Intuitive navigation",
      image: "/placeholder.svg?height=400&width=600",
      category: "Web Design",
      author: "David Park",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-01-10",
      readTime: "7 min read",
      tags: ["Web Design", "UX", "Best Practices"],
      pdfUrl: "/sample-insight-web-design.pdf",
      featured: false,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      slug: "digital-marketing-roi",
      title: "Maximizing Digital Marketing ROI",
      excerpt: "Proven strategies to improve your digital marketing return on investment and drive sustainable growth.",
      content: "Understanding and improving your marketing ROI is crucial for business success...\n\nStrategies covered:\n- Attribution modeling\n- Channel optimization\n- Conversion rate optimization\n- Customer lifetime value\n- Data-driven decision making",
      image: "/placeholder.svg?height=400&width=600",
      category: "Digital Marketing",
      author: "Emily Thompson",
      authorImage: "/placeholder.svg?height=100&width=100",
      date: "2024-01-05",
      readTime: "6 min read",
      tags: ["Marketing", "ROI", "Analytics"],
      pdfUrl: "/sample-insight-marketing-roi.pdf",
      featured: false,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("insights").insertMany(insights)
  console.log("✅ Insights/Blog data seeded")

  // =====================
  // CLIENTS
  // =====================
  const clients = [
    {
      id: "1",
      name: "TechVision Inc",
      logo: "/placeholder.svg?height=80&width=200",
      industry: "Technology",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      name: "Metro Retail Group",
      logo: "/placeholder.svg?height=80&width=200",
      industry: "Retail",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      name: "Green Vitality",
      logo: "/placeholder.svg?height=80&width=200",
      industry: "Health & Wellness",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      name: "PayFlow Solutions",
      logo: "/placeholder.svg?height=80&width=200",
      industry: "FinTech",
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "5",
      name: "Urban Trends Inc",
      logo: "/placeholder.svg?height=80&width=200",
      industry: "Retail",
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("clients").insertMany(clients)
  console.log("✅ Clients data seeded")

  // =====================
  // TESTIMONIALS
  // =====================
  const testimonials = [
    {
      id: "1",
      quote: "SJ Media Labs transformed our brand and helped us achieve unprecedented growth. Their strategic approach and creative execution are unmatched.",
      author: "Sarah Chen",
      role: "CEO",
      company: "TechVision Inc",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      quote: "Working with this team was a game-changer for our business. They didn't just deliver a project—they became true partners in our success.",
      author: "Michael Rodriguez",
      role: "Director of Digital",
      company: "Metro Retail Group",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      quote: "The attention to detail and commitment to our brand vision was exceptional. Highly recommend for any serious branding project.",
      author: "Jennifer Lee",
      role: "Founder",
      company: "Green Vitality",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      quote: "Their UX expertise helped us create a product our users love. The results speak for themselves—150% increase in user engagement.",
      author: "Alex Kumar",
      role: "Product Manager",
      company: "PayFlow Solutions",
      image: "/placeholder.svg?height=100&width=100",
      rating: 5,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("testimonials").insertMany(testimonials)
  console.log("✅ Testimonials data seeded")

  // =====================
  // CAREERS
  // =====================
  const careers = [
    {
      id: "1",
      title: "Senior Brand Strategist",
      department: "Strategy",
      location: "Remote / Hybrid",
      type: "Full-time",
      description: "We're looking for an experienced brand strategist to lead client projects and mentor junior team members.",
      requirements: [
        "5+ years of brand strategy experience",
        "Strong portfolio of brand work",
        "Excellent communication skills",
        "Experience leading client workshops",
        "Strategic thinking and analytical skills"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "401(k) matching",
        "Professional development budget",
        "Flexible work arrangements"
      ],
      salary: "$90,000 - $130,000",
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Join our design team to create beautiful, functional digital experiences for leading brands.",
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in Figma",
        "Strong portfolio",
        "Understanding of design systems",
        "Collaborative mindset"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Remote work",
        "Latest design tools",
        "Learning opportunities"
      ],
      salary: "$70,000 - $100,000",
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      title: "Full-Stack Developer",
      department: "Engineering",
      location: "Remote / Hybrid",
      type: "Full-time",
      description: "Build amazing web experiences using modern technologies and best practices.",
      requirements: [
        "4+ years of full-stack development",
        "React, Next.js, Node.js experience",
        "Database design skills",
        "API development",
        "Problem-solving ability"
      ],
      benefits: [
        "Competitive salary",
        "Health insurance",
        "Flexible hours",
        "Tech stipend",
        "Conference attendance"
      ],
      salary: "$100,000 - $140,000",
      published: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      title: "Content Strategist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Develop content strategies that drive engagement and deliver business results.",
      requirements: [
        "3+ years in content strategy",
        "Excellent writing skills",
        "SEO knowledge",
        "Analytics experience",
        "Creative thinking"
      ],
      benefits: [],
      salary: "$65,000 - $85,000",
      published: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  await db.collection("careers").insertMany(careers)
  console.log("✅ Careers data seeded")

  await client.close()
  console.log("\n🎉 Database seeding completed successfully!")
  console.log("\nSummary:")
  console.log(`- ${works.length} portfolio items`)
  console.log(`- ${services.length} services`)
  console.log(`- ${caseStudies.length} case studies`)
  console.log(`- ${insights.length} blog posts`)
  console.log(`- ${clients.length} clients`)
  console.log(`- ${testimonials.length} testimonials`)
  console.log(`- ${careers.length} job postings`)
}

seedDatabase().catch(console.error)
