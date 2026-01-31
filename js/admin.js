// Blog Admin functionality with Backend API
console.log('admin.js loaded');

// API_URL is defined in admin.html inline script
// No need to declare it here - just use the global variable
console.log('API_URL:', API_URL);

let blogPosts = [];
let currentEditId = null;

// Load blog data from API
async function loadBlogData() {
    console.log('loadBlogData called');
    try {
        console.log('Fetching from:', `${API_URL}/posts?status=all`);
        const response = await fetch(`${API_URL}/posts?status=all`, {
            method: 'GET',
            credentials: 'include'
        });

        console.log('Response status:', response.status, response.ok);
        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        console.log('Posts count:', data.posts?.length);
        blogPosts = data.posts || [];
        console.log('Calling renderPostsTable with', blogPosts.length, 'posts');
        renderPostsTable();
    } catch (error) {
        console.error('Error loading blog data:', error);
        showAlert('Error loading blog data: ' + error.message, 'error');
    }
}

// Render posts table
async function renderPostsTable() {
    const tbody = document.getElementById('posts-table-body');

    if (!tbody) return;

    if (blogPosts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem;">
                    No blog posts yet. Click "New Post" to create one!
                </td>
            </tr>
        `;
        return;
    }

    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render table first
    tbody.innerHTML = sortedPosts.map(post => {
        // Check if post needs republishing (updated after last publish)
        const needsRepublish = post.status === 'published' &&
            post.updated_at && post.published_at &&
            new Date(post.updated_at) > new Date(post.published_at);

        return `
        <tr${needsRepublish ? ' style="background: #fff3cd;"' : ''}>
            <td style="font-size: 1.5rem;">${post.icon || '📝'}</td>
            <td>
                ${post.image
                    ? `<img src="${post.image}" alt="Thumbnail" class="admin-thumbnail" />`
                    : '<div class="admin-thumbnail-placeholder">No Image</div>'}
            </td>
            <td>
                <strong>${post.title}</strong>
                <br>
                <span class="status-badge status-${post.status || 'draft'}">
                    ${post.status === 'published' ? '✓ Published' : '📝 Draft'}
                </span>
                ${needsRepublish ? `
                    <br>
                    <span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                        ⚠️ NEEDS REPUBLISH
                    </span>
                ` : ''}
                <div id="social-status-${post.id}" style="margin-top: 0.5rem;"></div>
            </td>
            <td>${formatDate(post.date)}</td>
            <td>${post.excerpt.substring(0, 60)}${post.excerpt.length > 60 ? '...' : ''}</td>
            <td>
                <div class="action-buttons">
                    ${post.status === 'published'
                        ? `<a href="https://eytan.com/blog/${post.slug || post.id}.html" target="_blank" class="btn-icon btn-view" title="View Live Post">
                            <i class="fas fa-external-link-alt"></i>
                        </a>`
                        : ''
                    }
                    <button class="btn-icon btn-publish${needsRepublish ? ' btn-republish-needed' : ''}" onclick="publishPost('${post.id}')" title="${post.status === 'published' ? 'Republish (sync to GitHub)' : 'Publish to Live Site'}" ${needsRepublish ? 'style="background: #dc3545; animation: pulse 1.5s infinite;"' : ''}>
                        <i class="fas fa-upload"></i> ${needsRepublish ? '⚠️ Republish!' : (post.status === 'published' ? 'Republish' : 'Publish')}
                    </button>
                    ${post.status === 'published'
                        ? `<button class="btn-icon" style="background: #17a2b8; color: white;" onclick="openSocialPublishModal('${post.id}')" title="Share to Social Media">
                            <i class="fas fa-share-alt"></i>
                        </button>`
                        : ''
                    }
                    <button class="btn-icon btn-edit" onclick="editPost('${post.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deletePost('${post.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');

    // Load social status for each published post
    sortedPosts.forEach(async (post) => {
        if (post.status === 'published') {
            const statusHTML = await loadSocialStatus(post.id);
            const statusDiv = document.getElementById(`social-status-${post.id}`);
            if (statusDiv) {
                statusDiv.innerHTML = statusHTML;
            }
        }
    });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show alert message
function showAlert(message, type = 'success') {
    const container = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    container.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Open create modal
function openCreateModal() {
    // Clear any existing editing data for new post
    localStorage.removeItem('editingPost');

    // Navigate to editor page
    window.location.href = 'admin-editor.html';
}

// Edit post
async function editPost(postId) {
    try {
        // Fetch full post details from API
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to load post');
        }

        const data = await response.json();
        const post = data.post;

        // Store post data for editor page to load
        localStorage.setItem('editingPost', JSON.stringify(post));

        // Navigate to editor page
        window.location.href = 'admin-editor.html';
    } catch (error) {
        console.error('Error loading post:', error);
        showAlert('Error loading post: ' + error.message, 'error');
    }
}

// Delete post
async function deletePost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    const warningMsg = post && post.status === 'published'
        ? 'This post is PUBLISHED. Deleting it here will NOT remove it from your live website. Are you sure?'
        : 'Are you sure you want to delete this post?';

    if (!confirm(warningMsg)) return;

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        await loadBlogData();
        showAlert('Post deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting post:', error);
        showAlert('Error deleting post: ' + error.message, 'error');
    }
}

