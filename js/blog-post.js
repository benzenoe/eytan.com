// Individual blog post functionality

// Blog posts metadata (same as in blog.js)
const blogPostsData = {
    'welcome-to-my-blog': {
        title: 'Welcome to My Blog',
        date: '2024-11-25',
        author: 'Eytan Benzeno'
    },
    'getting-started-with-web-development': {
        title: 'Getting Started with Web Development',
        date: '2024-11-20',
        author: 'Eytan Benzeno'
    },
    'my-favorite-coding-tools': {
        title: 'My Favorite Coding Tools',
        date: '2024-11-15',
        author: 'Eytan Benzeno'
    }
};

// Get post ID from URL
function getPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('post');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load and render blog post
async function loadBlogPost() {
    const postId = getPostId();
    const container = document.getElementById('blog-post-container');

    if (!postId || !blogPostsData[postId]) {
        container.innerHTML = `
            <h1>Post Not Found</h1>
            <p>Sorry, the blog post you're looking for doesn't exist.</p>
        `;
        return;
    }

    const postData = blogPostsData[postId];

    // Update page title
    document.getElementById('post-title').textContent = `${postData.title} - Eytan Benzeno`;

    try {
        // Fetch markdown file
        const response = await fetch(`blog/${postId}.md`);

        if (!response.ok) {
            throw new Error('Post not found');
        }

        const markdown = await response.text();

        // Parse and render markdown
        const htmlContent = marked.parse(markdown);

        // Render post
        container.innerHTML = `
            <h1>${postData.title}</h1>
            <div class="blog-post-meta">
                <i class="far fa-calendar"></i> ${formatDate(postData.date)} •
                <i class="far fa-user"></i> ${postData.author}
            </div>
            <div class="blog-post-body">
                ${htmlContent}
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <h1>${postData.title}</h1>
            <div class="blog-post-meta">
                <i class="far fa-calendar"></i> ${formatDate(postData.date)} •
                <i class="far fa-user"></i> ${postData.author}
            </div>
            <div class="blog-post-body">
                <p>This blog post is coming soon! Check back later for the full content.</p>
            </div>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogPost);
