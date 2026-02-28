const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs';

async function checkSEO() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('sjmedialabs');
    
    // Check SEO in content collection
    const seoContent = await db.collection('content').findOne({ pageKey: 'seo' });
    console.log('=== SEO Content (pageKey: seo) ===');
    console.log(seoContent ? JSON.stringify(seoContent, null, 2) : 'NOT FOUND');
    
    // Check settings in home content
    const homeContent = await db.collection('content').findOne({ pageKey: 'home' });
    console.log('\n=== Settings in Home Content ===');
    console.log(homeContent?.settings ? JSON.stringify(homeContent.settings, null, 2) : 'NOT FOUND');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkSEO();
