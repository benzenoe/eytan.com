# Interactive Chart Protection

## ⚠️ CRITICAL: Do NOT Overwrite These Charts!

The blog post `ai-acceleration-power-race-2026.html` contains **custom interactive Chart.js visualizations** that took significant effort to create.

### Protected Charts:
1. **🚀 AI Training Compute Scaling** - Line chart with projected triangles
2. **🧠 Road to AGI Timeline** - Horizontal bar chart with expert estimates
3. **👷 AI Job Displacement vs New Jobs** - Interactive with year slider (2025-2035)
4. **⚡ Global Data Center Power Demand** - Toggle between Energy Sources & Grid vs Private views

### Protection Mechanisms:
- HTML comments mark protected sections: `<!-- DO NOT MODIFY: Interactive charts -->`
- Git history: Commit `d267a55` has the full interactive version
- If charts are lost, restore from: `git show d267a55:blog/ai-acceleration-power-race-2026.html`

### When Editing This Post:
1. **NEVER regenerate the HTML from template** - it will lose the charts
2. **NEVER run "Generate French/Portuguese Page"** unless you verify charts are preserved
3. **Edit content manually** through the admin editor without touching chart sections
4. **If you must regenerate**, restore charts immediately from git after

### How Charts Were Lost Previously:
The admin editor's "Generate French Page" button calls `generateFullPage()` which:
- Translates content
- Saves to database
- Republishes HTML files

During this process, the complex interactive Chart.js code was simplified. The fix was to restore from git commit `d267a55`.

### Quick Restore Command:
```bash
cd "/Users/eytan/claude-code/Eytan.com/eytan.com Website"
git show d267a55:blog/ai-acceleration-power-race-2026.html > blog/ai-acceleration-power-race-2026.html
git add blog/ai-acceleration-power-race-2026.html
git commit -m "Restore interactive charts"
git push
```

### Files To Check:
- ✅ English: `blog/ai-acceleration-power-race-2026.html`
- ⚠️ French: `blog/fr/ai-acceleration-power-race-2026.html` (if it exists)
- ⚠️ Portuguese: `blog/pt/ai-acceleration-power-race-2026.html` (if it exists)

Created: February 23, 2026
Last Updated: February 23, 2026

## Standalone Backup Page

A **standalone backup version** of all interactive charts has been created at:
- **URL**: `blog/ai-charts-interactive.html`
- **Live**: https://eytan.com/blog/ai-charts-interactive.html

This page contains ONLY the charts and cannot be accidentally overwritten by the admin editor.
If the blog post charts are lost, you can:
1. Use the standalone page as reference
2. Restore from git commit `d267a55`
3. Link to the standalone page from other blog posts

The standalone page includes all 4 interactive charts with full functionality.
