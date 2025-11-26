// Blog listing functionality

let blogPosts = [];

// Load blog posts from JSON or localStorage
async function loadBlogPosts() {
    try {
        // Try localStorage first (for local admin edits)
        const localData = localStorage.getItem('blogPosts');
        if (localData) {
            blogPosts = JSON.parse(localData);
            renderBlogPosts();
            return;
        }

        // Load from JSON file
        const response = await fetch('data/blog-posts.json');
        const data = await response.json();
        blogPosts = data.posts || [];
        renderBlogPosts();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '<p style="text-align: center; color: #6c757d;">Error loading blog posts. Please try again later.</p>';
        }
    }
}

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
document.addEventListener('DOMContentLoaded', loadBlogPosts);
