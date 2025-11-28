# Blog Backup & Recovery Guide

## 🔒 How Your Blog Data is Now Protected

Your blog now has **multiple layers of protection** to prevent data loss:

### 1. **Auto-Backup (Every 30 minutes)**
- Automatically saves a backup copy to a separate localStorage key
- Runs silently in the background whenever you save a post
- Acts as an emergency recovery point

### 2. **Manual Export (Download all files)**
- Click "Export All Files" to download:
  - `blog-posts.json` (all post metadata)
  - Individual `.md` files for each post
  - Complete timestamped backup file
- These files can be saved permanently to your computer

### 3. **Permanent File Storage**
- Use the `save-blog-files.py` script to save exported files directly to your project
- Files are saved to:
  - `data/blog-posts.json` - Post metadata
  - `blog/*.md` - Markdown content files

---

## 📝 Recommended Workflow

### After Creating/Editing Posts:

1. **Export Your Data**
   ```
   Admin Panel → Click "Export All Files"
   ```
   This downloads all your blog files

2. **Save to Project**
   ```bash
   cd /Users/eytan/claude-test/eytan-website
   python3 save-blog-files.py
   # Then select the downloaded backup file
   ```

3. **Commit to Git**
   ```bash
   git add data/blog-posts.json blog/*.md
   git commit -m "Update blog posts"
   git push
   ```

**Do this after every major editing session!**

---

## 🚨 Emergency Recovery

### If You Accidentally Clear Browser Data:

**Option 1: Restore from Auto-Backup** (Last 30 minutes)
1. Open Admin Panel
2. Click "Restore Backup" button
3. This restores from the last auto-backup

**Option 2: Import from File**
1. Locate your last exported backup file
2. Click "Import Backup" in Admin Panel
3. Select the `blog-backup-*.json` file

**Option 3: Restore from Git**
1. The files are in your repository:
   - `data/blog-posts.json`
   - `blog/*.md` files
2. These are loaded automatically when you open the blog

---

## 🔄 How It All Works

### Data Flow:
```
1. You create/edit a post in Admin Panel
   ↓
2. Saved to localStorage (temporary)
   ↓
3. Auto-backup created (every 30 min, emergency only)
   ↓
4. You click "Export All Files"
   ↓
5. Files downloaded to your computer
   ↓
6. Run save-blog-files.py to save permanently
   ↓
7. Files saved to project folders
   ↓
8. Commit to git for permanent backup
```

### Why This System is Better:
- ❌ **Old System**: Only localStorage (can be easily cleared)
- ✅ **New System**:
  - Auto-backup (emergency recovery)
  - File exports (your computer)
  - Project files (git backup)
  - Multiple recovery options

---

## 📋 Quick Reference

### Admin Panel Buttons:

| Button | What It Does |
|--------|--------------|
| **Export All Files** | Downloads all blog data as individual files |
| **Import Backup** | Restore from a backup file |
| **Restore Backup** | Restore from auto-backup (last 30 min) |

### Files Created:

| File | Purpose |
|------|---------|
| `blog-posts.json` | Post metadata (title, date, etc) |
| `{post-id}.md` | Markdown content for each post |
| `blog-backup-{timestamp}.json` | Complete backup with everything |

---

## 💡 Best Practices

1. **Export after every editing session**
2. **Run save-blog-files.py weekly** (or after major changes)
3. **Commit to git monthly** (or after significant updates)
4. **Keep recent backup files** on your computer as extra insurance

---

## ⚙️ Using the Save Script

### Method 1: Interactive
```bash
cd /Users/eytan/claude-test/eytan-website
python3 save-blog-files.py
# Then paste the path to your backup file
```

### Method 2: With Argument
```bash
python3 save-blog-files.py ~/Downloads/blog-backup-2025-01-28.json
```

### Method 3: Drag & Drop
```bash
python3 save-blog-files.py
# Then drag the backup file into terminal and press Enter
```

---

## 🎯 Your Data is Safe When:

✅ You regularly export your blog data
✅ You run the save script to create permanent files
✅ You commit files to git periodically
✅ Auto-backup is running (automatic)

---

## ❓ FAQ

**Q: How often should I export?**
A: After every major editing session or when you add/edit multiple posts.

**Q: What if I forget to export?**
A: The auto-backup runs every 30 minutes, giving you an emergency recovery option.

**Q: Where should I keep backup files?**
A: In your project (via save-blog-files.py) and committed to git. Keep recent exports on your computer as extra insurance.

**Q: Can I still lose data?**
A: Only if you:
1. Clear browser data AND
2. Don't have any exported backups AND
3. Don't have files saved in your project

With the new system, you have multiple recovery points!

---

**Remember: The safest approach is to export and save your data regularly!**
