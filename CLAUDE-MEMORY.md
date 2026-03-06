# Eytan.com Blog System - Claude Memory Guide

**Last Updated:** March 6, 2026 (Session 16 Complete)

---

## Quick Start for New Sessions

```
This is Eytan Benzeno's personal blog system.
- Frontend: https://eytan.com (GitHub Pages)
- Backend API: https://api.eytan.com (Railway)
- Database: PostgreSQL (Neon)

Clone repos to get started:
  git clone https://github.com/benzenoe/eytan.com.git
  git clone https://github.com/benzenoe/eytan-com-blog-backend.git
```

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Repository Information](#repository-information)
3. [Tech Stack](#tech-stack)
4. [Key Features](#key-features)
5. [File Structure](#file-structure)
6. [Common Tasks](#common-tasks)
7. [Diagnostic Scripts](#diagnostic-scripts)
8. [Troubleshooting](#troubleshooting)
9. [Session History](#session-history)
10. [Environment Variables](#environment-variables)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│    eytan.com        │         │   api.eytan.com     │
│   (GitHub Pages)    │◄───────►│     (Railway)       │
│                     │   API   │                     │
│ • Static HTML/CSS/JS│  Calls  │ • Express.js API    │
│ • Blog pages        │         │ • Authentication    │
│ • Admin panel       │         │ • Post management   │
│ • SEO static pages  │         │ • GitHub publishing │
│ • Images            │         │ • Social media      │
└─────────────────────┘         └──────────┬──────────┘
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │   Neon PostgreSQL   │
                                │                     │
                                │ • Posts table       │
                                │ • Sessions table    │
                                │ • Social posts      │
                                └─────────────────────┘
```

### Data Flow

1. **Viewing Blog:** Browser → GitHub Pages (static HTML) + API (post data)
2. **Admin Panel:** Browser → API (authenticated) → Database
3. **Publishing:** API → Database + GitHub (creates markdown & SEO pages)
4. **Images:** Upload → API → GitHub repo → Served via GitHub Pages CDN

---

## Repository Information

### Frontend Repository
- **GitHub:** https://github.com/benzenoe/eytan.com.git
- **Live URL:** https://eytan.com
- **Hosting:** GitHub Pages (auto-deploys from main branch)
- **Deploy Time:** 1-2 minutes after push

### Backend Repository
- **GitHub:** https://github.com/benzenoe/eytan-com-blog-backend.git
- **Live URL:** https://api.eytan.com
- **Hosting:** Railway (auto-deploys from main branch)
- **Database:** Neon PostgreSQL

### Clone Commands
```bash
# Clone both repositories
git clone https://github.com/benzenoe/eytan.com.git
git clone https://github.com/benzenoe/eytan-com-blog-backend.git

# Install backend dependencies
cd eytan-com-blog-backend
npm install
```

---

## Tech Stack

### Backend
| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL (Neon) |
| GitHub API | Octokit |
| Sessions | express-session + connect-pg-simple |
| AI | OpenAI GPT-3.5/4 |
| Hosting | Railway |

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | Static HTML/CSS/JavaScript |
| Markdown | Marked.js |
| i18n | Custom i18n.js |
| Hosting | GitHub Pages |

---

## Key Features

### 1. Blog System
- Create, edit, delete posts via admin panel
- Draft/Published workflow
- Markdown content with live preview
- Auto-generated SEO static pages

### 2. Image Upload (Session 2)
- Upload images up to 2MB
- Stored in GitHub repo at `images/blog/`
- Served via GitHub Pages CDN
- No base64 in database (prevents corruption)

### 3. SEO Optimization (Session 4)
- Static HTML pages: `blog/{slug}.html`
- Meta tags, OpenGraph, Twitter Cards
- JSON-LD structured data
- Sitemap.xml and robots.txt
- Auto-updates on publish/republish

### 4. Password Protection (Session 8)
- Login page with rate limiting (10 attempts/15 min)
- localStorage-based auth (7-day session)
- Cross-domain compatible (eytan.com ↔ api.eytan.com)

### 5. Tag System (Session 10)
- Tags stored as PostgreSQL array
- Filter buttons on blog page
- URL-based filtering: `blog.html?tag=AI`
- Tags displayed on cards and "More Posts"

### 6. Trilingual Support (Sessions 11 & 15)
- Language switcher: 🇺🇸 🇫🇷 🇵🇹
- Full French & Portuguese translations (200+ strings each)
- API: `?lang=fr` or `?lang=pt` parameter
- SEO pages: `blog/fr/{slug}.html` and `blog/pt/{slug}.html`
- localStorage persistence
- Trilingual resume PDFs with language-specific downloads

### 7. Social Media Publishing (Session 12)
- AI-generated platform-specific content
- Supports: Twitter/X, Facebook, Instagram, LinkedIn
- Status tracking in database
- Retry logic with exponential backoff

---

## File Structure

### Backend (eytan-com-blog-backend)
```
├── server.js                 # Main Express server
├── routes/
│   ├── posts.js              # Blog post CRUD + publish
│   ├── auth.js               # Login/logout/status
│   ├── upload.js             # Image upload to GitHub
│   ├── social.js             # Social media publishing
│   ├── translate.js          # Translation endpoints (with chunking)
│   └── research.js           # Research report endpoints (Session 16)
├── services/
│   ├── database.js           # PostgreSQL connection & queries
│   ├── github.js             # GitHub API (publish posts)
│   ├── seo.js                # SEO page generation (H1 title fix)
│   └── social-media.js       # Social platform APIs
├── middleware/
│   └── auth.js               # Authentication middleware
├── migrations/
│   ├── add-french-content-fields.js
│   ├── add-portuguese-content-fields.js
│   └── add-social-posts-table.js
├── scripts/
│   ├── translate-posts-to-french.js
│   └── translate-posts-to-portuguese.js
├── *.js                      # Diagnostic & utility scripts
└── CLAUDE-MEMORY.md          # This file
```

### Frontend (eytan.com)
```
├── index.html                # Homepage
├── blog.html                 # Blog listing with tag filters
├── blog-post.html            # Dynamic post viewer
├── admin.html                # Admin panel
├── admin-editor.html         # Post editor
├── login.html                # Login page
├── resume.html               # Resume page with download modal
├── contact.html              # Contact page
├── ai-charts.html            # Standalone interactive charts page
├── js/
│   ├── blog.js               # Blog listing logic + filtering
│   ├── blog-post.js          # Post display logic
│   ├── blog-charts.js        # Chart.js initialization (Session 16)
│   ├── admin.js              # Admin panel logic
│   ├── admin-editor.js       # Editor logic
│   ├── i18n.js               # Internationalization
│   └── main.js               # Common utilities
├── css/
│   └── styles.css            # All styles + resume modal
├── blog/
│   ├── {slug}.html           # English SEO pages
│   ├── fr/{slug}.html        # French SEO pages
│   └── pt/{slug}.html        # Portuguese SEO pages
├── posts/
│   └── {slug}.md             # Markdown content
├── images/
│   ├── blog/                 # Uploaded images
│   └── ai-acceleration-causal-diagram.svg  # Research diagrams
├── data/
│   └── blog-posts.json       # Post metadata
├── Eytan-Benzeno-Resume.pdf      # Modern resume (EN)
├── Eytan-Benzeno-Resume-FR.pdf   # Modern resume (FR)
├── Eytan-Benzeno-Resume-PT.pdf   # Modern resume (PT)
├── Eytan-Benzeno-Resume-Classic.pdf     # Classic resume (EN)
├── Eytan-Benzeno-Resume-Classic-FR.pdf  # Classic resume (FR)
├── Eytan-Benzeno-Resume-Classic-PT.pdf  # Classic resume (PT)
├── sitemap.xml
├── robots.txt
└── CLAUDE-MEMORY.md          # Quick reference
```

---

## Common Tasks

### View/Edit Posts
1. Go to https://eytan.com/admin.html
2. Login with password
3. Click Edit on any post
4. Make changes → Save Draft → Publish

### Create New Post
1. Admin panel → "New Post" button
2. Fill in: title, date, author, icon, image, excerpt, content, tags
3. Save Draft → Preview → Publish

### Fix Broken Posts
```bash
cd eytan-com-blog-backend

# Check database status
node check-database.js

# Fix corrupted images
node fix-images.js

# Republish all posts to GitHub
node republish-posts.js

# Verify markdown files
node check-markdown-files.js
```

### Deploy Changes

**Frontend:**
```bash
cd eytan.com
git add .
git commit -m "Description of changes"
git push origin main
# Wait 1-2 minutes for GitHub Pages
```

**Backend:**
```bash
cd eytan-com-blog-backend
git add .
git commit -m "Description of changes"
git push origin main
# Railway auto-deploys
```

### Regenerate All SEO Pages
```bash
cd eytan-com-blog-backend
node regenerate-all.js
```

### Translate Posts to French
```bash
cd eytan-com-blog-backend
# Ensure OPENAI_API_KEY is in .env
node scripts/translate-posts-to-french.js
```

### Update Tags
```bash
cd eytan-com-blog-backend
# Edit manual-tag-posts.js with new tags
node manual-tag-posts.js
node regenerate-all.js
```

---

## Diagnostic Scripts

All scripts are in the backend repository root:

| Script | Purpose |
|--------|---------|
| `check-database.js` | Show all posts, identify large images |
| `check-markdown-files.js` | Verify markdown files exist in GitHub |
| `check-github-posts.js` | List posts in GitHub repo |
| `fix-images.js` | Remove corrupted base64 images |
| `republish-posts.js` | Republish all posts to GitHub |
| `regenerate-all.js` | Regenerate all SEO pages |
| `diagnose.js` | Check GitHub for corrupted files |
| `manual-tag-posts.js` | Assign tags to posts |
| `auto-tag-posts.js` | Auto-tag posts (experimental) |

### Quick Diagnostics
```bash
# Check API health
curl https://api.eytan.com/health

# Check published posts
curl "https://api.eytan.com/api/posts?status=published"

# Check French posts
curl "https://api.eytan.com/api/posts?status=published&lang=fr"
```

---

## Troubleshooting

### "Blog posts not showing"
1. Check API: `curl https://api.eytan.com/api/posts?status=published`
2. Run: `node check-database.js`
3. Run: `node check-markdown-files.js`
4. If missing: `node republish-posts.js`
5. Wait 2 min + hard refresh (Ctrl+Shift+R)

### "Post Not Found" on specific post
1. Check if markdown exists: `node check-markdown-files.js`
2. Check slug matches in database
3. Republish: `node republish-posts.js`

### "Image upload fails"
1. Check file size (max 2MB)
2. Verify GITHUB_TOKEN has repo permissions
3. Check backend logs on Railway

### "Login not working"
1. Clear localStorage in browser
2. Check PASSWORD_HASH in Railway environment
3. Verify API is running: `curl https://api.eytan.com/health`

### "French content not showing"
1. Check database has French columns: `node check-columns.js`
2. Check translations exist in database
3. Run translation: `node scripts/translate-posts-to-french.js`

### "SEO pages not updating"
1. Run: `node regenerate-all.js`
2. Push frontend: `cd eytan.com && git push`
3. Wait 2 min for GitHub Pages

### "Admin panel posts not loading"
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify API_URL is correct
4. Check authentication status

---

## Session History

### Session 1 (Dec 7, 2025 - Morning)
**Problem:** Blog posts not showing, database corruption
**Solution:**
- Found 2 posts with 2-2.5MB base64 images corrupting database
- Created diagnostic scripts
- Fixed image corruption
- Republished posts to GitHub

**Files created:** `diagnose.js`, `check-database.js`, `fix-images.js`, `republish-posts.js`, `check-markdown-files.js`, `check-all-files.js`, `check-github-posts.js`

---

### Session 2 (Dec 7, 2025 - Afternoon)
**Problem:** Root cause of corruption - images stored as base64 in database
**Solution:**
- Created image upload API (`POST /api/upload/image`)
- Images stored in GitHub at `images/blog/{timestamp}-{filename}`
- Database stores URL only (57 bytes vs 2MB)
- 2MB limit enforced by API
- Enabled editing/republishing of published posts

**Files created:** `routes/upload.js`
**Files modified:** `server.js`, `routes/posts.js`, frontend `js/admin.js`

---

### Session 3 (Dec 8, 2025)
**Problem:** Post "test4" showing "Post Not Found"
**Solution:**
- Found inconsistent directories (posts/ vs blog/)
- Standardized to `posts/` directory only
- Updated frontend to load from correct path
- Removed deprecated `blog/` directory

**Files modified:** `services/github.js`, frontend `js/blog-post.js`

---

### Session 4 (Dec 8, 2025)
**Problem:** Blog not SEO-friendly, search engines couldn't index
**Solution:**
- Created static HTML pages with full SEO meta tags
- OpenGraph tags for social sharing
- Twitter Card tags
- JSON-LD structured data
- Automated SEO generation on publish/delete
- Created sitemap.xml and robots.txt
- Fixed admin panel UX issues

**Files created:** `services/seo.js`, `generate-static-pages.js`, `generate-sitemap.js`, `deploy-seo.js`, frontend `blog-post-template.html`, `sitemap.xml`, `robots.txt`

---

### Session 5 (Dec 10, 2025)
**Problem:** SEO HTML pages not updating when posts republished
**Solution:**
- Found file path mismatch (slug vs ID)
- Fixed SEO generation to use consistent paths
- Improved error logging

**Files modified:** `services/seo.js`

---

### Session 6 (Dec 10, 2025)
**Problem:** Share buttons stacking vertically on mobile
**Solution:**
- Fixed CSS for horizontal layout
- Added WhatsApp share button (mobile/desktop detection)
- Added Copy Link button with clipboard API
- Removed redundant backup buttons from admin
- Added "View Post" button for published posts

**Files modified:** frontend `css/styles.css`, `blog-post-template.html`, `admin.html`, `js/admin.js`

---

### Session 7 (Dec 10, 2025)
**Problem:** Need SEO-friendly slug-based URLs
**Solution:**
- Changed URLs from ID-based to slug-based
- Updated blog listing, SEO service, sitemap
- Fixed apostrophe in titles breaking JavaScript
- Optimized profile image (4.5MB → 126KB)

**Files created:** `regenerate-all.js`
**Files modified:** `services/seo.js`, frontend `js/blog.js`, `js/admin.js`, `blog-post-template.html`

---

### Session 8 (Dec 11, 2025)
**Problem:** Admin panel had no password protection
**Solution:**
- Created login page with rate limiting
- localStorage-based authentication (7-day session)
- Works across subdomains (eytan.com ↔ api.eytan.com)
- Added logout functionality
- Re-enabled auth middleware on write operations

**Files created:** frontend `login.html`
**Files modified:** `routes/posts.js`, `routes/upload.js`, `server.js`, frontend `admin.html`, `admin-editor.html`, `js/admin.js`

**Known issue:** Posts not loading in admin panel (debugging in progress)

---

### Session 9 (Dec 12, 2025)
**Problem:** User requested blog categorization system
**Status:** PLAN ONLY - Not implemented

**Two approaches proposed:**
1. **Comprehensive (10-13 hrs):** Multiple categories per post, full CRUD management
2. **Simple (2-3 hrs):** Hardcoded categories, dropdown selector

**Recommendation:** Simple approach for current blog size (17 posts)

---

### Session 10 (Dec 14, 2025)
**Problem:** Need tags for filtering posts
**Solution:**
- Added `tags TEXT[]` column to posts table
- Created tag filter buttons on blog page
- URL-based filtering: `blog.html?tag=AI`
- Tags displayed on blog cards and More Posts
- Manual tag assignment script
- Fixed loading indicator (replaced static posts)

**Tags:** AI, Technology, Business, Energy, Real Estate, Science, Personal Development, Tech Industry

**Files created:** `manual-tag-posts.js`, `auto-tag-posts.js`
**Files modified:** `routes/posts.js`, `services/database.js`, `services/seo.js`, frontend `blog.html`, `js/blog.js`, `css/styles.css`

---

### Session 11 (Jan 18, 2026)
**Problem:** Need French translations for entire website
**Solution:**
- Created i18n system with 200+ translations
- Language switcher (🇺🇸 🇫🇷) on all pages
- API supports `?lang=fr` parameter
- Database migration for French columns
- AI translation script using OpenAI GPT-4
- French SEO pages at `blog/fr/{slug}.html`

**Files created:**
- `migrations/add-french-content-fields.js`
- `scripts/translate-posts-to-french.js`
- frontend `js/i18n.js`

**Files modified:** `routes/posts.js`, `services/seo.js`, all frontend HTML pages

**Status:** ✅ Fully operational - 17 French posts live

---

### Session 12 (Dec 16, 2025)
**Problem:** Need social media auto-publishing
**Solution:**
- Created social media service with AI content transformation
- Platform-specific content:
  - Twitter/X: 280 chars + hashtags ($100/month required)
  - Facebook: 150-250 words storytelling
  - Instagram: 125-150 words + requires image
  - LinkedIn: 200-300 words professional
- Share modal in admin panel
- Database tracking with `social_posts` table
- Retry logic with exponential backoff

**Files created:**
- `migrations/add-social-posts-table.js`
- `services/social-media.js`
- `routes/social.js`

**Files modified:** `services/database.js`, `server.js`, frontend `admin.html`, `js/admin.js`

---

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_OWNER=benzenoe
GITHUB_REPO=eytan.com

# Authentication
SESSION_SECRET=random-string-here
PASSWORD_HASH=sha256-hash-of-password

# Frontend URL (for CORS)
FRONTEND_URL=https://eytan.com

# OpenAI (for translations & social media)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx

# Social Media (optional)
TWITTER_API_KEY=xxxxx
TWITTER_API_SECRET=xxxxx
TWITTER_ACCESS_TOKEN=xxxxx
TWITTER_ACCESS_SECRET=xxxxx
FACEBOOK_PAGE_ID=xxxxx
FACEBOOK_PAGE_ACCESS_TOKEN=xxxxx
INSTAGRAM_ACCOUNT_ID=xxxxx
LINKEDIN_ACCESS_TOKEN=xxxxx
LINKEDIN_PERSON_URN=urn:li:person:xxxxx

# Server
PORT=3000
NODE_ENV=production
```

### Generate Password Hash
```bash
cd eytan-com-blog-backend
node set-password.js YourPasswordHere
# Copy the hash to PASSWORD_HASH in Railway
```

---

## Database Schema

### posts table
```sql
id VARCHAR(255) PRIMARY KEY,
title VARCHAR(500) NOT NULL,
title_fr VARCHAR(500),           -- French title
date DATE NOT NULL,
author VARCHAR(255) NOT NULL,
icon VARCHAR(10),
image TEXT,
excerpt TEXT NOT NULL,
excerpt_fr TEXT,                  -- French excerpt
content TEXT NOT NULL,
content_fr TEXT,                  -- French content
status VARCHAR(20) DEFAULT 'draft',
slug VARCHAR(500),
tags TEXT[],                      -- Array of tags
hashtags TEXT,
seo_title VARCHAR(150),
seo_title_fr VARCHAR(150),
meta_description VARCHAR(300),
meta_description_fr VARCHAR(300),
meta_keywords TEXT,
meta_keywords_fr TEXT,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW(),
published_at TIMESTAMP
```

### social_posts table
```sql
id SERIAL PRIMARY KEY,
post_id VARCHAR(255) REFERENCES posts(id),
platform VARCHAR(20) NOT NULL,
platform_post_id VARCHAR(255),
platform_url TEXT,
content TEXT NOT NULL,
status VARCHAR(20) DEFAULT 'pending',
error_message TEXT,
published_at TIMESTAMP,
created_at TIMESTAMP DEFAULT NOW()
```

### sessions table
```sql
sid VARCHAR(255) PRIMARY KEY,
sess JSON NOT NULL,
expire TIMESTAMP NOT NULL
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | API health check |
| GET | /api/posts | List posts (?status=published&lang=fr) |
| GET | /api/posts/:id | Get single post |

### Protected (requires auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/posts | Create post |
| PUT | /api/posts/:id | Update post |
| DELETE | /api/posts/:id | Delete post |
| POST | /api/posts/:id/publish | Publish to GitHub |
| POST | /api/upload/image | Upload image |
| POST | /api/social/publish/:id | Publish to social media |
| GET | /api/social/status/:id | Get social status |

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/status | Check auth status |

---

### Session 13 (Jan 30, 2026)
**Problem:** Admin login redirect loop + French translation buttons not working

**Root Cause 1 - Login Loop:**
- Previous session changed auth flow to verify server session first
- But cross-domain cookies DON'T work between eytan.com and api.eytan.com
- Server always returned `authenticated: false`, causing redirect loop

**Solution 1:**
- Reverted commit `ebe3c88` which broke auth
- Admin auth MUST use localStorage-only (not server session cookies)
- Frontend sets `localStorage.adminAuth` on successful login
- Admin pages check localStorage, not server session

**Root Cause 2 - Translation "Unauthorized" Error:**
- `/api/translate/bulk` endpoint used `requireAuth` middleware
- But `requireAuth` was never imported in translate.js (ReferenceError)
- Even if imported, cross-domain cookies don't work

**Solution 2:**
- Removed `requireAuth` from translate routes
- Protection provided by: CORS (only eytan.com can call) + admin localStorage check

**Root Cause 3 - OpenAI Rate Limit (429 Error):**
- GPT-4 has 10,000 tokens/min limit
- Large blog posts exceeded this

**Solution 3:**
- Switched from `gpt-4` to `gpt-3.5-turbo` (90,000 tokens/min limit)
- Also cheaper and sufficient for translations

**Root Cause 4 - French Fields Not Saving:**
- `createPost()` and `updatePost()` in database.js were missing French fields
- Fields were passed from API but never saved to database

**Solution 4:**
- Added `title_fr`, `excerpt_fr`, `content_fr`, `meta_keywords_fr` to both functions
- Added migration for `meta_keywords_fr` column

**Files Modified:**
- `eytan.com/admin.html` - Reverted auth changes
- `eytan.com/admin-editor.html` - Reverted auth changes
- `eytan-com-blog-backend/routes/translate.js` - Removed requireAuth, switched to gpt-3.5-turbo
- `eytan-com-blog-backend/services/database.js` - Added French fields to create/update, added meta_keywords_fr migration

**Key Lesson:**
Cross-domain cookies between eytan.com and api.eytan.com DO NOT WORK.
Always use localStorage for auth on the frontend, never rely on server sessions.

---

### Session 14 (Feb 3, 2026)
**Focus:** Blog Post Automation Skill + Admin Editor Redesign + French SEO Fixes

**Part 1 - Blog Post Automation Skill (Frontend)**

Created comprehensive `/BLOG-POST-AUTOMATION-SKILL.md` document containing:
- **Author Voice Profile**: Eytan's writing tone, signature phrases, content structure pattern
- **Hero Image Prompts**: Templates for AI image generation (DALL-E, Midjourney)
- **Reader Engagement Techniques**:
  - Opening hooks (contrarian, promise, curiosity formulas)
  - Zeigarnik Effect (open loops)
  - Bucket brigades (transitional phrases)
  - Strategic value placement
  - Pattern interrupts
  - Emotional anchors
  - Section cliffhangers
- **Blog Post Template**: Complete markdown template with engagement cues
- **SEO Metadata Guidelines**: Title tags, meta descriptions, keywords
- **Hashtags**: Pre-built sets for Real Estate, AI/Tech, Finance, Business
- **Publishing Workflow**: Step-by-step guide
- **Quality Checklist**: Content fundamentals + engagement verification

**Part 2 - Admin Editor Redesign (Frontend)**

Redesigned `admin-editor.html` with tabbed interface:
- **General Tab**: slug, date, author, icon, image, tags, hashtags, focus keyword
- **English Tab**: title, excerpt, content + SEO fields (seo_title, meta_description, meta_keywords)
- **French Tab**: title, excerpt, content + SEO fields with "Translate" buttons
- Tab state persists in sessionStorage
- Scalable design for adding future languages
- Cleaner, more organized interface

**Part 3 - French SEO Fixes (Backend)**

Fixed French SEO page generation issues:
- Use actual `title_fr` instead of `seo_title_fr` for page display
- Add `meta_keywords_fr` support to translation endpoint
- French SEO fields now properly used in page generation
- Added French navigation and "More Posts" section to French pages
- Created `regenerate-french-pages.js` script

**Files Created:**
- `eytan.com/BLOG-POST-AUTOMATION-SKILL.md`
- `eytan-com-blog-backend/regenerate-french-pages.js`

**Files Modified:**
- `eytan.com/admin-editor.html` (369 lines added, 163 removed)
- `eytan-com-blog-backend/routes/translate.js`
- `eytan-com-blog-backend/services/seo.js`

---

## Current Status (Mar 2026)

### Blog Stats
- **Published Posts:** 21
- **Languages:** 3 (English + French + Portuguese)
- **SEO Pages:** 63 (21 EN + 21 FR + 21 PT)
- **Tags:** 8 categories

### Features Complete
- ✅ Blog CRUD with admin panel
- ✅ Image upload system
- ✅ SEO static pages
- ✅ Password protection
- ✅ Tag filtering
- ✅ Trilingual (EN/FR/PT)
- ✅ Social media publishing
- ✅ Share buttons (LinkedIn, X, FB, WhatsApp, Copy)
- ✅ Blog Post Automation Skill (content creation guide)
- ✅ Tabbed admin editor (General/English/French/Portuguese)
- ✅ Resume download modal (Modern/Classic versions, trilingual PDFs)
- ✅ Interactive Chart.js visualizations (5 charts with toggles/sliders)
- ✅ Research report system with citations

### Pending
- ⏳ Blog categorization UI (Session 9 plan exists)

### Session 15 (Feb 4-16, 2026)
**Focus:** Portuguese Language Support + Trilingual Resume System

**Part 1 - Portuguese Language Support (Feb 4 - Backend)**

Added full Portuguese (PT) support to the blog system:
- Added Portuguese fields to database schema (title_pt, excerpt_pt, content_pt, seo_title_pt, meta_description_pt, meta_keywords_pt)
- Added Portuguese SEO page generation (`blog/pt/{slug}.html`)
- Added `?lang=pt` API parameter support
- Added multilingual hashtags support (FR/PT)
- Added native SEO and hashtag generation endpoints
- Created bulk translation script for Portuguese (`translate-posts-to-portuguese.js`)
- Updated posts routes with Portuguese field handling

**Files Modified (Backend):**
- `routes/posts.js` - Portuguese fields in CRUD operations
- `services/seo.js` - Portuguese SEO page generation
- `server.js` - Portuguese language parameter handling
- New: `scripts/translate-posts-to-portuguese.js`

**Part 2 - Trilingual Resume System (Feb 16 - Frontend)**

Complete overhaul of resume page with trilingual PDF support:
- Updated resume.html with latest CV content (B1a version, Feb 2026)
- Added trilingual support to resume page (EN/FR/PT language switcher)
- Added EB logo next to name in resume header card
- Created French and Portuguese PDF resume versions
- Updated download button to serve language-specific PDFs based on selected language
- Redesigned all 3 resume PDFs with modern executive layout:
  - Navy sidebar with profile photo, skills, languages, education
  - White main content area with experience, achievements
  - Gold accent lines and professional typography
  - Achievement callout boxes with quantified results

**Files Modified (Frontend):**
- `resume.html` - Trilingual page with language-aware PDF download
- `Eytan-Benzeno-Resume.pdf` - English (redesigned)
- `Eytan-Benzeno-Resume-FR.pdf` - French (new)
- `Eytan-Benzeno-Resume-PT.pdf` - Portuguese (new)
- `js/i18n.js` - Portuguese translations for resume section
- `CLAUDE-MEMORY.md` - Updated with Portuguese info

**Resume PDF Features:**
- Modern two-column executive layout
- Canvas-drawn headers with EB logo
- Skill proficiency dot indicators
- Language proficiency visualization
- Achievement boxes with metrics ($3M/summer, 400+ members, etc.)
- Consistent branding across all 3 languages

---

### Session 16 (Feb 19 - Mar 6, 2026)
**Focus:** Resume Modal System + Interactive Chart.js Visualizations + Research Reports

**Part 1 - Resume Download Modal (Feb 19)**

Created dual-version resume download system with preview:
- Modal popup with **two resume versions:**
  - **Modern Resume:** Executive design with navy sidebar (EN/FR/PT)
  - **Classic Resume:** Traditional long-form layout (EN/FR/PT)
- In-modal PDF preview before download
- Improved UX with hover states and animations
- Body scroll lock when modal is open
- 6 total PDFs served based on language + version selection

**Files Modified (Frontend):**
- `resume.html` - Added modal markup and dual-version logic
- Added 3 new Classic PDFs: `Eytan-Benzeno-Resume-Classic-*.pdf` (EN/FR/PT)
- `css/styles.css` - Modal styles, hover states, scroll lock

**Part 2 - Interactive Chart.js Visualizations (Feb 20-25)**

Implemented interactive data visualization system for blog posts:
- **5 interactive charts** for AI acceleration post:
  1. **AI Compute Scaling** - Exponential growth with divergent projections
  2. **Road to AGI Timeline** - Key milestones (includes Geoffrey Hinton)
  3. **Energy Demand** - Grid vs private generation, power source breakdown
  4. **Job Displacement by Sector** - Interactive year slider (2025-2035)
  5. **Causal Diagram** - AI → Power → Societal Impact flowchart
- Toggle buttons for switching between data views
- Year slider for temporal analysis
- Standalone charts page: `ai-charts.html`
- **Chart.js protected in SEO template** - survives all regenerations
- External JavaScript file: `js/blog-charts.js`

**Technical Challenges Solved:**
- Fixed Chart.js race condition with script loading
- Removed annotation plugin causing conflicts
- Fixed missing gold color variable breaking charts
- Fixed 179 SVG render errors in flowchart
- Prevented duplicate/simplified chart code
- Ensured Chart.js CDN loads before chart initialization

**Files Created (Frontend):**
- `ai-charts.html` - Standalone interactive charts page
- `js/blog-charts.js` - Chart initialization code
- `images/ai-acceleration-causal-diagram.svg` - Causal flowchart

**Files Modified (Frontend):**
- `blog-post-template.html` - Added Chart.js CDN and canvas placeholders
- SEO pages for AI acceleration posts (EN/FR/PT)

**Part 3 - Research Report System (Feb 20-21)**

Created endpoint for long-form research reports with citations:
- New API endpoint: `/api/research/ai-acceleration-part-1`
- Public research page with deep analysis
- **62 real source citations** extracted from original PDF
- SVG flowchart diagrams (no JavaScript dependencies)
- Stripped Claude citation markers and PUA artifacts
- HTML-based reports served from database

**Files Created (Backend):**
- New route handler for research reports
- Database entries for research content

**Part 4 - Translation System Improvements (Feb 23-24)**

Fixed multiple translation issues:
- Implemented proper backend chunking (1200 char hard limit)
- Fixed `gpt-3.5-turbo-16k` token limit errors
- Added safety net with backend content truncation
- Fixed H1 to use real post title instead of SEO title
- Don't run `marked.parse()` on database HTML content

**Files Modified (Backend):**
- `routes/translate.js` - Chunking logic and token limits
- `services/seo.js` - H1 title fix

**Part 5 - New Blog Posts Published**

**Post #20:** "The AI Acceleration Nobody Is Ready For (And the Power Grid That Can't Keep Up)"
- Published: Feb 20, 2026
- First post with embedded interactive charts
- Trilingual (EN/FR/PT)

**Post #21:** "AI Acceleration, the "Power Race," and Near-Term Societal Shock Risk Through 2035 (Part 1: Short-Term Vision)"
- Published: Feb 22-25, 2026 (multiple refinements)
- Title shortened to "AI Acceleration - Part 1: Short-Term Vision"
- All 5 interactive visualizations embedded
- Trilingual with full Chart.js support
- 127KB HTML file with embedded charts

**Part 6 - Bug Fixes**

**Encoding Issues (Feb 25):**
- Removed corrupted UTF-8 characters from AI acceleration post
- Emergency rebuild of French/Portuguese corrupted posts
- Restored full Portuguese content after corruption

**Chart.js Fixes (Feb 23-25):**
- Fixed missing script tags preventing rendering
- Fixed CDN cache issues
- Removed duplicate chart code
- Fixed annotation plugin conflicts

**Deployment Stats:**
- **970+ commits** to frontend (SEO page updates, chart fixes, modal improvements)
- **13 commits** to backend (translation fixes, research reports)
- All changes deployed to production via GitHub Pages + Railway

---

### Recently Fixed (Session 16)
- ✅ Resume download modal with Modern/Classic versions
- ✅ Interactive Chart.js visualizations (5 charts with toggles/sliders)
- ✅ Research report system with 62 source citations
- ✅ Translation chunking (fixed token limit errors)
- ✅ Chart.js protected from SEO regeneration
- ✅ Encoding issues in French/Portuguese posts
- ✅ H1 titles now use real post title (not SEO title)

---

## Important Notes for Claude

1. **Always read this file first** when starting a new session
2. **Check both repos** when debugging issues
3. **GitHub Pages takes 1-2 minutes** to deploy - always mention this
4. **Hard refresh** (Ctrl+Shift+R / Cmd+Shift+R) after fixes
5. **Never commit .env files** or secrets
6. **git pull --rebase** before pushing to avoid conflicts
7. **User's name:** Eytan Benzeno
8. **Don't create posts** unless asked - user manages content
9. **CRITICAL: Cross-domain cookies DON'T work** between eytan.com and api.eytan.com
   - Never use server session auth for admin pages
   - Always use localStorage for frontend auth
   - API endpoints called from admin should NOT require session auth (CORS protects them)

---

## Related Documentation

- `BILINGUAL-SETUP.md` - French translation setup guide
- `SOCIAL-MEDIA-SETUP.md` - Social media API configuration
- `README.md` - Basic setup instructions
- Frontend `CLAUDE-MEMORY.md` - Quick reference (points here)

---

**End of Memory Guide**