// Publish post to live website
async function publishPost(postId) {
    if (!confirm('Publish this post to your live website at eytan.com?\n\nThis will make it visible to everyone within 1-2 minutes.')) {
        return;
    }

    const publishBtn = event.target.closest('.btn-publish');
    if (publishBtn) {
        publishBtn.disabled = true;
        publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
    }

    try {
        const response = await fetch(`${API_URL}/posts/${postId}/publish`, {
            method: 'POST',
            credentials: 'include'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to publish post');
        }

        const data = await response.json();
        await loadBlogData();
        showAlert('Post published successfully! Live in 1-2 minutes at eytan.com', 'success');
    } catch (error) {
        console.error('Error publishing post:', error);
        showAlert('Error publishing post: ' + error.message, 'error');
        if (publishBtn) {
            publishBtn.disabled = false;
            publishBtn.innerHTML = '<i class="fas fa-upload"></i> Publish';
        }
    }
}


// Export data as JSON (Full backup)
async function exportData() {
    try {
        // Load all posts from API
        const response = await fetch(`${API_URL}/posts?status=all`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to load posts');

        const data = await response.json();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        // Export complete backup
        const completeBackup = {
            timestamp: new Date().toISOString(),
            posts: data.posts
        };

        downloadFile(`blog-backup-${timestamp}.json`, JSON.stringify(completeBackup, null, 2), 'application/json');
        showAlert('Backup exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showAlert('Error exporting data: ' + error.message, 'error');
    }
}

// Helper function to download files
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import data from backup (disabled - not needed with backend)
function importData() {
    showAlert('Import functionality disabled. All data is stored in the database. Use Export for backups.', 'info');
}

// Restore from backup (disabled - not needed with backend)
function restoreFromBackup() {
    showAlert('Auto-backup not needed. All data is safely stored in the database and can be exported anytime.', 'info');
}

// ======================================
// SOCIAL MEDIA PUBLISHING FUNCTIONS
// ======================================

let currentPublishingPostId = null;

// Open social publishing inline (beneath the post row)
async function openSocialPublishModal(postId) {
    // If clicking the same post, close it (toggle)
    const existingRow = document.getElementById('social-publish-row');
    if (existingRow && currentPublishingPostId === postId) {
        closeSocialModal();
        return;
    }

    // Remove any existing expanded row
    if (existingRow) {
        existingRow.remove();
    }

    currentPublishingPostId = postId;

    // Fetch post details
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            showAlert('Failed to load post details', 'error');
            return;
        }

        const data = await response.json();
        const post = data.post;

        // Find the post row in the table
        const tbody = document.getElementById('posts-table-body');
        const rows = tbody.querySelectorAll('tr');
        let targetRow = null;

        // Find the row containing this post's ID
        rows.forEach(row => {
            if (row.innerHTML.includes(`'${postId}'`)) {
                targetRow = row;
            }
        });

        if (!targetRow) {
            showAlert('Could not find post row', 'error');
            return;
        }

        // Create the expandable row
        const expandableRow = document.createElement('tr');
        expandableRow.id = 'social-publish-row';
        expandableRow.innerHTML = `
            <td colspan="6" style="padding: 0; background: #f8f9fa; border-top: 2px solid #667eea;">
                <div style="padding: 1.5rem; animation: slideDown 0.3s ease-out;">
                    <div style="background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 2px solid #e9ecef;">
                            <div>
                                <h3 style="margin: 0; color: #333; font-size: 1.2rem;">Publish to Social Media</h3>
                                <p style="margin: 0.5rem 0 0 0; color: #6c757d; font-size: 0.9rem;">${post.title}</p>
                            </div>
                            <button onclick="closeSocialModal()" style="background: none; border: none; font-size: 1.5rem; color: #6c757d; cursor: pointer; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;" onmouseover="this.style.color='#333'" onmouseout="this.style.color='#6c757d'">&times;</button>
                        </div>

                        <p style="margin-bottom: 1.5rem; color: #6c757d; font-size: 0.9rem;">
                            Select the platforms you want to publish this post to. AI will automatically optimize the content for each platform.
                        </p>

                        <div style="margin-bottom: 1.5rem;">
                            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="twitter" checked style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-twitter" style="color: #1DA1F2; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">Twitter/X</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(280 characters)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="facebook" checked style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-facebook" style="color: #4267B2; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">Facebook</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(150-250 words)</span>
                                </label>
                                <label id="instagram-label-inline" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="instagram" ${post.image ? 'checked' : 'disabled'} style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-instagram" style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">Instagram</span>
                                    <span style="font-size: 0.85rem; color: ${post.image ? '#6c757d' : '#dc3545'};">${post.image ? '(Requires image)' : '(No image - disabled)'}</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="linkedin" checked style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-linkedin" style="color: #0A66C2; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">LinkedIn</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(200-300 words)</span>
                                </label>
                            </div>
                        </div>

                        <div id="socialPreviewInline" style="margin-top: 1.5rem; display: none;">
                            <h4 style="margin-bottom: 1rem; font-size: 1rem; color: #333;">Content Preview:</h4>
                            <div id="socialPreviewContentInline"></div>
                        </div>

                        <div id="socialResultsInline" style="margin-top: 1.5rem; display: none;">
                            <h4 style="margin-bottom: 1rem; font-size: 1rem; color: #333;">Publishing Results:</h4>
                            <div id="socialResultsContentInline"></div>
                        </div>

                        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea;">
                            <p style="margin: 0; font-size: 0.85rem; color: #495057;">
                                <strong>Note:</strong> Content will be automatically optimized for each platform using AI. Make sure your API credentials are configured in the backend.
                            </p>
                        </div>

                        <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
                            <button onclick="closeSocialModal()" style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#5a6268'" onmouseout="this.style.background='#6c757d'">Cancel</button>
                            <button onclick="previewSocialContent()" id="previewSocialBtn" style="padding: 0.75rem 1.5rem; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s;" onmouseover="this.style.background='#138496'" onmouseout="this.style.background='#17a2b8'">
                                <i class="fas fa-eye"></i> Preview Content
                            </button>
                            <button onclick="publishToSocialInline()" id="publishSocialBtnInline" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102,126,234,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <i class="fas fa-share-alt"></i> Publish Now
                            </button>
                        </div>
                    </div>
                </div>
            </td>
        `;

        // Insert after the target row
        targetRow.insertAdjacentElement('afterend', expandableRow);

        // Scroll to the expanded row smoothly
        setTimeout(() => {
            expandableRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);

    } catch (error) {
        console.error('Failed to fetch post details:', error);
        showAlert('Failed to load post details', 'error');
    }
}

// Close social publishing inline row
function closeSocialModal() {
    const expandableRow = document.getElementById('social-publish-row');
    if (expandableRow) {
        expandableRow.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            expandableRow.remove();
        }, 300);
    }
    currentPublishingPostId = null;
}

