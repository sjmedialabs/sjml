# Cache Revalidation Guide

## Problem
Content updates made in the admin panel may not appear immediately on the website due to Next.js ISR (Incremental Static Regeneration) caching.

## Solution
We've implemented on-demand revalidation that allows immediate cache clearing after admin updates.

## Quick Fix (Manual)

When you update content in admin and don't see changes:

```bash
# Clear Next.js cache
rm -rf /var/www/sjml/.next/cache

# Restart the application
pm2 restart ecosystem.config.js

# Hard refresh browser (Ctrl+Shift+R)
```

## Automatic Solution (Recommended)

### 1. Using the Revalidation API

After updating content in any admin manager, call the revalidation utility:

```typescript
import { revalidateContentPage } from '@/lib/revalidate-cache'

// After saving content
await revalidateContentPage('home') // Revalidates homepage
await revalidateContentPage('about') // Revalidates about page
await revalidateContentPage('services') // Revalidates services page
```

### 2. Example: Update Home Page Manager

Add revalidation after save:

```typescript
const handleSave = async () => {
  try {
    // Save content
    const response = await fetch('/api/content/home', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(content)
    })

    if (response.ok) {
      // ✅ NEW: Revalidate cache immediately
      await revalidateContentPage('home', token)
      
      toast.success('Content saved and cache cleared!')
    }
  } catch (error) {
    console.error('Save error:', error)
  }
}
```

### 3. Revalidation API Endpoints

**POST** `/api/revalidate`

Headers:
```json
{
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
```

Body options:

```json
// Single path
{
  "path": "/"
}

// Multiple paths
{
  "paths": ["/", "/about", "/services"]
}

// By tag (if using fetch tags)
{
  "tag": "content"
}
```

### 4. Available Page Keys

```typescript
'home'           → /
'about'          → /about
'services'       → /services
'case-studies'   → /case-studies
'insights'       → /insights
'contact'        → /contact
'careers'        → /careers
'work'           → /work
'clients'        → /clients
'testimonials'   → /testimonials
```

## Testing Revalidation

### From Command Line

```bash
# Test revalidation API (replace YOUR_TOKEN)
curl -X POST http://localhost:2002/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

### From Browser Console

```javascript
// Get token from localStorage
const token = localStorage.getItem('token')

// Revalidate homepage
fetch('/api/revalidate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ path: '/' })
})
.then(r => r.json())
.then(console.log)
```

## Integration Checklist

Update these admin manager files to add automatic revalidation:

- [ ] `home-page-manager.tsx` - Add `revalidateContentPage('home')`
- [ ] `about-page-manager.tsx` - Add `revalidateContentPage('about')`
- [ ] `services-manager.tsx` - Add `revalidateContentPage('services')`
- [ ] `case-studies-manager.tsx` - Add `revalidateContentPage('case-studies')`
- [ ] `insights-manager.tsx` - Add `revalidateContentPage('insights')`
- [ ] `contact-page-manager.tsx` - Add `revalidateContentPage('contact')`
- [ ] `careers-page-manager.tsx` - Add `revalidateContentPage('careers')`
- [ ] `hero-manager.tsx` - Add `revalidateContentPage('home')`
- [ ] `footer-manager.tsx` - Add revalidation for all pages
- [ ] `header-manager.tsx` - Add revalidation for all pages

## Alternative: Reduce Cache Time

If you prefer shorter cache duration instead of manual revalidation:

Edit each page file (e.g., `app/page.tsx`):

```typescript
// Before
export const revalidate = 3600 // 1 hour

// After
export const revalidate = 60 // 1 minute
```

## Monitoring

Check PM2 logs to see revalidation activity:

```bash
pm2 logs sjml-app --lines 100
```

Look for:
- "Cache revalidated: /path"
- "Revalidation error"

## Troubleshooting

### Changes still not visible?

1. **Clear browser cache**: Ctrl+Shift+R (hard refresh)
2. **Check PM2 status**: `pm2 status`
3. **Check logs**: `pm2 logs sjml-app`
4. **Verify API works**: Test revalidation endpoint directly
5. **Check database**: Run `node verify-db-integration.js`
6. **Manual cache clear**: `rm -rf .next/cache && pm2 restart ecosystem.config.js`

### Revalidation API returns 401?

- Check token is valid
- Token should be included in Authorization header
- Token is generated on admin login

### Revalidation not triggered in admin?

- Check admin manager has revalidation code
- Check browser console for errors
- Verify token is in localStorage

## Best Practices

1. ✅ Always revalidate after content save
2. ✅ Show user feedback ("Content saved and cache cleared")
3. ✅ Handle revalidation errors gracefully
4. ✅ Log revalidation activity for debugging
5. ⚠️ Don't revalidate on every keystroke (only on save)
6. ⚠️ Consider rate limiting for revalidation API

## Performance Notes

- Revalidation is instant (no waiting for timer)
- Only affected paths are revalidated
- No impact on other pages
- Database queries still respect ISR timer

## Summary

**Before**: Content updates took up to 1 hour to appear (ISR revalidate time)

**After**: Content updates appear immediately when revalidation is triggered

**Action Required**: Integrate revalidation calls in admin managers (see checklist above)
