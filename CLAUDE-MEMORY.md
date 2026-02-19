# Eytan.com Frontend - Quick Reference

**Last Updated:** February 19, 2026 (Session 15)

---

## Main Documentation

**For complete documentation, see the backend repository:**

```
Repository: https://github.com/benzenoe/eytan-com-blog-backend
File: CLAUDE-MEMORY.md
```

This contains:
- Full system architecture
- All 15 session histories
- Troubleshooting guides
- Database schema
- API endpoints
- Environment variables

---

## This Repository

**eytan.com Frontend** - Static site hosted on GitHub Pages

| Item | Value |
|------|-------|
| Live URL | https://eytan.com |
| GitHub | https://github.com/benzenoe/eytan.com.git |
| Hosting | GitHub Pages (auto-deploys from main) |
| Deploy Time | 1-2 minutes after push |

---

## Quick Reference

### Key Files
```
├── index.html          # Homepage
├── blog.html           # Blog listing + tag filters
├── blog-post.html      # Dynamic post viewer
├── admin.html          # Admin panel
├── login.html          # Login page
├── js/
│   ├── blog.js         # Blog logic + filtering
│   ├── admin.js        # Admin panel logic
│   └── i18n.js         # Internationalization (EN/FR/PT)
├── css/styles.css      # All styles
├── blog/               # SEO static pages
│   ├── {slug}.html     # English pages
│   ├── fr/{slug}.html  # French pages
│   └── pt/{slug}.html  # Portuguese pages
├── posts/{slug}.md     # Markdown content
├── images/blog/        # Uploaded images
└── data/blog-posts.json # Post metadata
```

### Deploy Changes
```bash
git add .
git commit -m "Description"
git push origin main
# Wait 1-2 minutes for GitHub Pages
```

### After Fixes
Tell user to hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

---

## Features Implemented

| Feature | Session | Status |
|---------|---------|--------|
| Blog system | 1-3 | ✅ |
| Image upload | 2 | ✅ |
| SEO pages | 4-5 | ✅ |
| Share buttons | 6-7 | ✅ |
| Password protection | 8 | ✅ |
| Tag filtering | 10 | ✅ |
| Bilingual (EN/FR) | 11 | ✅ |
| Social media | 12 | ✅ |
| Auth fixes | 13 | ✅ |
| Blog automation skill | 14 | ✅ |
| Tabbed admin editor | 14 | ✅ |
| Trilingual (EN/FR/PT) | 15 | ✅ |
| Portuguese SEO pages | 15 | ✅ |
| Trilingual resume PDFs | 15 | ✅ |

---

## Related Repositories

### Backend API
- **GitHub:** https://github.com/benzenoe/eytan-com-blog-backend.git
- **Live URL:** https://api.eytan.com
- **Hosting:** Railway

### Clone Both
```bash
git clone https://github.com/benzenoe/eytan.com.git
git clone https://github.com/benzenoe/eytan-com-blog-backend.git
```

---

## Common Issues

### Posts not showing
1. Check API: `curl https://api.eytan.com/api/posts?status=published`
2. See backend `CLAUDE-MEMORY.md` for diagnostic scripts
3. Hard refresh browser

### Language not switching
1. Check `js/i18n.js` is loaded
2. Clear localStorage
3. Hard refresh

### Portuguese SEO pages missing
1. Backend: `node regenerate-all.js`
2. Pages generate to `blog/pt/{slug}.html`
3. Push this repo: `git push`

### SEO pages outdated
1. Backend: `node regenerate-all.js`
2. Push this repo: `git push`
3. Wait 2 min

### Resume PDF wrong language
- Download button serves PDF based on current language selection
- Switch language first, then click download
- PDFs: `Eytan-Benzeno-Resume.pdf` (EN), `-FR.pdf`, `-PT.pdf`

---

**For detailed troubleshooting, see backend CLAUDE-MEMORY.md**
