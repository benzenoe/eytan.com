// Blog listing functionality

let blogPosts = [];
let currentTagFilter = 'all';

// Load blog posts from API
async function loadBlogPosts() {
    try {
        // Load from API - only published posts
        const response = await fetch('https://api.eytan.com/api/posts?status=published');
        const data = await response.json();
        blogPosts = data.posts || [];

        // Populate tag filters
        populateTagFilters();

        // Check for tag filter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const tagParam = urlParams.get('tag');
        if (tagParam) {
            currentTagFilter = tagParam;
        }

        renderBlogPosts();
        updateActiveTagFilter();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        const blogGrid = document.getElementById('blog-grid');
        if (blogGrid) {
            blogGrid.innerHTML = '<p style="text-align: center; color: #6c757d;">Error loading blog posts. Please try again later.</p>';
        }
    }
}

// Populate tag filters dynamically
function populateTagFilters() {
    const tagFilters = document.getElementById('tag-filters');
    if (!tagFilters) return;

    // Collect all unique tags
    const allTags = new Set();
    blogPosts.forEach(post => {
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => allTags.add(tag));
        }
    });

    // Sort tags alphabetically
    const sortedTags = Array.from(allTags).sort();

    // Add tag filter buttons (keep "All Posts" button)
    const tagButtons = sortedTags.map(tag =>
        `<button class="tag-filter" data-tag="${tag}" onclick="filterByTag('${tag}')">${tag}</button>`
    ).join('');

    // Insert after "All Posts" button
    const allPostsBtn = tagFilters.querySelector('[data-tag="all"]');
    if (allPostsBtn) {
        allPostsBtn.insertAdjacentHTML('afterend', tagButtons);
    }
}

// Filter posts by tag
function filterByTag(tag) {
    currentTagFilter = tag;

    // Update URL without reload
    const url = new URL(window.location);
    if (tag === 'all') {
        url.searchParams.delete('tag');
    } else {
        url.searchParams.set('tag', tag);
    }
    window.history.pushState({}, '', url);

    updateActiveTagFilter();
    renderBlogPosts();
}

// Update active tag filter button
function updateActiveTagFilter() {
    const tagButtons = document.querySelectorAll('.tag-filter');
    tagButtons.forEach(btn => {
        const btnTag = btn.getAttribute('data-tag');
        if (btnTag === currentTagFilter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
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

    // Filter posts by tag
    let filteredPosts = blogPosts;
    if (currentTagFilter !== 'all') {
        filteredPosts = blogPosts.filter(post =>
            post.tags && post.tags.includes(currentTagFilter)
        );
    }

    // Sort posts by date (newest first)
    const sortedPosts = [...filteredPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    blogGrid.innerHTML = sortedPosts.map(post => {
        const slug = post.slug || post.id;

        // Generate tags HTML
        const tagsHtml = post.tags && post.tags.length > 0
            ? `<div class="blog-card-tags">
                ${post.tags.map(tag =>
                    `<span class="blog-card-tag">${tag}</span>`
                ).join('')}
               </div>`
            : '';

        return `
        <div class="blog-card-wrapper">
            <a href="blog/${slug}.html" class="blog-card">
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
                        <button onclick="shareBlogPost(event, '${slug}', '${post.title.replace(/'/g, "\\'")}', 'linkedin')" class="share-btn-small linkedin-btn" title="Share on LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </button>
                        <button onclick="shareBlogPost(event, '${slug}', '${post.title.replace(/'/g, "\\'")}', 'x')" class="share-btn-small x-btn" title="Share on X">
                            <span class="x-icon">𝕏</span>
                        </button>
                        <button onclick="shareBlogPost(event, '${slug}', '${post.title.replace(/'/g, "\\'")}', 'facebook')" class="share-btn-small facebook-btn" title="Share on Facebook">
                            <i class="fab fa-facebook"></i>
                        </button>
                        <button onclick="shareBlogPost(event, '${slug}', '${post.title.replace(/'/g, "\\'")}', 'whatsapp')" class="share-btn-small whatsapp-btn" title="Share on WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button onclick="shareBlogPost(event, '${slug}', '${post.title.replace(/'/g, "\\'")}', 'copy')" class="share-btn-small copy-btn" title="Copy Link">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                    <div class="blog-meta">
                        <i class="far fa-calendar"></i> ${formatDate(post.date)}
                    </div>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    ${tagsHtml}
                </div>
            </a>
        </div>
    `;
    }).join('');
}

// Social media sharing function
function shareBlogPost(event, postSlug, postTitle, platform) {
    // Prevent navigation to blog post
    event.preventDefault();
    event.stopPropagation();

    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/blog/${postSlug}.html`;
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
        case 'whatsapp':
            const whatsappText = encodeURIComponent(`${postTitle} by Eytan Benzeno`);
            // Use whatsapp:// for mobile, web.whatsapp.com for desktop
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            shareUrl = isMobile
                ? `whatsapp://send?text=${whatsappText}%20${encodedUrl}`
                : `https://web.whatsapp.com/send?text=${whatsappText}%20${encodedUrl}`;
            break;
        case 'copy':
            // Copy to clipboard
            navigator.clipboard.writeText(postUrl).then(() => {
                // Get the button element
                const button = event.target.closest('button');
                const icon = button.querySelector('i');
                const originalClass = icon.className;

                // Change icon to checkmark
                icon.className = 'fas fa-check';
                button.title = 'Copied!';
                button.classList.add('copied');

                // Reset after 2 seconds
                setTimeout(() => {
                    icon.className = originalClass;
                    button.title = 'Copy Link';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy link:', err);
                alert('Failed to copy link. Please try again.');
            });
            return; // Don't open a new window for copy
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogPosts);