// Preview AI-generated social media content
async function previewSocialContent() {
    // Get the button first to check if already in progress
    const expandableRow = document.getElementById('social-publish-row');
    if (!expandableRow) {
        showAlert('No publishing interface found', 'error');
        return;
    }

    const previewBtn = expandableRow.querySelector('#previewSocialBtn');

    // Use button's disabled state as the lock - check and set atomically
    if (previewBtn.disabled) {
        console.log('Preview already in progress, ignoring click');
        return;
    }

    // Disable IMMEDIATELY to prevent race conditions
    previewBtn.disabled = true;
    previewBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    try {
        // Get selected platforms from within the current expandable row only
        const selectedPlatforms = Array.from(expandableRow.querySelectorAll('.platform-check:checked'))
            .map(cb => cb.value);

        // Remove duplicates (in case of any issues)
        const uniquePlatforms = [...new Set(selectedPlatforms)];

        console.log('Selected platforms:', selectedPlatforms);
        console.log('Unique platforms:', uniquePlatforms);
        console.log('Checkboxes found:', expandableRow.querySelectorAll('.platform-check').length);

        if (uniquePlatforms.length === 0) {
            showAlert('Please select at least one platform to preview', 'error');
            previewBtn.disabled = false;
            previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview Content';
            return;
        }

        if (!currentPublishingPostId) {
            showAlert('No post selected', 'error');
            previewBtn.disabled = false;
            previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview Content';
            return;
        }

        const previewSection = expandableRow.querySelector('#socialPreviewInline');
        const previewContent = expandableRow.querySelector('#socialPreviewContentInline');
        const resultsSection = expandableRow.querySelector('#socialResultsInline');

        // Clear any existing preview content
        previewContent.innerHTML = '';

        // Show preview section with loading state
        previewSection.style.display = 'block';
        previewContent.innerHTML = '<p style="color: #6c757d;"><i class="fas fa-spinner fa-spin"></i> Generating AI content for ' + uniquePlatforms.join(', ') + '...</p>';

        // Hide results section
        resultsSection.style.display = 'none';
        const response = await fetch(`${API_URL}/social/preview/${currentPublishingPostId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                platforms: uniquePlatforms
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Fetch post details to show image and link
            const postResponse = await fetch(`${API_URL}/posts/${currentPublishingPostId}`, {
                credentials: 'include'
            });
            const postData = await postResponse.json();
            const post = postData.post;

            // Display previews
            let previewHTML = '';

            // Show post image and link at the top
            if (post.image || post.slug) {
                previewHTML += `
                    <div style="margin-bottom: 1.5rem; padding: 1rem; background: #fff3cd; border-radius: 8px; border: 2px solid #ffc107; border-left: 4px solid #ffc107;">
                        <h4 style="margin: 0 0 0.5rem 0; color: #856404; font-size: 0.95rem;"><i class="fas fa-info-circle"></i> What Will Be Published:</h4>
                        <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: #856404;">
                            When you click "Publish Now", AI will generate <strong>fresh content</strong> for each platform (similar but may vary slightly from this preview). The content will be posted to your social media accounts.
                        </p>
                        ${post.image ? `
                            <div style="margin-bottom: 0.75rem;">
                                <strong style="font-size: 0.9rem; color: #856404;">Image that will be shared:</strong>
                                <div style="margin-top: 0.5rem;">
                                    <img src="${post.image}" alt="Post image" style="max-width: 100%; max-height: 200px; border-radius: 4px; border: 1px solid #dee2e6;">
                                </div>
                            </div>
                        ` : ''}
                        <div>
                            <strong style="font-size: 0.9rem; color: #856404;">Blog URL in posts:</strong>
                            <div style="margin-top: 0.5rem;">
                                <a href="https://eytan.com/blog/${post.slug}.html" target="_blank" style="color: #667eea; font-size: 0.9rem; word-break: break-all;">
                                    https://eytan.com/blog/${post.slug}.html
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }

            data.previews.forEach(preview => {
                if (preview.status === 'success') {
                    // Platform-specific styling
                    const platformStyles = {
                        twitter: {
                            icon: 'fab fa-twitter',
                            color: '#1DA1F2',
                            bg: '#e7f5fe'
                        },
                        facebook: {
                            icon: 'fab fa-facebook',
                            color: '#4267B2',
                            bg: '#e8f0fe'
                        },
                        instagram: {
                            icon: 'fab fa-instagram',
                            color: '#E1306C',
                            bg: '#fce8f3'
                        },
                        linkedin: {
                            icon: 'fab fa-linkedin',
                            color: '#0A66C2',
                            bg: '#e8f4fc'
                        }
                    };

                    const style = platformStyles[preview.platform];

                    previewHTML += `
                        <div style="margin-bottom: 1rem; border: 2px solid ${style.color}; border-radius: 8px; overflow: hidden; background: white;">
                            <div style="background: ${style.bg}; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 2px solid ${style.color};">
                                <i class="${style.icon}" style="color: ${style.color}; font-size: 1.2rem;"></i>
                                <strong style="text-transform: capitalize; color: #333;">${preview.platform}</strong>
                                <span style="margin-left: auto; font-size: 0.85rem; color: #6c757d;">${preview.characterCount} characters</span>
                            </div>
                            <div style="padding: 1rem; white-space: pre-wrap; line-height: 1.6; color: #333; font-size: 0.95rem; max-height: 300px; overflow-y: auto;">
                                ${preview.content}
                            </div>
                        </div>
                    `;
                } else {
                    previewHTML += `
                        <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin-bottom: 0.5rem;">
                            <strong style="text-transform: capitalize;">${preview.platform}</strong>: ${preview.error}
                        </div>
                    `;
                }
            });

            previewContent.innerHTML = previewHTML;
            showAlert('Preview generated successfully!', 'success');

        } else {
            previewContent.innerHTML = `
                <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                    <p style="margin: 0; color: #721c24;"><i class="fas fa-exclamation-triangle"></i> ${data.error || data.message || 'Preview generation failed'}</p>
                </div>
            `;
            showAlert(data.error || 'Preview generation failed', 'error');
        }

        // Re-enable button
        previewBtn.disabled = false;
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview Content';

    } catch (error) {
        console.error('Preview error:', error);

        const previewContent = expandableRow.querySelector('#socialPreviewContentInline');

        if (previewContent) {
            previewContent.innerHTML = `
                <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                    <p style="margin: 0; color: #721c24;"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</p>
                </div>
            `;
        }

        showAlert('Preview error: ' + error.message, 'error');

        // Re-enable button
        previewBtn.disabled = false;
        previewBtn.innerHTML = '<i class="fas fa-eye"></i> Preview Content';
    }
}

