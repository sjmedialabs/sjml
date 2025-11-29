# Fix Server-Side Fetch Connection Refused Error

## Problem
When loading the Work, Services, and Case Studies pages, the following error occurred:

```
Failed to fetch works: TypeError: fetch failed
[cause]: AggregateError: {
  code: 'ECONNREFUSED'
}
```

This happened when the server tried to fetch data from its own API endpoints during server-side rendering.

## Root Cause
Next.js server components were trying to make HTTP fetch requests to `http://localhost:3000/api/...` during the build/render phase. This fails because:

1. The server cannot connect to itself via HTTP during SSR
2. The fetch is trying to make an external HTTP call when the data is already available in the same process
3. This creates unnecessary network overhead and potential connection issues

## Solution
Changed from HTTP fetch to **direct MongoDB queries** in server components. Since these are server components, we can directly access the database without going through HTTP APIs.

### Files Modified

#### 1. `/app/work/page.tsx`
**Before:**
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/works?all=true`, {
  cache: 'no-store'
})
if (res.ok) {
  projects = await res.json()
}
```

**After:**
```typescript
import { clientPromise } from "@/lib/mongodb"

const client = await clientPromise
const db = client.db("sjmedialabs")
const works = await db.collection("works").find({ isActive: true }).sort({ createdAt: -1 }).toArray()

// Serialize MongoDB _id
projects = works.map(work => ({
  ...work,
  _id: work._id.toString()
}))
```

#### 2. `/app/services/page.tsx`
**Before:**
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/services?all=true`, {
  cache: 'no-store'
})
if (res.ok) {
  services = await res.json()
}
```

**After:**
```typescript
import { clientPromise } from "@/lib/mongodb"

const client = await clientPromise
const db = client.db("sjmedialabs")
const servicesData = await db.collection("services").find({ isActive: true }).sort({ createdAt: -1 }).toArray()

// Serialize MongoDB _id
services = servicesData.map(service => ({
  ...service,
  _id: service._id.toString()
}))
```

#### 3. `/app/case-studies/page.tsx`
**Before:**
```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/case-studies?all=true&featured=true`, {
  cache: 'no-store'
})
if (res.ok) {
  caseStudies = await res.json()
}
```

**After:**
```typescript
import { clientPromise } from "@/lib/mongodb"

const client = await clientPromise
const db = client.db("sjmedialabs")
const studies = await db.collection("case_studies").find({ isActive: true, isFeatured: true }).sort({ createdAt: -1 }).toArray()

// Serialize MongoDB _id
caseStudies = studies.map(cs => ({
  ...cs,
  _id: cs._id.toString()
}))
```

## Benefits

1. **Faster Performance**: No HTTP overhead, direct database access
2. **No Connection Errors**: Eliminates ECONNREFUSED errors during SSR
3. **Simpler Code**: Direct queries are more straightforward than fetch + error handling
4. **Consistent Serialization**: MongoDB `_id` is properly serialized to string

## Additional Fix: Middleware Deprecation Warning

### Problem
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

### Solution
Renamed `middleware.ts` to `proxy.ts` as per Next.js convention.

```bash
mv middleware.ts proxy.ts
```

The file works the same way, just with the updated naming convention that Next.js prefers.

## When to Use Fetch vs Direct DB Access

### Use Direct DB Access (what we did):
- ✅ Server Components that need data from your own database
- ✅ When data is in the same application/process
- ✅ For better performance and reliability

### Use Fetch:
- ✅ Client Components (`"use client"`)
- ✅ External APIs (third-party services)
- ✅ When you need to call your API from the browser

## Verification

After these changes:
1. ✅ Work page loads without errors
2. ✅ Services page loads without errors
3. ✅ Case Studies page loads without errors
4. ✅ Data displays correctly from admin dashboard
5. ✅ No middleware deprecation warning
