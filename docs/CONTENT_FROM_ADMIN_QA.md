# Content From Admin Only – QA & Developer Guide

## Summary

All website content is **driven by the database**. There is **no static or mock copy** on the public site. Content is updated only via the **admin dashboard** and stored in MongoDB.

---

## QA Checklist (Senior QA Test Lead)

Use this to verify that the site shows only database content.

### 1. Before Testing: Seed the Database

- **Endpoint:** `POST /api/seed`
- Run once (e.g. with curl or Postman) so the `content` collection has default documents.
- Without seeding, the site will show “Content not available” or empty sections where no document exists.

### 2. Content Status API

- **GET** `/api/content/status`
- Returns which `pageKey` documents exist in the DB.
- Use this to confirm that expected pages (home, about, header, footer via home, etc.) are present after seed or admin edits.

### 3. Pages to Verify (No Static Fallbacks)

| Page | Content source | What to check |
|------|----------------|---------------|
| **Home** | `content` (pageKey: home) + collections: services, case-studies, insights, testimonials | Hero, stats, sections, footer come from DB. No hardcoded headlines. |
| **About** | `getPageContent("about")` | Hero title/description/image, about section, achievements, vision, mission, team only from DB. Empty if not set in admin. |
| **Work** | `getPageContent("work")` + `works` collection | Hero and list from DB. Detail page `/work/[slug]` from `works`; no “Brand Overview” fallback text. |
| **Services** | `getPageContent("services")` + `services` collection | Hero and list from DB. Detail from `services` collection. |
| **Case Studies** | `getPageContent("case-studies")` + `case-studies` collection | Hero and list from DB. Detail from `case-studies` collection. |
| **Insights** | `getPageContent("insights")` + `insights` collection | Hero and posts from DB. |
| **Clients** | `getPageContent("clients")` + `clients` collection | Hero and list from DB. |
| **Testimonials** | `getPageContent("testimonials")` + `testimonials` collection | Hero and list from DB. |
| **Careers** | `getPageContent("careers")` | Hero, culture, jobs, benefits from DB. |
| **Contact** | `getPageContent("contact")` | Hero, form label, offices, contact from DB. |

### 4. Global UI (No Static Copy)

- **Header:** Nav and CTA come from `content` (pageKey: `header`). No fallback “SJ MEDIA LABS” or “Start a project” when DB says otherwise.
- **Footer:** From `content.footer` (home document) or **GET** `/api/content/footer`. Company/services links and contact come from DB. If no footer content, message: “Configure footer content in admin dashboard.”

### 5. APIs That Return Only DB (No Mock Defaults)

- **GET** `/api/content/settings` → 404 if no `settings` document.
- **GET** `/api/content/seo` → 404 if no `seo` document.
- **GET** `/api/content/[page]` → 404 if page key not in DB.
- **GET** `/api/content/footer` → 404 if home content has no `footer`.

### 6. Negative Tests

- Clear a content document (or use a fresh DB without seed): the corresponding page or section should show “Content not available” or empty/placeholder, **not** static marketing copy.
- Change a title in admin and revalidate: the site should show the new title only (no old fallback).

---

## Developer Reference (APIs & DB)

### Content Collection (`content`)

- One document per `pageKey`. Website reads via `getPageContent(pageKey)` or **GET** `/api/content/[page]`.
- **Seeded keys:** home, about, work, services, case-studies, careers, contact, insights, testimonials, clients, **header**, **settings**, **seo**.

### Essential APIs

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/content/[page]` | Return content document for `page` (e.g. about, work, contact). |
| PUT | `/api/content/[page]` | Update content (auth: Bearer admin token). |
| GET | `/api/content/home` | Home page content. |
| GET | `/api/content/footer` | Footer (from home content). Used when Footer has no `data` prop. |
| GET | `/api/content/header` | Header nav and CTA. |
| GET | `/api/content/settings` | Site settings (404 if not in DB). |
| GET | `/api/content/seo` | SEO meta (404 if not in DB). |
| GET | `/api/content/status` | List of existing `pageKey`s (for QA). |
| POST | `/api/seed` | Seed default content (and admin user) if missing. |

### Dynamic Collections (Lists/Items)

- **services** – Services list and detail pages.
- **works** – Work/portfolio list and detail pages.
- **case-studies** – Case studies list and detail pages.
- **insights** – Blog/list and detail.
- **testimonials** – Testimonials.
- **clients** – Clients list.

All of these are read from MongoDB; the site does not render static lists.

### Footer Shape (from DB)

`content.footer` (home document) or `/api/content/footer` can include:

- `address`, `phone`, `email`, `copyright`, `newsletterText`
- `siteName`, `siteTagline`
- `companyLinks`: `[{ name, href }]`
- `serviceLinks`: `[{ name, href }]`
- `socialLinks`: `{ facebook, instagram, linkedin, twitter, youtube }`

Footer component uses only this data (and shows “Configure footer content in admin” when none).

---

## Running the Seed

From project root:

```bash
curl -X POST http://localhost:3000/api/seed
```

Or use any HTTP client. After seeding, **GET** `/api/content/status` to confirm all expected keys exist. Then verify the site: all visible content should be editable (and reflected) from the admin only.
