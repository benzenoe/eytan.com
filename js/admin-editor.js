const API_URL = 'https://api.eytan.com/api';
let currentPost = null;
let autoSaveInterval = null;
let hasUnsavedChanges = false;

// Load post data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPostData();
    setupEventListeners();
    startAutoSave();
    setupBeforeUnload();
});

function loadPostData() {
    // Check if we're editing an existing post or creating new
    const postData = localStorage.getItem('editingPost');

    if (postData) {
        currentPost = JSON.parse(postData);
        document.getElementById('page-title').textContent = 'Edit Post';
        populateForm(currentPost);
        document.getElementById('deleteBtn').style.display = 'block';
        localStorage.removeItem('editingPost'); // Clean up
    } else {
        document.getElementById('page-title').textContent = 'New Post';
        // Set default values for new post
        document.getElementById('postDate').valueAsDate = new Date();
        document.getElementById('postAuthor').value = 'Eytan Benzeno';

        // Auto-generate slug from title
        document.getElementById('postTitle').addEventListener('input', (e) => {
            if (!currentPost) { // Only auto-generate for new posts
                const slug = generateSlug(e.target.value);
                document.getElementById('postSlug').value = slug;
            }
        });
    }

    // Check for auto-saved draft
    const draftData = localStorage.getItem('postDraft');
    if (draftData) {
        const draft = JSON.parse(draftData);
        if (confirm('Found an auto-saved draft. Would you like to restore it?')) {
            populateForm(draft);
        } else {
            localStorage.removeItem('postDraft');
        }
    }
}

function populateForm(post) {
    document.getElementById('postId').value = post.id || '';
    document.getElementById('postTitle').value = post.title || '';
    document.getElementById('postSlug').value = post.slug || '';

    // Convert ISO date to YYYY-MM-DD format
    if (post.date) {
        const dateObj = new Date(post.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        document.getElementById('postDate').value = formattedDate;
    }

    document.getElementById('postAuthor').value = post.author || 'Eytan Benzeno';
    document.getElementById('postIcon').value = post.icon || '';
    document.getElementById('postImageUrl').value = post.image || '';
    document.getElementById('postExcerpt').value = post.excerpt || '';
    document.getElementById('postHashtags').value = post.hashtags || '';
    document.getElementById('postContent').value = post.content || '';

    if (post.image) {
        document.getElementById('currentImageDisplay').textContent = post.image;
        document.getElementById('imagePreview').src = post.image;
        document.getElementById('imagePreview').classList.add('visible');
    }
}

function setupEventListeners() {
    // Track changes
    document.getElementById('editorForm').addEventListener('input', () => {
        hasUnsavedChanges = true;
    });

    // Save button
    document.getElementById('saveBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        await savePost();
    });

    // Cancel button
    document.getElementById('cancelBtn').addEventListener('click', () => {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                localStorage.removeItem('postDraft');
                window.location.href = 'admin.html';
            }
        } else {
            window.location.href = 'admin.html';
        }
    });

    // Delete button
    document.getElementById('deleteBtn').addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
            await deletePost();
        }
    });

    // Image URL input - show preview
    document.getElementById('postImageUrl').addEventListener('input', (e) => {
        const url = e.target.value.trim();
        const preview = document.getElementById('imagePreview');

        if (url) {
            preview.src = url;
            preview.classList.add('visible');
            // Clear file input
            document.getElementById('postImageFile').value = '';
        } else {
            preview.classList.remove('visible');
        }
    });

    // Image file input - preview
    document.getElementById('postImageFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Clear URL input
            document.getElementById('postImageUrl').value = '';

            const reader = new FileReader();
            reader.onload = (event) => {
                const preview = document.getElementById('imagePreview');
                preview.src = event.target.result;
                preview.classList.add('visible');
            };
            reader.readAsDataURL(file);
        }
    });

    // Generate hashtags button
    document.getElementById('generateHashtagsBtn').addEventListener('click', async () => {
        await generateHashtags();
    });
}

