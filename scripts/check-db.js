const { MongoClient } = require('mongodb');
const fs = require('fs');

// Read .env file manually
const envFile = fs.readFileSync('.env', 'utf8');
const MONGODB_URI = envFile.match(/MONGODB_URI="(.+)"/)[1];

async function checkDB() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('sjmedialabs');
    
    // Check works
    console.log('=== WORKS ===');
    const works = await db.collection('works').find({}).toArray();
    console.log(`Total works: ${works.length}`);
    if (works.length > 0) {
      console.log('First work:', JSON.stringify(works[0], null, 2));
    }
    
    // Check services
    console.log('\n=== SERVICES ===');
    const services = await db.collection('services').find({}).toArray();
    console.log(`Total services: ${services.length}`);
    if (services.length > 0) {
      console.log('First service:', JSON.stringify(services[0], null, 2));
    }
    
    // Check case studies
    console.log('\n=== CASE STUDIES ===');
    const caseStudies = await db.collection('case_studies').find({}).toArray();
    console.log(`Total case studies: ${caseStudies.length}`);
    if (caseStudies.length > 0) {
      console.log('First case study:', JSON.stringify(caseStudies[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDB();
