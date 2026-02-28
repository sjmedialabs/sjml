const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs';

async function checkDB() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB\n');
    
    const db = client.db('sjmedialabs');
    const collections = await db.listCollections().toArray();
    
    console.log('=== ALL COLLECTIONS ===');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check each collection
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`\n=== ${col.name.toUpperCase()} (${count} documents) ===`);
      
      if (count > 0) {
        const sample = await db.collection(col.name).findOne();
        console.log('Sample keys:', Object.keys(sample).join(', '));
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkDB();
