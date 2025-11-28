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
        <div class="blog-card-wrapper">
            <a href="blog-post.html?post=${post.id}" class="blog-card">
                ${post.image ? `
                    <div class="blog-card-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                ` : `
                    <div class="blog-card-header">
                        ${post.icon}
                    </div>
                `}
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <div class="blog-card-share">
                        <button onclick="shareBlogPost(event, '${post.id}', '${post.title.replace(/'/g, "\\'")}', 'facebook')" class="share-btn-small facebook-btn" title="Share on Facebook">
                            <i class="fab fa-facebook"></i>
                        </button>
                        <button onclick="shareBlogPost(event, '${post.id}', '${post.title.replace(/'/g, "\\'")}', 'linkedin')" class="share-btn-small linkedin-btn" title="Share on LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </button>
                        <button onclick="shareBlogPost(event, '${post.id}', '${post.title.replace(/'/g, "\\'")}', 'x')" class="share-btn-small x-btn" title="Share on X">
                            <span class="x-icon">𝕏</span>
                        </button>
                    </div>
                    <div class="blog-meta">
                        <i class="far fa-calendar"></i> ${formatDate(post.date)}
                    </div>
                    <p class="blog-excerpt">${post.excerpt}</p>
                </div>
            </a>
        </div>
    `).join('');
}

// Social media sharing function
function shareBlogPost(event, postId, postTitle, platform) {
    // Prevent navigation to blog post
    event.preventDefault();
    event.stopPropagation();

    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/blog-post.html?post=${postId}`;
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedTitle = encodeURIComponent(postTitle);

    let shareUrl;

    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
        case 'x':
            const text = encodeURIComponent(`Check out "${postTitle}" by Eytan Benzeno`);
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`;
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogPosts);
