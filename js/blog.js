// Blog listing functionality

// Blog posts metadata
const blogPosts = [
    {
        id: 'welcome-to-my-blog',
        title: 'Welcome to My Blog',
        date: '2024-11-25',
        excerpt: 'This is my first blog post. Learn about what I plan to write about and why I started this blog.',
        icon: '\u{1F44B}'
    },
    {
        id: 'getting-started-with-web-development',
        title: 'Getting Started with Web Development',
        date: '2024-11-20',
        excerpt: 'A guide for beginners looking to start their journey in web development. Tips, resources, and advice.',
        icon: '\u{1F4BB}'
    },
    {
        id: 'my-favorite-coding-tools',
        title: 'My Favorite Coding Tools',
        date: '2024-11-15',
        excerpt: 'A curated list of my favorite tools and resources that help me be more productive as a developer.',
        icon: '\u{1F6E0}'
    }
];

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Render blog posts
function renderBlogPosts() {
    const blogGrid = document.getElementById('blog-grid');

    if (!blogGrid) return;

    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    blogGrid.innerHTML = sortedPosts.map(post => `
        <a href="blog-post.html?post=${post.id}" class="blog-card">
            <div class="blog-card-header">
                ${post.icon}
            </div>
            <div class="blog-card-content">
                <h3>${post.title}</h3>
                <div class="blog-meta">
                    <i class="far fa-calendar"></i> ${formatDate(post.date)}
                </div>
                <p class="blog-excerpt">${post.excerpt}</p>
            </div>
        </a>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', renderBlogPosts);
