const { MongoClient } = require('mongodb');
const fs = require('fs');

// Read .env file manually
const envFile = fs.readFileSync('.env', 'utf8');
const MONGODB_URI = envFile.match(/MONGODB_URI="(.+)"/)[1];

const testWork = {
  id: Date.now().toString(),
  slug: "urvi-constructions",
  title: "URVI CONSTRUCTIONS",
  description: "Complete brand identity and web design for a leading construction company",
  image: "/construction-branding.jpg",
  category: "Branding",
  client: "URVI Constructions",
  industry: "Real Estate",
  role: "Branding / Web Design",
  technology: "Web | UI | UX",
  year: "2025",
  tags: ["Logo & Identity", "Web Design", "Development"],
  overview: {
    title: "Brand Overview",
    description: "Complete brand identity redesign for a premier construction company.",
    points: ["Branding and identity", "Websites and digital platforms", "Content strategy"],
  },
  logoVariations: [],
  gallery: [],
  process: [
    { step: "01", title: "Discovery", description: "Understanding the brand vision and goals" },
    { step: "02", title: "Design", description: "Creating visual identity and web layouts" },
    { step: "03", title: "Development", description: "Building the final website" },
  ],
  showcase: [],
  isActive: true,
  isFeatured: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const testService = {
  id: Date.now().toString() + 1,
  slug: "branding",
  title: "Branding & Identity",
  description: "Strategic brand development, identity design, and brand management to create memorable experiences.",
  icon: "branding",
  linkText: "Explore Branding",
  image: "/branding-service.jpg",
  fullDescription: "We create comprehensive brand identities that resonate with your target audience.",
  offerings: [
    "Brand strategy development",
    "Logo and visual identity design",
    "Brand guidelines",
    "Brand messaging",
  ],
  benefits: {
    title: "Benefits of Strong Branding",
    description: "A well-crafted brand identity helps you stand out and connect with your audience.",
  },
  features: {
    title: "Key Features",
    points: ["Custom logo design", "Complete brand guidelines", "Marketing materials", "Brand positioning"],
  },
  process: [
    { icon: "thinking", title: "Discovery", description: "Understanding your vision and goals" },
    { icon: "design", title: "Design", description: "Creating your unique brand identity" },
    { icon: "launch", title: "Launch", description: "Implementing across all touchpoints" },
  ],
  faqs: [
    {
      question: "How long does the branding process take?",
      answer: "Typically 4-6 weeks depending on project scope.",
    },
  ],
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const testCaseStudy = {
  id: Date.now().toString() + 2,
  slug: "techcorp-rebranding",
  title: "TechCorp Global Rebranding",
  description: "Complete brand transformation resulting in 250% increase in brand recognition.",
  image: "/tech-branding-project.jpg",
  tags: ["Branding", "Strategy", "Identity"],
  stat1Label: "Brand Recognition",
  stat1Value: "250%",
  stat2Label: "Duration",
  stat2Value: "6 months",
  client: "TechCorp Global",
  industry: "Technology",
  year: "2024",
  challenge: "TechCorp needed a complete brand overhaul to compete in the modern tech landscape.",
  solution: "We developed a comprehensive brand strategy that included a new visual identity, messaging framework, and digital presence.",
  results: [
    "250% increase in brand recognition",
    "40% improvement in customer engagement",
    "Successfully attracted 3 major enterprise clients",
  ],
  gallery: ["/tech-brand-1.jpg", "/tech-brand-2.jpg"],
  testimonial: {
    quote: "The rebranding transformed our business.",
    author: "Sarah Johnson",
    role: "CEO",
    company: "TechCorp Global",
  },
  isActive: true,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('sjmedialabs');
    
    // Clear existing data
    await db.collection('works').deleteMany({});
    await db.collection('services').deleteMany({});
    await db.collection('case_studies').deleteMany({});
    console.log('Cleared existing collections\n');
    
    // Insert test data
    await db.collection('works').insertOne(testWork);
    console.log('✓ Inserted test work');
    
    await db.collection('services').insertOne(testService);
    console.log('✓ Inserted test service');
    
    await db.collection('case_studies').insertOne(testCaseStudy);
    console.log('✓ Inserted test case study');
    
    console.log('\n✓ Database seeded successfully!');
    console.log('\nYou can now visit:');
    console.log('- http://localhost:3000/work');
    console.log('- http://localhost:3000/services');
    console.log('- http://localhost:3000/case-studies');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

seed();
