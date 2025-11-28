#!/usr/bin/env python3
"""
Save Blog Files Script
======================
This script helps you save exported blog data to the correct project folders.

Usage:
1. Export your blog data from the admin panel (clicks "Export All Files")
2. Run this script: python3 save-blog-files.py
3. Select the blog-backup-*.json file from your Downloads folder
4. The script will automatically save all files to the correct locations

This ensures your blog data is permanently saved and backed up in the project.
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR / "data"
BLOG_DIR = SCRIPT_DIR / "blog"

def save_blog_data(backup_file_path):
    """Save blog data from backup file to project folders"""

    # Read the backup file
    try:
        with open(backup_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: File not found: {backup_file_path}")
        return False
    except json.JSONDecodeError:
        print(f"❌ Error: Invalid JSON file")
        return False

    # Validate data structure
    if 'posts' not in data or 'content' not in data:
        print("❌ Error: Invalid backup file format")
        print("   Expected format: {posts: [...], content: {...}}")
        return False

    posts = data['posts']
    content = data['content']

    print(f"\n📦 Processing backup from: {data.get('timestamp', 'Unknown')}")
    print(f"   Found {len(posts)} posts and {len(content)} content files\n")

    # Create directories if they don't exist
    DATA_DIR.mkdir(exist_ok=True)
    BLOG_DIR.mkdir(exist_ok=True)

    # 1. Save blog-posts.json
    posts_json = {"posts": posts}
    posts_file = DATA_DIR / "blog-posts.json"

    try:
        with open(posts_file, 'w', encoding='utf-8') as f:
            json.dump(posts_json, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved: {posts_file}")
    except Exception as e:
        print(f"❌ Error saving {posts_file}: {e}")
        return False

    # 2. Save markdown files
    for post_id, markdown_content in content.items():
        md_file = BLOG_DIR / f"{post_id}.md"

        try:
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            print(f"✓ Saved: {md_file}")
        except Exception as e:
            print(f"❌ Error saving {md_file}: {e}")

    # 3. Create a timestamped backup in the project
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_file = SCRIPT_DIR / f"blog-backup-{timestamp}.json"

    try:
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n📦 Created project backup: {backup_file}")
    except Exception as e:
        print(f"⚠️  Warning: Could not create backup: {e}")

    print(f"\n✅ Success! All blog files have been saved permanently.")
    print(f"   - Blog posts: {posts_file}")
    print(f"   - Markdown files: {BLOG_DIR}")
    print(f"   - Backup: {backup_file}\n")

    return True

def main():
    print("="*60)
    print("  Blog File Saver")
    print("="*60)

    # Check if a file path was provided as argument
    if len(sys.argv) > 1:
        backup_file = sys.argv[1]
    else:
        # Prompt for file path
        print("\nEnter the path to your blog backup file")
        print("(or drag and drop the file here):")
        backup_file = input("\nFile path: ").strip()

        # Remove quotes if present (from drag & drop)
        backup_file = backup_file.strip('"').strip("'")

    if not backup_file:
        print("\n❌ No file provided. Exiting.")
        return

    # Convert to Path object
    backup_path = Path(backup_file).expanduser().resolve()

    if not backup_path.exists():
        print(f"\n❌ File does not exist: {backup_path}")
        return

    # Save the data
    success = save_blog_data(backup_path)

    if success:
        print("💡 Tip: Commit these files to git to ensure they're backed up!")
        print("   git add data/blog-posts.json blog/*.md")
        print("   git commit -m \"Update blog posts\"")
        print("   git push\n")
    else:
        print("\n❌ Failed to save blog files. Please check the errors above.\n")

if __name__ == "__main__":
    main()