function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        if (hasUnsavedChanges) {
            autoSaveDraft();
        }
    }, 30000); // Auto-save every 30 seconds
}

function autoSaveDraft() {
    const formData = getFormData();
    localStorage.setItem('postDraft', JSON.stringify(formData));

    const indicator = document.getElementById('autoSaveIndicator');
    const text = document.getElementById('autoSaveText');
    indicator.classList.add('saving');
    text.textContent = 'Saving...';

    setTimeout(() => {
        indicator.classList.remove('saving');
        indicator.classList.add('saved');
        text.textContent = 'Draft saved';

        setTimeout(() => {
            indicator.classList.remove('saved');
            text.textContent = 'Ready';
        }, 2000);
    }, 500);
}

function setupBeforeUnload() {
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function getFormData() {
    return {
        id: document.getElementById('postId').value || null,
        title: document.getElementById('postTitle').value,
        slug: document.getElementById('postSlug').value,
        date: document.getElementById('postDate').value,
        author: document.getElementById('postAuthor').value,
        icon: document.getElementById('postIcon').value || '📝',
        image: document.getElementById('postImageUrl').value,
        excerpt: document.getElementById('postExcerpt').value,
        hashtags: document.getElementById('postHashtags').value,
        content: document.getElementById('postContent').value
    };
}

async function savePost() {
    const formData = getFormData();

    // Validation
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt) {
        alert('Please fill in all required fields (Title, Slug, Date, Author, Excerpt, Content)');
        return;
    }

    // Validate slug (URL-friendly)
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
        alert('URL Slug must be lowercase letters, numbers, and hyphens only');
        return;
    }

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
        // Handle image upload first if there's a new image file
        const imageFileInput = document.getElementById('postImageFile');
        if (imageFileInput.files && imageFileInput.files[0]) {
            const imageUrl = await uploadImage(imageFileInput.files[0]);
            if (imageUrl) {
                formData.image = imageUrl;
            }
        }

        // Save post
        const isNewPost = !formData.id;
        const url = isNewPost
            ? `${API_URL}/posts`
            : `${API_URL}/posts/${currentPost.id}`; // Use original ID, not from form

        const method = isNewPost ? 'POST' : 'PUT';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to save post');
        }

        const result = await response.json();

        // Clear draft and unsaved changes flag
        localStorage.removeItem('postDraft');
        hasUnsavedChanges = false;

        alert(isNewPost ? 'Post created successfully!' : 'Post updated successfully!');
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Error saving post:', error);
        alert('Error saving post: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Post';
    }
}

async function uploadImage(file) {
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB. Please resize or compress the image.');
        return null;
    }

    try {
        // Read file and convert to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

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
        return data.fullUrl; // Return the full URL
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image: ' + error.message);
        return null;
    }
}

async function deletePost() {
    const postId = currentPost?.id;

    if (!postId) {
        alert('Cannot delete a post that hasn\'t been created yet.');
        return;
    }

    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Deleting...';

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to delete post');
        }

        localStorage.removeItem('postDraft');
        hasUnsavedChanges = false;
        alert('Post deleted successfully!');
        window.location.href = 'admin.html';
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete Post';
    }
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 200);
}

async function generateHashtags() {
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();

    // Validate that we have at least some content
    if (!title && !excerpt && !content) {
        alert('Please add a title, excerpt, or content first!');
        return;
    }

    // Show loading state
    const hashtagsInput = document.getElementById('postHashtags');
    const generateBtn = document.getElementById('generateHashtagsBtn');
    const originalValue = hashtagsInput.value;

    hashtagsInput.value = 'Generating hashtags...';
    hashtagsInput.disabled = true;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

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

        // Keep the hashtags with # symbols as returned by the API
        hashtagsInput.value = data.hashtags.trim();

        // Show success message briefly
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = 'Hashtags generated!';
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error generating hashtags:', error);
        alert('Error generating hashtags: ' + error.message);
        hashtagsInput.value = originalValue; // Restore original value on error
    } finally {
        hashtagsInput.disabled = false;
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate Hashtags';
    }
}
