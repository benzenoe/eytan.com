// Individual blog post functionality

let blogPostsData = {};
let blogContent = {};

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

// Load blog data
async function loadBlogData() {
    try {
        // Try localStorage first (for local admin edits)
        const localPosts = localStorage.getItem('blogPosts');
        const localContent = localStorage.getItem('blogContent');

        if (localPosts) {
            const posts = JSON.parse(localPosts);
            posts.forEach(post => {
                blogPostsData[post.id] = {
                    title: post.title,
                    date: post.date,
                    author: post.author,
                    image: post.image || ''
                };
            });
            if (localContent) {
                blogContent = JSON.parse(localContent);
            }
            return;
        }

        // Load from JSON file
        const response = await fetch('data/blog-posts.json');
        const data = await response.json();
        const posts = data.posts || [];

        posts.forEach(post => {
            blogPostsData[post.id] = {
                title: post.title,
                date: post.date,
                author: post.author,
                image: post.image || ''
            };
        });
    } catch (error) {
        console.error('Error loading blog data:', error);
    }
}

// Load and render blog post
async function loadBlogPost() {
    await loadBlogData();

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
        let markdown = '';

        // Check localStorage first
        if (blogContent[postId]) {
            markdown = blogContent[postId];
        } else {
            // Fetch markdown file
            const response = await fetch(`blog/${postId}.md`);

            if (!response.ok) {
                throw new Error('Post not found');
            }

            markdown = await response.text();
        }

        // Parse and render markdown
        const htmlContent = marked.parse(markdown);

        // Render post
        container.innerHTML = `
            <h1>${postData.title}</h1>
            <div class="blog-post-meta">
                <i class="far fa-calendar"></i> ${formatDate(postData.date)} •
                <i class="far fa-user"></i> ${postData.author}
            </div>
            ${postData.image ? `
                <div class="blog-post-featured-image">
                    <img src="${postData.image}" alt="${postData.title}">
                </div>
            ` : ''}
            <div class="blog-post-body">
                ${htmlContent}
            </div>
            <div class="social-share">
                <h3>Share this post</h3>
                <div class="share-buttons">
                    <button onclick="shareToFacebook()" class="share-btn facebook-btn" title="Share on Facebook">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button onclick="shareToLinkedIn()" class="share-btn linkedin-btn" title="Share on LinkedIn">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </button>
                    <button onclick="shareToX()" class="share-btn x-btn" title="Share on X">
                        <span class="x-icon">𝕏</span> X
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `
            <h1>${postData.title}</h1>
            <div class="blog-post-meta">
                <i class="far fa-calendar"></i> ${formatDate(postData.date)} •
                <i class="far fa-user"></i> ${postData.author}
            </div>
            ${postData.image ? `
                <div class="blog-post-featured-image">
                    <img src="${postData.image}" alt="${postData.title}">
                </div>
            ` : ''}
            <div class="blog-post-body">
                <p>This blog post is coming soon! Check back later for the full content.</p>
            </div>
            <div class="social-share">
                <h3>Share this post</h3>
                <div class="share-buttons">
                    <button onclick="shareToFacebook()" class="share-btn facebook-btn" title="Share on Facebook">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                    <button onclick="shareToLinkedIn()" class="share-btn linkedin-btn" title="Share on LinkedIn">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </button>
                    <button onclick="shareToX()" class="share-btn x-btn" title="Share on X">
                        <span class="x-icon">𝕏</span> X
                    </button>
                </div>
            </div>
        `;
    }
}

// Social media sharing functions
function shareToFacebook() {
    const postId = getPostId();
    const postData = blogPostsData[postId];
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToLinkedIn() {
    const postId = getPostId();
    const postData = blogPostsData[postId];
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(postData.title);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareToX() {
    const postId = getPostId();
    const postData = blogPostsData[postId];
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out "${postData.title}" by Eytan Benzeno`);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogPost);
