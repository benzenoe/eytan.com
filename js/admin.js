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
    currentEditId = null;
    document.getElementById('modal-title').textContent = 'New Post';
    document.getElementById('post-form').reset();
    document.getElementById('post-date').valueAsDate = new Date();
    document.getElementById('post-author').value = 'Eytan Benzeno';
    document.getElementById('image-preview').classList.remove('show');
    document.getElementById('post-modal').classList.add('active');

    // Reset slug field for auto-generation
    const slugField = document.getElementById('post-slug');
    if (slugField) {
        delete slugField.dataset.manuallyEdited;
        slugField.value = '';
        updateSlugPreview('');
    }
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

        currentEditId = postId;
        document.getElementById('modal-title').textContent = post.status === 'published' ? 'Edit Published Post' : 'Edit Draft Post';
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-id').disabled = true; // Can't change ID when editing
        document.getElementById('post-title').value = post.title;

        // Set slug field
        const slugField = document.getElementById('post-slug');
        if (slugField) {
            slugField.value = post.slug || generateSlug(post.title);
            slugField.dataset.manuallyEdited = 'true'; // Mark as manually set
            updateSlugPreview(slugField.value);
        }

        // Convert ISO date to YYYY-MM-DD format for date input
        const dateObj = new Date(post.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        document.getElementById('post-date').value = formattedDate;
        document.getElementById('post-author').value = post.author || 'Eytan Benzeno';
        document.getElementById('post-icon').value = post.icon || '';
        document.getElementById('post-image-url').value = post.image || '';
        document.getElementById('post-hashtags').value = post.hashtags || '';
        document.getElementById('post-excerpt').value = post.excerpt;
        document.getElementById('post-content').value = post.content || '';

        // Show image preview if exists
        if (post.image) {
            document.getElementById('preview-img').src = post.image;
            document.getElementById('image-preview').classList.add('show');
        } else {
            document.getElementById('image-preview').classList.remove('show');
        }

        // Reset submit button state
        const submitBtn = document.querySelector('#post-form button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Draft';
        }

        document.getElementById('post-modal').classList.add('active');
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

// Close modal
function closeModal() {
    document.getElementById('post-modal').classList.remove('active');
    document.getElementById('post-id').disabled = false;
    currentEditId = null;

    // Reset submit button state
    const submitBtn = document.querySelector('#post-form button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Draft';
    }
}

// Generate URL-friendly slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/-+/g, '-')       // Replace multiple hyphens with single hyphen
        .substring(0, 200);        // Limit length
}

// Update slug preview
function updateSlugPreview(slug) {
    const preview = document.getElementById('slug-preview');
    if (preview && slug) {
        preview.textContent = `https://eytan.com/blog/${slug}.html`;
    }
}

// Auto-generate slug from title
document.getElementById('post-title').addEventListener('input', function(e) {
    const slugField = document.getElementById('post-slug');
    // Only auto-generate if slug field is empty or hasn't been manually edited
    if (!slugField.dataset.manuallyEdited) {
        const slug = generateSlug(e.target.value);
        slugField.value = slug;
        updateSlugPreview(slug);
    }
});

// Track manual edits to slug
document.getElementById('post-slug').addEventListener('input', function(e) {
    this.dataset.manuallyEdited = 'true';
    updateSlugPreview(e.target.value);
});