// Publish to social media from inline interface
async function publishToSocialInline() {
    const selectedPlatforms = Array.from(document.querySelectorAll('.platform-check:checked'))
        .map(cb => cb.value);

    if (selectedPlatforms.length === 0) {
        showAlert('Please select at least one platform', 'error');
        return;
    }

    if (!currentPublishingPostId) {
        showAlert('No post selected for publishing', 'error');
        return;
    }

    // Disable publish button
    const publishBtn = document.getElementById('publishSocialBtnInline');
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

    // Show results section
    document.getElementById('socialResultsInline').style.display = 'block';
    document.getElementById('socialResultsContentInline').innerHTML = '<p style="color: #6c757d;"><i class="fas fa-spinner fa-spin"></i> Publishing to ' + selectedPlatforms.join(', ') + '...</p>';

    try {
        const response = await fetch(`${API_URL}/social/publish/${currentPublishingPostId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                platforms: selectedPlatforms
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Display results
            let resultsHTML = '';

            data.results.forEach(result => {
                if (result.status === 'success') {
                    resultsHTML += `
                        <div style="padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #28a745;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #155724;">- Published successfully!</span>
                            </div>
                            ${result.url ? `<a href="${result.url}" target="_blank" style="color: #0066cc; font-size: 0.9rem;">View post <i class="fas fa-external-link-alt" style="font-size: 0.7rem;"></i></a>` : ''}
                        </div>
                    `;
                } else if (result.status === 'manual') {
                    const contentId = 'manual-content-' + result.platform;
                    resultsHTML += `
                        <div style="padding: 1rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                                <i class="fas fa-copy" style="color: #856404;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #856404;">- Ready for manual posting</span>
                            </div>
                            <div style="background: white; padding: 0.75rem; border-radius: 4px; margin-bottom: 0.75rem; font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap; border: 1px solid #dee2e6;">
                                <div id="${contentId}" style="color: #495057;">${result.content}</div>
                            </div>
                            <button onclick="copyToClipboard('${contentId}', '${result.platform}')"
                                    style="background: #ffc107; color: #000; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
                                <i class="fas fa-copy"></i> Copy to Clipboard
                            </button>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #856404;">
                                <i class="fas fa-info-circle"></i> Paste this into Twitter/X manually to avoid $100/month API cost
                            </p>
                        </div>
                    `;
                } else {
                    resultsHTML += `
                        <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-times-circle" style="color: #dc3545;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #721c24;">- Failed</span>
                            </div>
                            <p style="margin: 0; color: #721c24; font-size: 0.9rem;">${result.error}</p>
                        </div>
                    `;
                }
            });

            document.getElementById('socialResultsContentInline').innerHTML = resultsHTML;
            showAlert(data.message, 'success');

            // Reload social status for this post
            setTimeout(() => {
                loadSocialStatus(currentPublishingPostId).then(statusHTML => {
                    const statusDiv = document.getElementById(`social-status-${currentPublishingPostId}`);
                    if (statusDiv) {
                        statusDiv.innerHTML = statusHTML;
                    }
                });
            }, 1000);

        } else {
            document.getElementById('socialResultsContentInline').innerHTML = `
                <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                    <p style="margin: 0; color: #721c24;"><i class="fas fa-exclamation-triangle"></i> ${data.message || 'Publishing failed'}</p>
                </div>
            `;
            showAlert(data.message || 'Publishing failed', 'error');
        }

        // Re-enable button
        publishBtn.disabled = false;
        publishBtn.innerHTML = '<i class="fas fa-share-alt"></i> Publish Now';

    } catch (error) {
        console.error('Publishing error:', error);
        document.getElementById('socialResultsContentInline').innerHTML = `
            <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                <p style="margin: 0; color: #721c24;"><i class="fas fa-exclamation-triangle"></i> Error: ${error.message}</p>
            </div>
        `;
        showAlert('Publishing error: ' + error.message, 'error');

        // Re-enable button
        publishBtn.disabled = false;
        publishBtn.innerHTML = '<i class="fas fa-share-alt"></i> Publish Now';
    }
}

// Publish to selected social media platforms (legacy modal version - kept for compatibility)
async function publishToSocial() {
    const selectedPlatforms = Array.from(document.querySelectorAll('.platform-check:checked'))
        .map(cb => cb.value);

    if (selectedPlatforms.length === 0) {
        showAlert('Please select at least one platform', 'error');
        return;
    }

    if (!currentPublishingPostId) {
        showAlert('No post selected for publishing', 'error');
        return;
    }

    // Disable publish button
    const publishBtn = document.getElementById('publishSocialBtn');
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

    // Show results section
    document.getElementById('socialResults').style.display = 'block';
    document.getElementById('socialResultsContent').innerHTML = '<p style="color: #6c757d;"><i class="fas fa-spinner fa-spin"></i> Publishing to ' + selectedPlatforms.join(', ') + '...</p>';

    try {
        const response = await fetch(`${API_URL}/social/publish/${currentPublishingPostId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                platforms: selectedPlatforms
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Display results
            let resultsHTML = '';

            data.results.forEach(result => {
                if (result.status === 'success') {
                    resultsHTML += `
                        <div style="padding: 1rem; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #28a745;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #155724;">- Published successfully!</span>
                            </div>
                            ${result.url ? `<a href="${result.url}" target="_blank" style="color: #0066cc; font-size: 0.9rem;">View post <i class="fas fa-external-link-alt" style="font-size: 0.7rem;"></i></a>` : ''}
                        </div>
                    `;
                } else if (result.status === 'manual') {
                    // Manual posting (Twitter) - show content with copy button
                    const contentId = 'manual-content-' + result.platform;
                    resultsHTML += `
                        <div style="padding: 1rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                                <i class="fas fa-copy" style="color: #856404;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #856404;">- Ready for manual posting</span>
                            </div>
                            <div style="background: white; padding: 0.75rem; border-radius: 4px; margin-bottom: 0.75rem; font-size: 0.9rem; line-height: 1.5; white-space: pre-wrap; border: 1px solid #dee2e6;">
                                <div id="${contentId}" style="color: #495057;">${result.content}</div>
                            </div>
                            <button onclick="copyToClipboard('${contentId}', '${result.platform}')"
                                    style="background: #ffc107; color: #000; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 500;">
                                <i class="fas fa-copy"></i> Copy to Clipboard
                            </button>
                            <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #856404;">
                                <i class="fas fa-info-circle"></i> Paste this into Twitter/X manually to avoid $100/month API cost
                            </p>
                        </div>
                    `;
                } else {
                    resultsHTML += `
                        <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                                <strong style="text-transform: capitalize;">${result.platform}</strong>
                                <span style="color: #721c24;">- Failed</span>
                            </div>
                            <p style="margin: 0; font-size: 0.9rem; color: #721c24;">${result.error}</p>
                        </div>
                    `;
                }
            });

            document.getElementById('socialResultsContent').innerHTML = resultsHTML;

            // Update table to show social media status
            loadBlogData();

            showAlert(`Published to ${data.summary.succeeded} platform(s). ${data.summary.failed} failed.`, data.summary.failed === 0 ? 'success' : 'info');
        } else {
            throw new Error(data.message || 'Publishing failed');
        }

    } catch (error) {
        console.error('Publishing error:', error);
        document.getElementById('socialResultsContent').innerHTML = `
            <div style="padding: 1rem; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                <i class="fas fa-exclamation-circle" style="color: #dc3545;"></i>
                <strong>Error:</strong> ${error.message}
            </div>
        `;
        showAlert('Publishing failed: ' + error.message, 'error');
    } finally {
        // Re-enable button
        publishBtn.disabled = false;
        publishBtn.innerHTML = '<i class="fas fa-share-alt"></i> Publish Now';
    }
}

// Load social media status for a post
async function loadSocialStatus(postId) {
    try {
        const response = await fetch(`${API_URL}/social/status/${postId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            return '';
        }

        const data = await response.json();
        let statusHTML = '<div style="display: flex; gap: 0.25rem; margin-top: 0.25rem;">';

        // Twitter
        if (data.status.twitter && data.status.twitter.status === 'published') {
            statusHTML += `<a href="${data.status.twitter.platform_url}" target="_blank" title="Posted on Twitter/X"><i class="fab fa-twitter" style="color: #1DA1F2;"></i></a>`;
        } else if (data.status.twitter && data.status.twitter.status === 'failed') {
            statusHTML += `<i class="fab fa-twitter" style="color: #dc3545;" title="Twitter publish failed"></i>`;
        }

        // Facebook
        if (data.status.facebook && data.status.facebook.status === 'published') {
            statusHTML += `<a href="${data.status.facebook.platform_url}" target="_blank" title="Posted on Facebook"><i class="fab fa-facebook" style="color: #4267B2;"></i></a>`;
        } else if (data.status.facebook && data.status.facebook.status === 'failed') {
            statusHTML += `<i class="fab fa-facebook" style="color: #dc3545;" title="Facebook publish failed"></i>`;
        }

        // Instagram
        if (data.status.instagram && data.status.instagram.status === 'published') {
            statusHTML += `<a href="${data.status.instagram.platform_url}" target="_blank" title="Posted on Instagram"><i class="fab fa-instagram" style="color: #E1306C;"></i></a>`;
        } else if (data.status.instagram && data.status.instagram.status === 'failed') {
            statusHTML += `<i class="fab fa-instagram" style="color: #dc3545;" title="Instagram publish failed"></i>`;
        }

        // LinkedIn
        if (data.status.linkedin && data.status.linkedin.status === 'published') {
            statusHTML += `<a href="${data.status.linkedin.platform_url}" target="_blank" title="Posted on LinkedIn"><i class="fab fa-linkedin" style="color: #0A66C2;"></i></a>`;
        } else if (data.status.linkedin && data.status.linkedin.status === 'failed') {
            statusHTML += `<i class="fab fa-linkedin" style="color: #dc3545;" title="LinkedIn publish failed"></i>`;
        }

        statusHTML += '</div>';

        return statusHTML;

    } catch (error) {
        console.error('Failed to load social status:', error);
        return '';
    }
}

// Copy to clipboard function
function copyToClipboard(elementId, platform) {
    const element = document.getElementById(elementId);
    const text = element.textContent;

    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showAlert(`${platform} content copied to clipboard! Paste it manually.`, 'success');
                // Visual feedback
                const button = event.target.closest('button');
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = '#28a745';
                button.style.color = 'white';
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = '#ffc107';
                    button.style.color = '#000';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy:', err);
                showAlert('Failed to copy. Please select and copy manually.', 'error');
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showAlert(`${platform} content copied to clipboard! Paste it manually.`, 'success');
        } catch (err) {
            showAlert('Failed to copy. Please select and copy manually.', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Logout function
async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
        // Clear localStorage
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTime');

        // Call backend logout
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            showAlert('Logged out successfully. Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Even if backend logout fails, we cleared localStorage
        showAlert('Logged out locally. Redirecting...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    }
}

// Initialize on page load
// Since admin.js is loaded dynamically after authentication,
// DOMContentLoaded may have already fired, so check document state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBlogData);
} else {
    // DOM is already loaded, call immediately
    loadBlogData();
}
