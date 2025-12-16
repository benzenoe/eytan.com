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
    tbody.innerHTML = sortedPosts.map(post => `
        <tr>
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
                    <button class="btn-icon btn-publish" onclick="publishPost('${post.id}')" title="${post.status === 'published' ? 'Republish (sync to GitHub)' : 'Publish to Live Site'}">
                        <i class="fas fa-upload"></i> ${post.status === 'published' ? 'Republish' : 'Publish'}
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
    `).join('');

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

// Open social publishing modal
async function openSocialPublishModal(postId) {
    currentPublishingPostId = postId;

    // Reset modal state
    document.querySelectorAll('.platform-check').forEach(cb => cb.checked = true);
    document.getElementById('socialResults').style.display = 'none';
    document.getElementById('socialResultsContent').innerHTML = '';
    document.getElementById('publishSocialBtn').disabled = false;

    // Check if post has image (for Instagram)
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const post = data.post; // API returns { success: true, post: {...} }
            const instagramCheckbox = document.querySelector('.platform-check[value="instagram"]');
            const instagramLabel = document.getElementById('instagram-label');

            // Display post title in modal header
            document.getElementById('socialPostTitle').textContent = post.title;

            if (!post.image) {
                instagramCheckbox.checked = false;
                instagramCheckbox.disabled = true;
                instagramLabel.style.opacity = '0.5';
                instagramLabel.title = 'This post has no image. Instagram requires an image.';
            } else {
                instagramCheckbox.disabled = false;
                instagramLabel.style.opacity = '1';
                instagramLabel.title = '';
            }
        }
    } catch (error) {
        console.error('Failed to fetch post details:', error);
    }

    // Show modal
    document.getElementById('socialPublishModal').style.display = 'flex';
}

// Close social publishing modal
function closeSocialModal() {
    document.getElementById('socialPublishModal').style.display = 'none';
    document.getElementById('socialPostTitle').textContent = ''; // Clear post title
    currentPublishingPostId = null;
}

// Publish to selected social media platforms
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
