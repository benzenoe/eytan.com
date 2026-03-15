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
        const postNeedsRepublish = needsRepublish(post);

        return `
        <tr${postNeedsRepublish ? ' style="background: #fff3cd;"' : ''}>
            <td class="hide-mobile" style="font-size: 1.5rem;">${post.icon || '📝'}</td>
            <td class="hide-mobile">
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
                ${postNeedsRepublish ? `
                    <br>
                    <span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                        ⚠️ NEEDS REPUBLISH
                    </span>
                ` : ''}
                <div id="social-status-${post.id}" style="margin-top: 0.5rem;"></div>
            </td>
            <td>
                <div style="font-size: 0.9rem;">${formatDate(post.date)}</div>
                <div style="font-size: 0.75rem; color: #6c757d; margin-top: 4px;">
                    <div title="Last edited">✏️ ${formatDateTime(post.updated_at)}</div>
                    ${post.status === 'published' ? `<div title="Last published">🚀 ${formatDateTime(post.published_at)}</div>` : ''}
                </div>
            </td>
            <td class="hide-mobile">${post.excerpt.substring(0, 60)}${post.excerpt.length > 60 ? '...' : ''}</td>
            <td>
                <div class="action-buttons">
                    ${post.status === 'published'
                        ? `<a href="https://eytan.com/blog/${post.slug || post.id}.html" target="_blank" class="btn-icon btn-view" title="View Live Post">
                            <i class="fas fa-external-link-alt"></i>
                        </a>`
                        : ''
                    }
                    <button class="btn-icon btn-publish${postNeedsRepublish ? ' btn-republish-needed' : ''}" onclick="publishPost('${post.id}')" title="${post.status === 'published' ? 'Republish (sync to GitHub)' : 'Publish to Live Site'}" ${postNeedsRepublish ? 'style="background: #dc3545; animation: pulse 1.5s infinite;"' : ''}>
                        <i class="fas fa-upload"></i> ${postNeedsRepublish ? '⚠️ Republish!' : (post.status === 'published' ? 'Republish' : 'Publish')}
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

    // Update the republish all button
    updateRepublishAllButton();

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

// Format date with time
function formatDateTime(dateString) {
    if (!dateString) return 'Never';
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Check if post needs republishing
function needsRepublish(post) {
    return post.status === 'published' &&
        post.updated_at && post.published_at &&
        new Date(post.updated_at) > new Date(post.published_at);
}

// Update the republish all button visibility
function updateRepublishAllButton() {
    const outdatedPosts = blogPosts.filter(needsRepublish);
    const btn = document.getElementById('republishAllBtn');
    const countSpan = document.getElementById('outdatedCount');

    if (outdatedPosts.length > 0) {
        btn.style.display = 'inline-flex';
        countSpan.textContent = outdatedPosts.length;
    } else {
        btn.style.display = 'none';
    }
}

// Republish all outdated posts
async function republishAllOutdated() {
    const outdatedPosts = blogPosts.filter(needsRepublish);

    if (outdatedPosts.length === 0) {
        showAlert('No posts need republishing!', 'info');
        return;
    }

    if (!confirm(`Republish ${outdatedPosts.length} post(s) that have been edited since last publish?\n\nThis will update all static pages on the live site.`)) {
        return;
    }

    const btn = document.getElementById('republishAllBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Republishing...';

    let succeeded = 0;
    let failed = 0;

    for (const post of outdatedPosts) {
        try {
            const response = await fetch(`${API_URL}/posts/${post.id}/publish`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                succeeded++;
                showAlert(`Republished: ${post.title.substring(0, 30)}...`, 'success');
            } else {
                failed++;
                console.error(`Failed to republish ${post.id}`);
            }
        } catch (error) {
            failed++;
            console.error(`Error republishing ${post.id}:`, error);
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-sync"></i> Republish All Outdated (<span id="outdatedCount">0</span>)';

    // Reload data to update the UI
    await loadBlogData();

    showAlert(`Republished ${succeeded} post(s). ${failed} failed. Changes live in 1-2 minutes.`, failed === 0 ? 'success' : 'warning');
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

// Load Facebook pages from backend and render checkboxes in the modal
async function loadFacebookPagesIntoModal() {
    const container = document.getElementById('fb-pages-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/social/facebook/pages`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.pages || data.pages.length === 0) {
            container.innerHTML = `<span style="color: #6c757d; font-size: 0.85rem;"><i class="fab fa-facebook" style="color: #4267B2;"></i> No Facebook pages found</span>`;
            return;
        }

        const labelStyle = `display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem 0.75rem; border-radius: 4px; transition: background 0.2s;`;
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #dee2e6;">
                <i class="fab fa-facebook" style="color: #4267B2; font-size: 1.1rem;"></i>
                <span style="font-weight: 600; font-size: 0.9rem; color: #333;">Facebook Pages</span>
                <span style="font-size: 0.8rem; color: #6c757d;">(auto-published)</span>
            </div>
            ${data.pages.map(page => `
                <label style="${labelStyle}" onmouseover="this.style.background='#f0f4ff'" onmouseout="this.style.background='transparent'">
                    <input type="checkbox" class="platform-check" value="facebook:${page.id}" style="width: 16px; height: 16px; cursor: pointer;">
                    <span style="font-size: 0.9rem; flex: 1;">${page.name}</span>
                    <span style="font-size: 0.75rem; color: #6c757d;">${page.category}</span>
                </label>
            `).join('')}
        `;
    } catch (error) {
        console.error('Failed to load Facebook pages:', error);
        container.innerHTML = `<span style="color: #dc3545; font-size: 0.85rem;"><i class="fab fa-facebook"></i> Failed to load pages</span>`;
    }
}

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
                                    <input type="checkbox" class="platform-check" value="twitter" style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-x-twitter" style="color: #000; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">X (Twitter)</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(Opens pre-filled compose)</span>
                                </label>
                                <div id="fb-pages-container" style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; background: #f8f9fa;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; color: #6c757d; font-size: 0.9rem;">
                                        <i class="fab fa-facebook" style="color: #4267B2; font-size: 1.1rem;"></i>
                                        <span>Loading Facebook pages...</span>
                                    </div>
                                </div>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="facebook-personal" style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-facebook" style="color: #1877F2; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">Facebook (Personal Profile)</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(Opens share dialog)</span>
                                </label>
                                <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; background: #f8f9fa;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #dee2e6;">
                                        <i class="fab fa-facebook-square" style="color: #1877F2; font-size: 1.1rem;"></i>
                                        <span style="font-weight: 600; font-size: 0.9rem; color: #333;">Facebook Groups</span>
                                        <span style="font-size: 0.8rem; color: #6c757d;">(copies caption + opens group)</span>
                                    </div>
                                    ${[
                                        { name: 'My name is Eytan', url: 'https://www.facebook.com/groups/208780250279' },
                                        { name: 'REIGNation', url: 'https://www.facebook.com/groups/reignation' },
                                        { name: 'ChatGPT and Real Estate Mastermind', url: 'https://www.facebook.com/groups/6064131423672561' },
                                        { name: 'New to Lisbon and the Surrounding Area', url: 'https://www.facebook.com/groups/1884805645306198' },
                                        { name: 'New to Surfside / Bal Harbour / Bay Harbor Islands', url: 'https://www.facebook.com/groups/871719803845126' },
                                        { name: 'Benzeno Group', url: 'https://www.facebook.com/groups/benzeno' }
                                    ].map(g => `
                                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.4rem 0.5rem; border-radius: 4px; transition: background 0.2s;" onmouseover="this.style.background='#e8f0fe'" onmouseout="this.style.background='transparent'">
                                            <input type="checkbox" class="platform-check" value="facebook-group:${g.url}" style="width: 15px; height: 15px; cursor: pointer;">
                                            <span style="font-size: 0.88rem; flex: 1;">${g.name}</span>
                                        </label>
                                    `).join('')}
                                </div>
                                <label id="instagram-label-inline" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="instagram" ${post.image ? '' : 'disabled'} style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-instagram" style="background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">Instagram</span>
                                    <span style="font-size: 0.85rem; color: ${post.image ? '#6c757d' : '#dc3545'};">${post.image ? '(Requires image)' : '(No image - disabled)'}</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#667eea'; this.style.background='#f8f9ff'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="linkedin" style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-linkedin" style="color: #0A66C2; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">LinkedIn</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(200-300 words)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; transition: all 0.2s; background: white;" onmouseover="this.style.borderColor='#25D366'; this.style.background='#f0fff4'" onmouseout="this.style.borderColor='#dee2e6'; this.style.background='white'">
                                    <input type="checkbox" class="platform-check" value="whatsapp" style="width: 18px; height: 18px; cursor: pointer;">
                                    <i class="fab fa-whatsapp" style="color: #25D366; font-size: 1.3rem;"></i>
                                    <span style="font-weight: 500; flex: 1;">WhatsApp</span>
                                    <span style="font-size: 0.85rem; color: #6c757d;">(AI caption + opens share)</span>
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

        // Load Facebook pages dynamically
        loadFacebookPagesIntoModal();

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

        // Remove duplicates and filter out client-side-only platforms
        const uniquePlatforms = [...new Set(
            selectedPlatforms.filter(p => p !== 'facebook-personal' && p !== 'twitter' && p !== 'whatsapp' && !p.startsWith('facebook-group:'))
        )];

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

    // Handle Twitter/X — generate AI tweet, open X compose window pre-filled
    if (selectedPlatforms.includes('twitter')) {
        const post = blogPosts.find(p => p.id === currentPublishingPostId);
        if (post && post.slug) {
            try {
                const previewResponse = await fetch(`${API_URL}/social/preview/${currentPublishingPostId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ platforms: ['twitter'] })
                });
                const previewData = await previewResponse.json();
                const twPreview = previewData.previews && previewData.previews.find(p => p.platform === 'twitter');

                if (twPreview && twPreview.content) {
                    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(twPreview.content)}`;
                    window.open(tweetUrl, 'x-share', 'width=600,height=420,resizable=yes');
                    showAlert('✅ X compose window opened with your tweet!', 'success');
                }
            } catch (e) {
                const postUrl = `https://eytan.com/blog/${post.slug}.html`;
                window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, 'x-share', 'width=600,height=420,resizable=yes');
            }
        }
    }

    // Collect all platforms that need an AI Facebook caption shown in a modal
    const needsFbCaption =
        selectedPlatforms.includes('facebook-personal') ||
        selectedPlatforms.includes('whatsapp') ||
        selectedPlatforms.some(p => p.startsWith('facebook-group:'));

    if (needsFbCaption) {
        const post = blogPosts.find(p => p.id === currentPublishingPostId);
        if (post && post.slug) {
            const postUrl = `https://eytan.com/blog/${post.slug}.html`;
            const groupPlatforms = selectedPlatforms.filter(p => p.startsWith('facebook-group:'));

            // Generate AI caption
            let caption = '';
            try {
                const previewResponse = await fetch(`${API_URL}/social/preview/${currentPublishingPostId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ platforms: ['facebook'] })
                });
                const previewData = await previewResponse.json();
                const fbPreview = previewData.previews && previewData.previews.find(p => p.platform === 'facebook');
                if (fbPreview && fbPreview.content) caption = fbPreview.content;
            } catch (e) { /* caption stays empty */ }

            // Build modal with the caption visible + action buttons
            const fbPersonalBtn = selectedPlatforms.includes('facebook-personal')
                ? `<button onclick="navigator.clipboard.writeText(document.getElementById('fb-caption-text').value); document.getElementById('fb-caption-text').select(); window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}','fb-share','width=620,height=540,resizable=yes'); fetch('${API_URL}/social/log-share',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({postId:'${currentPublishingPostId}',platform:'facebook',url:'${postUrl}'})}); this.textContent='✅ Opened!';" style="background:#1877F2;color:white;border:none;padding:0.6rem 1.2rem;border-radius:6px;cursor:pointer;font-weight:600;"><i class="fab fa-facebook"></i> Open Facebook Personal</button>`
                : '';

            const groupBtns = groupPlatforms.map((p, i) => {
                const url = p.replace('facebook-group:', '');
                const label = url.includes('reignation') ? 'REIGNation' :
                              url.includes('benzeno') ? 'Benzeno Group' :
                              url.includes('208780250279') ? 'My name is Eytan' :
                              url.includes('6064131423672561') ? 'ChatGPT & RE Mastermind' :
                              url.includes('1884805645306198') ? 'New to Lisbon' :
                              url.includes('871719803845126') ? 'New to Surfside' : `Group ${i+1}`;
                return `<button onclick="window.open('${url}','_blank'); fetch('${API_URL}/social/log-share',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'include',body:JSON.stringify({postId:'${currentPublishingPostId}',platform:'${p}',url:'${url}'})}); this.textContent='✅ Opened!';" style="background:#1877F2;color:white;border:none;padding:0.6rem 1.2rem;border-radius:6px;cursor:pointer;font-weight:600;"><i class="fab fa-facebook"></i> ${label}</button>`;
            }).join('');

            const waBtn = selectedPlatforms.includes('whatsapp')
                ? `<button onclick="const msg=document.getElementById('fb-caption-text').value+'\\n\\n${postUrl}'; navigator.clipboard.writeText(msg); window.open('https://api.whatsapp.com/send?text='+encodeURIComponent(msg),'_blank'); this.textContent='✅ Opened!';" style="background:#25D366;color:white;border:none;padding:0.6rem 1.2rem;border-radius:6px;cursor:pointer;font-weight:600;"><i class="fab fa-whatsapp"></i> Open WhatsApp</button>`
                : '';

            const modal = document.createElement('div');
            modal.id = 'fb-caption-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;';
            modal.innerHTML = `
                <div style="background:white;border-radius:12px;padding:2rem;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
                        <h3 style="margin:0;color:#1877F2;"><i class="fab fa-facebook"></i> AI-Generated Caption</h3>
                        <button onclick="document.getElementById('fb-caption-modal').remove();" style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6c757d;">✕</button>
                    </div>
                    <p style="font-size:0.85rem;color:#6c757d;margin-bottom:0.5rem;">Select all → Copy → Paste into the Facebook/WhatsApp dialog:</p>
                    <textarea id="fb-caption-text" style="width:100%;height:180px;padding:0.75rem;border:2px solid #1877F2;border-radius:8px;font-size:0.9rem;line-height:1.6;resize:vertical;box-sizing:border-box;">${caption}</textarea>
                    <div style="display:flex;gap:0.5rem;margin-top:0.75rem;">
                        <button onclick="document.getElementById('fb-caption-text').select(); document.execCommand('copy'); this.textContent='✅ Copied!'; setTimeout(()=>this.textContent='📋 Copy Caption',2000);" style="background:#667eea;color:white;border:none;padding:0.6rem 1.2rem;border-radius:6px;cursor:pointer;font-weight:600;">📋 Copy Caption</button>
                        <button id="fb-regenerate-btn" onclick="regenerateFbCaption('${currentPublishingPostId}')" style="background:#f8f9fa;color:#495057;border:2px solid #dee2e6;padding:0.6rem 1.2rem;border-radius:6px;cursor:pointer;font-weight:600;">🔄 Regenerate</button>
                    </div>
                    <hr style="margin:1rem 0;border-color:#dee2e6;">
                    <p style="font-size:0.85rem;color:#6c757d;margin-bottom:0.75rem;">Click to open each destination. Caption will be auto-copied when you click:</p>
                    <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                        ${fbPersonalBtn}${groupBtns}${waBtn}
                    </div>
                </div>`;
            document.body.appendChild(modal);
        }
    }

    // Filter out all client-side-only platforms before sending to API
    const apiPlatforms = selectedPlatforms.filter(p =>
        p !== 'facebook-personal' && p !== 'twitter' && p !== 'whatsapp' && !p.startsWith('facebook-group:')
    );
    if (apiPlatforms.length === 0) return;

    // Disable publish button
    const publishBtn = document.getElementById('publishSocialBtnInline');
    publishBtn.disabled = true;
    publishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';

    // Show results section
    document.getElementById('socialResultsInline').style.display = 'block';
    document.getElementById('socialResultsContentInline').innerHTML = '<p style="color: #6c757d;"><i class="fas fa-spinner fa-spin"></i> Publishing to ' + apiPlatforms.join(', ') + '...</p>';

    try {
        const response = await fetch(`${API_URL}/social/publish/${currentPublishingPostId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                platforms: apiPlatforms
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

        if (!response.ok) return '';

        const data = await response.json();
        const posts = data.socialPosts || [];
        if (posts.length === 0) return '';

        let statusHTML = '<div style="display: flex; gap: 0.3rem; margin-top: 0.3rem; flex-wrap: wrap; align-items: center;">';

        for (const sp of posts) {
            const failed = sp.status === 'failed';
            const border = failed ? '2px solid #dc3545' : '2px solid #28a745';
            const title = failed ? `${sp.platform} — FAILED` : `Posted: ${sp.platform}`;
            const link = sp.platform_url && !failed ? sp.platform_url : null;
            const iconStyle = `width:20px;height:20px;border-radius:4px;border:${border};object-fit:cover;vertical-align:middle;`;

            let iconHTML = '';

            if (sp.platform === 'twitter') {
                iconHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;border:${border};background:#000;font-size:11px;color:white;font-weight:bold;">𝕏</span>`;
            } else if (sp.platform === 'instagram') {
                iconHTML = `<i class="fab fa-instagram" style="font-size:18px;color:${failed ? '#dc3545' : '#E1306C'};"></i>`;
            } else if (sp.platform === 'linkedin') {
                iconHTML = `<i class="fab fa-linkedin" style="font-size:18px;color:${failed ? '#dc3545' : '#0A66C2'};"></i>`;
            } else if (sp.platform === 'facebook-personal') {
                iconHTML = `<img src="images/profile.jpg" style="${iconStyle}border-radius:50%;" title="${title}">`;
            } else if (sp.platform.startsWith('facebook:')) {
                const pageId = sp.platform.split(':')[1];
                iconHTML = `<img src="https://graph.facebook.com/${pageId}/picture?type=square" style="${iconStyle}" title="${title}" onerror="this.style.display='none'">`;
            } else if (sp.platform.startsWith('facebook-group:')) {
                const groupUrl = sp.platform.replace('facebook-group:', '');
                const label = groupUrl.includes('reignation') ? 'R' :
                              groupUrl.includes('benzeno') ? 'B' :
                              groupUrl.includes('208780250279') ? 'E' :
                              groupUrl.includes('6064131423672561') ? 'AI' :
                              groupUrl.includes('1884805645306198') ? 'L' :
                              groupUrl.includes('871719803845126') ? 'S' : 'G';
                iconHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;border:${border};background:#1877F2;font-size:10px;color:white;font-weight:bold;" title="${title}">${label}</span>`;
            } else {
                // Generic Facebook fallback
                iconHTML = `<i class="fab fa-facebook" style="font-size:18px;color:${failed ? '#dc3545' : '#1877F2'};"></i>`;
            }

            statusHTML += link
                ? `<a href="${link}" target="_blank" title="${title}">${iconHTML}</a>`
                : `<span title="${title}">${iconHTML}</span>`;
        }

        statusHTML += '</div>';
        return statusHTML;

    } catch (error) {
        console.error('Failed to load social status:', error);
        return '';
    }
}

// Regenerate AI caption in the Facebook caption modal
async function regenerateFbCaption(postId) {
    const btn = document.getElementById('fb-regenerate-btn');
    const textarea = document.getElementById('fb-caption-text');
    if (!btn || !textarea) return;

    btn.disabled = true;
    btn.innerHTML = '⏳ Regenerating...';

    try {
        const response = await fetch(`${API_URL}/social/preview/${postId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ platforms: ['facebook'] })
        });
        const data = await response.json();
        const fbPreview = data.previews && data.previews.find(p => p.platform === 'facebook');
        if (fbPreview && fbPreview.content) {
            textarea.value = fbPreview.content;
        } else {
            showAlert('Regeneration failed: ' + (data.error || 'Unknown error'), 'error');
        }
    } catch (e) {
        showAlert('Regeneration failed: ' + e.message, 'error');
    }

    btn.disabled = false;
    btn.innerHTML = '🔄 Regenerate';
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
