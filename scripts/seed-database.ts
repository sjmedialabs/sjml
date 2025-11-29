import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("sjmedialabs")

    // Seed Admin User
    const adminsCollection = db.collection("admins")
    const existingAdmin = await adminsCollection.findOne({ email: "admin@sjmedialabs.com" })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("SJMedia@2025", 12)
      await adminsCollection.insertOne({
        email: "admin@sjmedialabs.com",
        password: hashedPassword,
        name: "Admin",
        role: "superadmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("Default admin created: admin@sjmedialabs.com / SJMedia@2025")
    } else {
      console.log("Admin user already exists")
    }

    // Seed Content
    const contentCollection = db.collection("content")

    // Home Page Content
    const existingHome = await contentCollection.findOne({ pageKey: "home" })
    if (!existingHome) {
      await contentCollection.insertOne({
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
            quote: "Working with SJ Media Labs transformed our brand completely.",
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
            description: "Exploring emerging trends.",
            image: "/digital-marketing-trends.png",
            date: "2024-01-15",
            category: "Marketing",
            readTime: "5 min",
            slug: "future-digital-marketing",
          },
        ],
        playbook: {
          title: "Get Our Brand Strategy Playbook",
          description: "Download our comprehensive guide.",
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
          metaDescription: "Transforming brands through innovative design.",
        },
        updatedAt: new Date(),
      })
      console.log("Home page content seeded")
    }

    // About Page Content
    const existingAbout = await contentCollection.findOne({ pageKey: "about" })
    if (!existingAbout) {
      await contentCollection.insertOne({
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
            "We're a full-service design agency specializing in branding, web design, and creative strategies.",
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
          {
            year: "2016 - 2017",
            title: "Dribbble Winner",
            description: "We design by getting to know you and your brand.",
          },
          {
            year: "2017 - 2018",
            title: "Design Of The Year",
            description: "We design by getting to know you and your brand.",
          },
          {
            year: "2018 - 2019",
            title: "Awwward Winner",
            description: "We design by getting to know you and your brand.",
          },
        ],
        vision: {
          badge: "Our Vision",
          title: "Driving the Future of",
          highlightedTitle: "Creativity",
          description:
            "We're a full-service design agency specializing in branding, web design, and creative strategies.",
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
          description:
            "We're a full-service design agency specializing in branding, web design, and creative strategies.",
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
            {
              id: "4",
              name: "Emily Davis",
              role: "Marketing Director",
              image: "/professional-blonde-woman-headshot.png",
            },
          ],
        },
        updatedAt: new Date(),
      })
      console.log("About page content seeded")
    }

    // Services Page Content
    const existingServices = await contentCollection.findOne({ pageKey: "services" })
    if (!existingServices) {
      await contentCollection.insertOne({
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
        updatedAt: new Date(),
      })
      console.log("Services page content seeded")
    }

    // Work Page Content
    const existingWork = await contentCollection.findOne({ pageKey: "work" })
    if (!existingWork) {
      await contentCollection.insertOne({
        pageKey: "work",
        hero: {
          title: "Elevate Beyond the Ordinary.",
          subtitle: "We're a creative agency dedicated to design that moves brands from good to unforgettable.",
          description: "We craft everything from branding and web design to 3D, motion, and UI/UX.",
        },
        portfolio: {
          title: "Our Portfolio",
          description: "Discover how we've helped brands achieve extraordinary results.",
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
        updatedAt: new Date(),
      })
      console.log("Work page content seeded")
    }

    // Careers Page Content
    const existingCareers = await contentCollection.findOne({ pageKey: "careers" })
    if (!existingCareers) {
      await contentCollection.insertOne({
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
        updatedAt: new Date(),
      })
      console.log("Careers page content seeded")
    }

    // Contact Page Content
    const existingContact = await contentCollection.findOne({ pageKey: "contact" })
    if (!existingContact) {
      await contentCollection.insertOne({
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
        contact: { title: "Contact Information", phone: "123-456-7890", email: "support@sjmedialabs.com" },
        updatedAt: new Date(),
      })
      console.log("Contact page content seeded")
    }

    // Case Studies Page Content
    const existingCaseStudies = await contentCollection.findOne({ pageKey: "case-studies" })
    if (!existingCaseStudies) {
      await contentCollection.insertOne({
        pageKey: "case-studies",
        hero: {
          title: "Case Studies",
          subtitle: "Explore our success stories",
          description: "Discover how we've helped brands achieve extraordinary results.",
        },
        section: { title: "Our Case Studies", description: "Real results for real businesses." },
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
        updatedAt: new Date(),
      })
      console.log("Case Studies page content seeded")
    }

    // Create indexes for better performance
    await adminsCollection.createIndex({ email: 1 }, { unique: true })
    await contentCollection.createIndex({ pageKey: 1 }, { unique: true })
    await db.collection("leads").createIndex({ createdAt: -1 })
    await db.collection("leads").createIndex({ source: 1 })
    await db.collection("leads").createIndex({ status: 1 })

    console.log("Database indexes created")
    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  } finally {
    await client.close()
  }
}

seedDatabase()
