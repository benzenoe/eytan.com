// Blog Admin functionality with Backend API

// API URL - authentication removed
const API_URL = 'https://api.eytan.com/api';

let blogPosts = [];
let currentEditId = null;

// Load blog data from API
async function loadBlogData() {
    try {
        const response = await fetch(`${API_URL}/posts?status=all`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to load posts: ${response.statusText}`);
        }

        const data = await response.json();
        blogPosts = data.posts || [];
        renderPostsTable();
    } catch (error) {
        console.error('Error loading blog data:', error);
        showAlert('Error loading blog data: ' + error.message, 'error');
    }
}

// Render posts table
function renderPostsTable() {
    const tbody = document.getElementById('posts-table-body');

    if (!tbody) return;

    if (blogPosts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No blog posts yet. Click "New Post" to create one!
                </td>
            </tr>
        `;
        return;
    }

    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedPosts.map(post => `
        <tr>
            <td style="font-size: 1.5rem;">${post.icon || '📝'}</td>
            <td>
                <strong>${post.title}</strong>
                <br>
                <span class="status-badge status-${post.status || 'draft'}">
                    ${post.status === 'published' ? '✓ Published' : '📝 Draft'}
                </span>
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

// Logout function
async function logout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }

    try {
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
        showAlert('Error logging out: ' + error.message, 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogData);
