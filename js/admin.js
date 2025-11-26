// Blog Admin functionality

let blogPosts = [];
let blogContent = {};
let currentEditId = null;

// Load blog data from localStorage or JSON file
async function loadBlogData() {
    try {
        // First, try to load from localStorage (for local edits)
        const localData = localStorage.getItem('blogPosts');
        const localContent = localStorage.getItem('blogContent');

        if (localData) {
            blogPosts = JSON.parse(localData);
            blogContent = localContent ? JSON.parse(localContent) : {};
            renderPostsTable();
            return;
        }

        // If no local data, load from JSON file
        const response = await fetch('data/blog-posts.json');
        const data = await response.json();
        blogPosts = data.posts || [];

        // Load existing markdown content for each post
        for (const post of blogPosts) {
            try {
                const contentResponse = await fetch(`blog/${post.id}.md`);
                if (contentResponse.ok) {
                    blogContent[post.id] = await contentResponse.text();
                }
            } catch (error) {
                console.log(`No content file for ${post.id}`);
            }
        }

        // Save to localStorage
        saveToLocalStorage();
        renderPostsTable();
    } catch (error) {
        console.error('Error loading blog data:', error);
        showAlert('Error loading blog data', 'error');
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        const postsData = JSON.stringify(blogPosts);
        const contentData = JSON.stringify(blogContent);

        // Check localStorage quota
        const estimatedSize = postsData.length + contentData.length;
        console.log('Saving data to localStorage, estimated size:', Math.round(estimatedSize / 1024), 'KB');

        localStorage.setItem('blogPosts', postsData);
        localStorage.setItem('blogContent', contentData);

        console.log('Data saved successfully');
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            showAlert('Storage quota exceeded! Images are too large. Try using smaller images or image URLs instead of uploads.', 'error');
            console.error('localStorage quota exceeded');
        } else {
            showAlert('Error saving data: ' + error.message, 'error');
            console.error('Error saving to localStorage:', error);
        }
        throw error;
    }
}

// Render posts table
function renderPostsTable() {
    const tbody = document.getElementById('posts-table-body');

    if (!tbody) return;

    if (blogPosts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">
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
            <td><strong>${post.title}</strong></td>
            <td>${formatDate(post.date)}</td>
            <td>${post.excerpt.substring(0, 80)}${post.excerpt.length > 80 ? '...' : ''}</td>
            <td>
                <div class="action-buttons">
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
}

// Edit post
function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    currentEditId = postId;
    document.getElementById('modal-title').textContent = 'Edit Post';
    document.getElementById('post-id').value = post.id;
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-date').value = post.date;
    document.getElementById('post-author').value = post.author || 'Eytan Benzeno';
    document.getElementById('post-icon').value = post.icon || '';
    document.getElementById('post-image-url').value = post.image || '';
    document.getElementById('post-excerpt').value = post.excerpt;
    document.getElementById('post-content').value = blogContent[postId] || '';

    // Show image preview if exists
    if (post.image) {
        document.getElementById('preview-img').src = post.image;
        document.getElementById('image-preview').classList.add('show');
    } else {
        document.getElementById('image-preview').classList.remove('show');
    }

    document.getElementById('post-modal').classList.add('active');
}

// Delete post
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    blogPosts = blogPosts.filter(p => p.id !== postId);
    delete blogContent[postId];

    saveToLocalStorage();
    renderPostsTable();
    showAlert('Post deleted successfully!', 'success');
}

// Close modal
function closeModal() {
    document.getElementById('post-modal').classList.remove('active');
    currentEditId = null;
}

// Handle form submission
document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const postId = document.getElementById('post-id').value.trim();
    const title = document.getElementById('post-title').value.trim();
    const date = document.getElementById('post-date').value;
    const author = document.getElementById('post-author').value.trim();
    const icon = document.getElementById('post-icon').value.trim();
    const imageUrl = document.getElementById('post-image-url').value.trim();
    const excerpt = document.getElementById('post-excerpt').value.trim();
    const content = document.getElementById('post-content').value.trim();

    // Validate post ID (URL-friendly)
    if (!/^[a-z0-9-]+$/.test(postId)) {
        showAlert('Post ID must be lowercase letters, numbers, and hyphens only', 'error');
        return;
    }

    // Check for duplicate ID (only if creating new or changing ID)
    if (currentEditId !== postId && blogPosts.some(p => p.id === postId)) {
        showAlert('A post with this ID already exists', 'error');
        return;
    }

    const postData = {
        id: postId,
        title: title,
        date: date,
        author: author,
        icon: icon || '📝',
        image: imageUrl || '',
        excerpt: excerpt
    };

    if (currentEditId && currentEditId !== postId) {
        // ID changed, remove old post
        blogPosts = blogPosts.filter(p => p.id !== currentEditId);
        delete blogContent[currentEditId];
    } else if (currentEditId) {
        // Update existing post
        const index = blogPosts.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
            blogPosts[index] = postData;
        }
    } else {
        // Add new post
        blogPosts.push(postData);
    }

    // Save content
    blogContent[postId] = content;

    // Save to localStorage
    try {
        saveToLocalStorage();

        // Log the saved post for debugging
        console.log('Post saved:', postData);
        console.log('Image size:', postData.image ? Math.round(postData.image.length / 1024) + 'KB' : 'No image');

        // Update UI
        renderPostsTable();
        closeModal();

        showAlert(currentEditId ? 'Post updated successfully!' : 'Post created successfully!', 'success');
    } catch (error) {
        // Don't close modal if save failed
        console.error('Failed to save post:', error);
    }
});

// Export data as JSON
function exportData() {
    const data = {
        posts: blogPosts,
        content: blogContent
    };

    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blog-data-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showAlert('Data exported successfully! Remember to update the files in your repository.', 'success');
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
document.getElementById('post-image-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showAlert('Image must be less than 2MB for upload. For larger images, please use an image URL instead.', 'error');
        this.value = '';
        return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const base64 = event.target.result;
        console.log('Image loaded, size:', Math.round(base64.length / 1024), 'KB');
        document.getElementById('post-image-url').value = base64;
        document.getElementById('preview-img').src = base64;
        document.getElementById('image-preview').classList.add('show');
        showAlert('Image loaded successfully! Remember to save your post.', 'success');
    };
    reader.onerror = function(error) {
        showAlert('Error reading file: ' + error, 'error');
        console.error('FileReader error:', error);
    };
    reader.readAsDataURL(file);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', loadBlogData);
