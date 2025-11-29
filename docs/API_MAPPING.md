# Website Pages API Mapping

This document shows which API endpoints each public website page uses to fetch content from the admin dashboard.

## Page-to-API Mapping

### ✅ 1. About Page (`/about`)
- **Page File**: `app/about/page.tsx`
- **API Endpoint**: `/api/content/about`
- **Method**: GET
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Hero section (title, subtitle)
  - Mission and vision
  - Company values
  - Team members
  - Stats and achievements

---

### ✅ 2. Work Page (`/work`)
- **Page File**: `app/work/page.tsx`
- **API Endpoint**: `/api/works?all=true`
- **Method**: GET
- **Type**: MongoDB Collection API (`works` collection)
- **Data Fetched**: 
  - All active work/portfolio items
  - Project details (title, description, image, slug)
  - Can be managed via admin dashboard CRUD operations

---

### ✅ 3. Services Page (`/services`)
- **Page File**: `app/services/page.tsx`
- **API Endpoint**: `/api/services?all=true`
- **Method**: GET
- **Type**: MongoDB Collection API (`services` collection)
- **Data Fetched**: 
  - All active services
  - Service details (title, description, icon, slug)
  - Can be managed via admin dashboard CRUD operations

---

### ✅ 4. Case Studies Page (`/case-studies`)
- **Page File**: `app/case-studies/page.tsx`
- **API Endpoint**: `/api/case-studies?all=true&featured=true`
- **Method**: GET
- **Type**: MongoDB Collection API (`case_studies` collection)
- **Data Fetched**: 
  - Featured case studies
  - Case study details (title, description, tags, stats, client info)
  - Can be managed via admin dashboard CRUD operations

---

### ✅ 5. Insights Page (`/insights`)
- **Page File**: `app/insights/page.tsx`
- **API Endpoint**: `/api/content/insights`
- **Method**: GET
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Blog posts
  - Categories
  - Newsletter section content

---

### ✅ 6. Clients Page (`/clients`)
- **Page File**: `app/clients/page.tsx`
- **API Endpoint**: `/api/content/clients`
- **Method**: GET
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Client logos and information
  - Industry filters
  - Client stats
  - CTA section

---

### ✅ 7. Testimonials Page (`/testimonials`)
- **Page File**: `app/testimonials/page.tsx`
- **API Endpoint**: `/api/content/testimonials`
- **Method**: GET
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Customer testimonials
  - Ratings, quotes, author info
  - CTA section

---

### ✅ 8. Careers Page (`/careers`)
- **Page File**: `app/careers/page.tsx`
- **API Endpoint**: `/api/content/careers`
- **Method**: GET
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Hero section
  - Company culture information
  - Benefits and perks
  - Job postings (only published jobs are shown)

---

### ✅ 9. Contact Page (`/contact`)
- **Page File**: `app/contact/page.tsx`
- **API Endpoint**: `/api/content/contact`
- **Method**: GET (for content), POST (for form submission)
- **Type**: Content API (MongoDB `content` collection)
- **Data Fetched**: 
  - Hero section
  - Contact form configuration
  - Office locations
  - Contact information (phone, email)
- **Form Submission**: `/api/leads` (POST)

---

## API Types Overview

### Content API (`/api/content/[page]`)
Used for pages with structured content that changes infrequently:
- About
- Insights
- Clients
- Testimonials
- Careers
- Contact

**Storage**: MongoDB `content` collection
**Access**: Public (GET), Admin dashboard (POST/PUT)

---

### Collection APIs (Individual endpoints)
Used for pages with frequently changing, CRUD-managed content:
- Works: `/api/works`
- Services: `/api/services`
- Case Studies: `/api/case-studies`

**Storage**: MongoDB collections (`works`, `services`, `case_studies`)
**Access**: Public (GET with `?all=true`), Admin dashboard (POST/PUT/DELETE with auth)

---

## Admin Dashboard Management

All content can be managed from the admin dashboard:

1. **Content Pages** (About, Insights, Clients, Testimonials, Careers, Contact)
   - Managed via Content Management section in admin
   - Single entry per page type
   - Edit existing content

2. **Works**
   - Full CRUD operations
   - List view with pagination
   - Create, edit, delete work items

3. **Services**
   - Full CRUD operations
   - List view with pagination
   - Create, edit, delete services

4. **Case Studies**
   - Full CRUD operations
   - List view with pagination
   - Create, edit, delete case studies
   - Featured flag support

---

## Image Storage

All images are stored in **MongoDB GridFS**:
- Upload endpoint: `POST /api/upload`
- Serve endpoint: `GET /api/images/[id]`
- Delete endpoint: `DELETE /api/images/[id]`
- Test upload: `/public/test-upload.html`

---

## Summary

✅ All 9 pages now use APIs to fetch content from the admin dashboard
✅ No hardcoded content on any page
✅ All content can be managed via admin dashboard
✅ Images stored in MongoDB GridFS
✅ Real-time updates with `cache: 'no-store'` and `revalidate: 0`
