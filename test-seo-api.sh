#!/bin/bash

echo "========================================="
echo "  SEO & Settings API Testing Script"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test SEO API
echo "1. Testing SEO API (GET)"
echo "-------------------------------------------"
response=$(curl -s http://localhost:2002/api/content/seo)
if [[ $response == *"globalTitle"* ]]; then
    echo -e "${GREEN}✓ SEO API GET working${NC}"
    echo "Sample: $(echo $response | jq -r '.globalTitle' 2>/dev/null || echo $response | head -c 100)"
else
    echo -e "${RED}✗ SEO API GET failed${NC}"
fi
echo ""

# Test Settings API
echo "2. Testing Settings API (GET)"
echo "-------------------------------------------"
response=$(curl -s http://localhost:2002/api/content/settings)
if [[ $response == *"siteName"* ]]; then
    echo -e "${GREEN}✓ Settings API GET working${NC}"
    echo "Sample: $(echo $response | jq -r '.siteName' 2>/dev/null || echo $response | head -c 100)"
else
    echo -e "${RED}✗ Settings API GET failed${NC}"
fi
echo ""

# Check database
echo "3. Checking Database"
echo "-------------------------------------------"
node << 'NODESCRIPT'
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://sjmedia_db_user:Sjmedia123@sjmedialabs.y8c55ml.mongodb.net/?appName=sjmedialabs';

async function check() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('sjmedialabs');
    
    const seo = await db.collection('content').findOne({ pageKey: 'seo' });
    const settings = await db.collection('content').findOne({ pageKey: 'settings' });
    
    console.log(`✓ SEO document: ${seo ? 'EXISTS' : 'NOT FOUND'}`);
    console.log(`✓ Settings document: ${settings ? 'EXISTS' : 'NOT FOUND'}`);
    
    if (seo) {
      console.log(`  - SEO pages configured: ${seo.pages?.length || 0}`);
    }
  } catch (error) {
    console.error('✗ Database check failed:', error.message);
  } finally {
    await client.close();
  }
}

check();
NODESCRIPT
echo ""

echo "4. Application Status"
echo "-------------------------------------------"
pm2 status sjml-app --no-color | grep sjml-app
echo ""

echo "========================================="
echo "  Testing Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Login to admin: http://your-domain/admin/login"
echo "2. Go to SEO Settings section"
echo "3. Update any SEO field and save"
echo "4. Clear cache: rm -rf .next/cache && pm2 restart sjml-app"
echo "5. Check page source to verify meta tags updated"
echo ""