// Handle form submission
document.getElementById('post-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const postId = document.getElementById('post-id').value.trim();
    const slug = document.getElementById('post-slug').value.trim();
    const title = document.getElementById('post-title').value.trim();
    const date = document.getElementById('post-date').value;
    const author = document.getElementById('post-author').value.trim();
    // Don't trim emoji - it can corrupt multi-codepoint emojis
    const icon = document.getElementById('post-icon').value;
    const imageUrl = document.getElementById('post-image-url').value.trim();
    const hashtags = document.getElementById('post-hashtags').value.trim();
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const content = document.getElementById('post-content').value.trim();

    // Validate post ID (URL-friendly)
    if (!/^[a-z0-9-]+$/.test(postId)) {
        showAlert('Post ID must be lowercase letters, numbers, and hyphens only', 'error');
        return;
    }

    // Validate slug (URL-friendly)
    if (slug && !/^[a-z0-9-]+$/.test(slug)) {
        showAlert('URL Slug must be lowercase letters, numbers, and hyphens only', 'error');
        return;
    }

    const postData = {
        id: postId,
        slug: slug || generateSlug(title), // Use slug or generate from title
        title: title,
        date: date,
        author: author,
        icon: icon || '📝',
        image: imageUrl || '',
        hashtags: hashtags || '',
        excerpt: excerpt,
        content: content
    };

    // Disable submit button
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = currentEditId ? 'Updating...' : 'Creating...';

    try {
        const url = currentEditId ? `${API_URL}/posts/${currentEditId}` : `${API_URL}/posts`;
        const method = currentEditId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save post');
        }

        const data = await response.json();
        console.log('Post saved:', data.post);

        // Reload data and update UI
        await loadBlogData();
        closeModal();

        showAlert(currentEditId ? 'Draft updated successfully!' : 'Draft created successfully!', 'success');
    } catch (error) {
        console.error('Failed to save post:', error);
        showAlert('Error saving post: ' + error.message, 'error');
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? 'Update Draft' : 'Save Draft';
    }
});

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

// Close modal when clicking outside
document.getElementById('post-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Handle image URL input
document.getElementById('post-image-url').addEventListener('input', function(e) {
    const url = e.target.value.trim();
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');

    if (url) {
        previewImg.src = url;
        preview.classList.add('show');
        // Clear file input
        document.getElementById('post-image-file').value = '';
    } else {
        preview.classList.remove('show');
    }
});

// Handle image file upload
document.getElementById('post-image-file').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Image must be less than 2MB. Please resize or compress the image.', 'error');
        this.value = '';
        return;
    }

    // Show uploading message
    showAlert('Uploading image to GitHub...', 'info');

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = async function(event) {
        const base64 = event.target.result;
        console.log('Image loaded, size:', Math.round(base64.length / 1024), 'KB');

        try {
            // Upload to GitHub via API
            const response = await fetch(`${API_URL}/upload/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    image: base64,
                    filename: file.name
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Upload failed');
            }

            const data = await response.json();
            console.log('Image uploaded:', data);

            // Use the full public URL for the input field (required for type="url" validation)
            // but store the relative URL in the database (it's set during form submission)
            document.getElementById('post-image-url').value = data.fullUrl;
            document.getElementById('preview-img').src = data.fullUrl;
            document.getElementById('image-preview').classList.add('show');
            showAlert(`Image uploaded successfully! (${data.size})`, 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showAlert('Failed to upload image: ' + error.message, 'error');
            document.getElementById('post-image-file').value = '';
        }
    };
    reader.onerror = function(error) {
        showAlert('Error reading file: ' + error, 'error');
        console.error('FileReader error:', error);
    };
    reader.readAsDataURL(file);
});

// Generate hashtags using AI
async function generateHashtags() {
    const title = document.getElementById('post-title').value.trim();
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const content = document.getElementById('post-content').value.trim();

    // Validate that we have at least some content
    if (!title && !excerpt && !content) {
        showAlert('Please add a title, excerpt, or content first!', 'error');
        return;
    }

    // Show loading state
    const hashtagsInput = document.getElementById('post-hashtags');
    const originalValue = hashtagsInput.value;
    hashtagsInput.value = 'Generating hashtags...';
    hashtagsInput.disabled = true;

    try {
        const response = await fetch(`${API_URL}/posts/generate-hashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                excerpt: excerpt,
                content: content
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate hashtags');
        }

        const data = await response.json();

        // Remove # symbols from the generated hashtags (the API returns them with #)
        const cleanedHashtags = data.hashtags.replace(/#/g, '').trim();
        hashtagsInput.value = cleanedHashtags;
        showAlert('Hashtags generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating hashtags:', error);
        showAlert('Error generating hashtags: ' + error.message, 'error');
        hashtagsInput.value = originalValue; // Restore original value on error
    } finally {
        hashtagsInput.disabled = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogData);
