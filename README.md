# Eytan.com - Personal Website

A modern, colorful personal website featuring a blog, resume, and social media links.

## 🚀 Features

- **Homepage**: Personal bio with social media links
- **Resume/CV Section**: Showcase your professional experience and skills
- **Blog**: Markdown-based blog with easy content management
- **Responsive Design**: Looks great on all devices
- **Modern & Colorful**: Vibrant gradients and contemporary design

## 📁 Project Structure

```
eytan-website/
├── index.html          # Homepage
├── resume.html         # Resume/CV page
├── blog.html           # Blog listing page
├── blog-post.html      # Individual blog post template
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   ├── main.js         # Main JavaScript
│   ├── blog.js         # Blog listing functionality
│   └── blog-post.js    # Individual post rendering
├── blog/
│   └── *.md            # Blog posts in Markdown format
└── images/             # Your images go here
```

## 🛠️ Customization Guide

### 1. Update Your Information

#### Homepage (index.html)
- Replace placeholder text in the "About Me" section
- Update social media links (lines 29-40)
- Add your professional title and interests

#### Resume (resume.html)
- Fill in your work experience, education, and skills
- Customize the skills tags to match your expertise
- Add or remove sections as needed (projects, certifications, etc.)

### 2. Add Your Blog Posts

#### Create a New Blog Post

1. Create a new `.md` file in the `blog/` directory:
   ```
   blog/my-new-post.md
   ```

2. Write your content in Markdown format

3. Update the blog metadata in `js/blog.js`:
   ```javascript
   {
       id: 'my-new-post',
       title: 'My New Post Title',
       date: '2024-11-25',
       excerpt: 'A brief description of your post',
       icon: '📝'  // Any emoji
   }
   ```

4. Also add the metadata to `js/blog-post.js`:
   ```javascript
   'my-new-post': {
       title: 'My New Post Title',
       date: '2024-11-25',
       author: 'Eytan Benzeno'
   }
   ```

### 3. Customize Colors

The color scheme uses CSS variables defined in `css/styles.css` (lines 8-15):

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    --success-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}
```

Change these gradients to customize the color scheme!

### 4. Add Your Images

Place images in the `images/` directory and reference them in your HTML:

```html
<img src="images/profile-photo.jpg" alt="Eytan Benzeno">
```

## 🌐 Deployment

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Push your code to the repository
3. Go to Settings > Pages
4. Select your branch and save
5. Your site will be live at `https://yourusername.github.io/repo-name`

### Option 2: Netlify (Free)
1. Sign up at [Netlify](https://netlify.com)
2. Drag and drop your `eytan-website` folder
3. Your site goes live instantly with a custom URL

### Option 3: Vercel (Free)
1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

### Option 4: Custom Domain
- Purchase a domain from providers like Namecheap, GoDaddy, or Google Domains
- Point your domain to your hosting service (GitHub Pages, Netlify, or Vercel)
- Follow your hosting provider's instructions for custom domain setup

## 📝 Writing Blog Posts

Blog posts are written in Markdown. Here's a quick reference:

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*

- Bullet point
- Another point

1. Numbered list
2. Another item

[Link text](https://example.com)

\`inline code\`

\`\`\`javascript
// Code block
const greeting = "Hello, World!";
\`\`\`
```

## 🔧 Local Development

To test your website locally:

### Option 1: Simple HTTP Server (Python)
```bash
cd eytan-website
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: VS Code Live Server
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Node.js http-server
```bash
npm install -g http-server
cd eytan-website
http-server
```

## 🎨 Design Philosophy

This website uses a modern, colorful design approach:
- **Gradients**: Vibrant color gradients for visual interest
- **White Space**: Clean, uncluttered layouts
- **Typography**: Clear hierarchy with varied font sizes
- **Interactivity**: Smooth hover effects and transitions
- **Responsiveness**: Mobile-first, adapts to all screen sizes

## 📱 Social Media Links

Update your social media links in all HTML files (navbar and footer):

- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourusername`
- Twitter: `https://twitter.com/yourusername`
- Email: `your.email@example.com`

## 🤝 Need Help?

If you need to make changes or have questions:
1. Check this README for guidance
2. Refer to the comments in the code
3. Use browser DevTools to inspect and test changes
4. Google specific questions (e.g., "how to change font in CSS")

## 📄 License

This website template is yours to use and customize as you wish!

---

**Built with ❤️ for Eytan Benzeno**
