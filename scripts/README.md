# Database Seeding

This directory contains scripts to populate your MongoDB database with sample data.

## Running the Seed Script

### Prerequisites
- MongoDB connection string set in your `.env.local` file
- Install tsx if not already installed: `npm install -D tsx`

### Run the Seed Script

```bash
npm run seed
```

Or directly with tsx:

```bash
npx tsx scripts/seed-sample-data.ts
```

## What Gets Seeded

The seed script populates the following collections with sample data:

### 1. **Works / Portfolio** (3 items)
- Urban Retail Rebrand
- FinTech Mobile App
- Eco Wellness Brand Launch

### 2. **Services** (3 items)
- Brand Strategy & Identity
- Web Design & Development
- Digital Marketing

### 3. **Case Studies** (2 items)
- TechVision Growth Strategy
- Retail Chain Digital Transformation

### 4. **Insights / Blog** (3 posts)
- 5 Brand Strategy Trends Shaping 2024
- Web Design Best Practices for 2024
- Maximizing Digital Marketing ROI

### 5. **Clients** (5 clients)
- TechVision Inc
- Metro Retail Group
- Green Vitality
- PayFlow Solutions
- Urban Trends Inc

### 6. **Testimonials** (4 testimonials)
Sample testimonials from various clients

### 7. **Careers** (4 job postings)
- Senior Brand Strategist
- UI/UX Designer
- Full-Stack Developer
- Content Strategist

## Clearing Data

By default, the seed script does NOT clear existing data. If you want to clear data before seeding:

1. Open `scripts/seed-sample-data.ts`
2. Uncomment the `deleteMany` lines at the top of the `seedDatabase` function:

```typescript
await db.collection("works").deleteMany({})
await db.collection("services").deleteMany({})
await db.collection("case-studies").deleteMany({})
await db.collection("insights").deleteMany({})
await db.collection("clients").deleteMany({})
await db.collection("testimonials").deleteMany({})
await db.collection("careers").deleteMany({})
```

## Environment Variables

Make sure your `.env.local` file contains:

```env
MONGODB_URI=your_mongodb_connection_string
```

## Notes

- All sample data uses placeholder images (`/placeholder.svg`)
- Replace these with real images after seeding
- All dates are set to the current date/time when seeding
- The script will show a summary of seeded data when complete
