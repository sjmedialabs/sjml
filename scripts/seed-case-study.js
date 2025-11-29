const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'sjmedialabs';

const sampleCaseStudy = {
  id: `${Date.now()}`,
  slug: "fintech-revolution-app",
  title: "FinTech Revolution Mobile App",
  description: "Revolutionary mobile banking app that transformed how millennials manage their finances, achieving 500K downloads in 3 months.",
  image: "/fintech-app-showcase.jpg",
  tags: ["Mobile App", "FinTech", "UI/UX", "Branding"],
  stat1Label: "Downloads",
  stat1Value: "500K+",
  stat2Label: "Duration",
  stat2Value: "5 months",
  client: "FinTech Revolution",
  industry: "Financial Technology",
  year: "2024",
  challenge: `FinTech Revolution wanted to enter the competitive digital banking space with a mobile-first approach targeting millennials and Gen Z. They faced several challenges:
  
• Existing banking apps were complex and intimidating for young users
• High drop-off rates during onboarding processes
• Low trust in digital-only banking solutions
• Need to comply with strict financial regulations while maintaining a modern UX
• Limited brand recognition in a crowded market`,

  solution: `We developed a comprehensive strategy focusing on simplicity, transparency, and trust:

**Research & Strategy**
- Conducted extensive user research with 200+ millennials
- Analyzed top 15 banking apps to identify pain points
- Developed user personas and journey maps

**Design Approach**
- Created a clean, minimalist interface with a focus on clarity
- Implemented gamification elements to encourage savings
- Designed a 3-step onboarding process (reduced from industry average of 7 steps)
- Used friendly, conversational micro-copy throughout

**Brand Identity**
- Developed a vibrant, approachable brand identity
- Created custom illustrations to explain complex financial concepts
- Designed a mascot to humanize the brand

**Technical Implementation**
- Built on React Native for cross-platform consistency
- Implemented biometric authentication for security
- Real-time transaction notifications and insights
- AI-powered spending analytics and recommendations`,

  results: [
    "500K+ downloads within first 3 months of launch",
    "4.8 star rating on App Store and Google Play (industry average: 3.2)",
    "92% onboarding completion rate (industry average: 45%)",
    "Featured in TechCrunch, Forbes, and Wall Street Journal",
    "Won 'Best FinTech Innovation' award at Mobile Banking Summit 2024",
    "85% user retention rate after 3 months (industry average: 35%)",
    "$2.5M in seed funding secured post-launch",
    "Expanded to 3 additional markets within 6 months"
  ],

  gallery: [
    "/fintech-app-onboarding.jpg",
    "/fintech-app-dashboard.jpg",
    "/fintech-app-analytics.jpg",
    "/fintech-app-savings.jpg",
    "/fintech-branding.jpg",
    "/fintech-app-notifications.jpg"
  ],

  testimonial: {
    quote: "SJ Media Labs didn't just build us an app – they transformed our entire approach to digital banking. The design is beautiful, intuitive, and our users absolutely love it. The 500K downloads in 3 months exceeded our wildest expectations!",
    author: "Michael Rodriguez",
    role: "CEO & Founder",
    company: "FinTech Revolution"
  },

  isActive: true,
  isFeatured: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function seedCaseStudy() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('case_studies');
    
    // Check if case study with this slug already exists
    const existing = await collection.findOne({ slug: sampleCaseStudy.slug });
    
    if (existing) {
      console.log('Case study already exists. Updating...');
      await collection.updateOne(
        { slug: sampleCaseStudy.slug },
        { $set: sampleCaseStudy }
      );
      console.log('✅ Case study updated successfully!');
    } else {
      console.log('Creating new case study...');
      await collection.insertOne(sampleCaseStudy);
      console.log('✅ Case study created successfully!');
    }
    
    console.log('\n📊 Case Study Details:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Title: ${sampleCaseStudy.title}`);
    console.log(`Slug: ${sampleCaseStudy.slug}`);
    console.log(`URL: http://localhost:3000/case-studies/${sampleCaseStudy.slug}`);
    console.log(`Tags: ${sampleCaseStudy.tags.join(', ')}`);
    console.log(`Stats: ${sampleCaseStudy.stat1Value} ${sampleCaseStudy.stat1Label} | ${sampleCaseStudy.stat2Value} ${sampleCaseStudy.stat2Label}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
  } catch (error) {
    console.error('❌ Error seeding case study:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedCaseStudy();
