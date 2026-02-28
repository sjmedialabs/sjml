const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs';

async function checkContent() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('sjmedialabs');
    
    // Check content collection for all page keys
    const contentDocs = await db.collection('content').find({}).toArray();
    
    console.log('=== CONTENT COLLECTION ===');
    console.log(`Total documents: ${contentDocs.length}\n`);
    
    contentDocs.forEach(doc => {
      console.log(`Page: ${doc.pageKey}`);
      console.log(`Fields: ${Object.keys(doc).filter(k => k !== '_id' && k !== 'pageKey').join(', ')}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkContent();
