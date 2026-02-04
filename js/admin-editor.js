// API_URL is defined globally in admin-editor.html
let currentPost = null;
let autoSaveInterval = null;
let hasUnsavedChanges = false;

// Initialize the editor
function initEditor() {
    loadPostData();
    setupEventListeners();
    startAutoSave();
    setupBeforeUnload();
    loadCommonTags();
}

// Load common tags dynamically from existing posts
async function loadCommonTags() {
    const container = document.getElementById('common-tags-container');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/posts?status=all`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        const posts = data.posts || [];

        // Collect all unique tags
        const allTags = new Set();
        posts.forEach(post => {
            if (post.tags && Array.isArray(post.tags)) {
                post.tags.forEach(tag => allTags.add(tag));
            }
        });

        // Sort tags alphabetically
        const sortedTags = Array.from(allTags).sort();

        // Generate buttons HTML
        if (sortedTags.length > 0) {
            container.innerHTML = sortedTags.map(tag =>
                `<button type="button" class="tag-suggestion" onclick="addTag('${tag.replace(/'/g, "\\'")}')">${tag}</button>`
            ).join('');
        } else {
            container.innerHTML = '<span style="color: #999; font-size: 0.85rem;">No tags yet. Create some by adding tags to your posts.</span>';
        }
    } catch (error) {
        console.error('Error loading common tags:', error);
        container.innerHTML = '<span style="color: #999; font-size: 0.85rem;">Could not load tags</span>';
    }
}

// Load post data on page load
// Check if DOM is already loaded (since this script loads dynamically)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
} else {
    // DOM already loaded, run immediately
    initEditor();
}

function loadPostData() {
    // Check if we're editing an existing post or creating new
    const postData = localStorage.getItem('editingPost');

    if (postData) {
        currentPost = JSON.parse(postData);
        console.log('Loading post data:', currentPost);
        console.log('Hashtags field:', currentPost.hashtags);
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

    // Handle tags (convert array to comma-separated string)
    const tagsValue = post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : '';
    document.getElementById('postTags').value = tagsValue;

    const hashtagsValue = post.hashtags || '';
    console.log('Setting hashtags to:', hashtagsValue);
    document.getElementById('postHashtags').value = hashtagsValue;

    document.getElementById('postContent').value = post.content || '';

    // Populate French fields
    document.getElementById('postTitleFr').value = post.title_fr || '';
    document.getElementById('postExcerptFr').value = post.excerpt_fr || '';
    document.getElementById('postContentFr').value = post.content_fr || '';
    document.getElementById('postHashtagsFr').value = post.hashtags_fr || '';

    // Populate SEO fields - English
    document.getElementById('seoTitle').value = post.seo_title || '';
    document.getElementById('metaDescription').value = post.meta_description || '';
    document.getElementById('metaKeywords').value = post.meta_keywords || '';
    document.getElementById('focusKeyword').value = post.focus_keyword || '';
    document.getElementById('imageAlt').value = post.image_alt || '';
    document.getElementById('socialPreview').value = post.social_preview || '';

    // Populate SEO fields - French
    document.getElementById('seoTitleFr').value = post.seo_title_fr || '';
    document.getElementById('metaDescriptionFr').value = post.meta_description_fr || '';
    document.getElementById('metaKeywordsFr').value = post.meta_keywords_fr || '';
    document.getElementById('imageAltFr').value = post.image_alt_fr || '';
    document.getElementById('socialPreviewFr').value = post.social_preview_fr || '';

    // Populate Portuguese fields
    document.getElementById('postTitlePt').value = post.title_pt || '';
    document.getElementById('postExcerptPt').value = post.excerpt_pt || '';
    document.getElementById('postContentPt').value = post.content_pt || '';
    document.getElementById('postHashtagsPt').value = post.hashtags_pt || '';

    // Populate SEO fields - Portuguese
    document.getElementById('seoTitlePt').value = post.seo_title_pt || '';
    document.getElementById('metaDescriptionPt').value = post.meta_description_pt || '';
    document.getElementById('metaKeywordsPt').value = post.meta_keywords_pt || '';
    document.getElementById('imageAltPt').value = post.image_alt_pt || '';
    document.getElementById('socialPreviewPt').value = post.social_preview_pt || '';

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

    // Generate SEO button
    document.getElementById('generateSEOBtn').addEventListener('click', async () => {
        await generateSEO();
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
    const slug = document.getElementById('postSlug').value;
    const postId = document.getElementById('postId').value;

    return {
        id: postId || slug, // Use slug as ID for new posts
        title: document.getElementById('postTitle').value,
        slug: slug,
        date: document.getElementById('postDate').value,
        author: document.getElementById('postAuthor').value,
        icon: document.getElementById('postIcon').value || '📝',
        image: document.getElementById('postImageUrl').value,
        excerpt: document.getElementById('postExcerpt').value,
        tags: document.getElementById('postTags').value.split(',').map(t => t.trim()).filter(t => t),
        hashtags: document.getElementById('postHashtags').value,
        content: document.getElementById('postContent').value,
        title_fr: document.getElementById('postTitleFr').value,
        excerpt_fr: document.getElementById('postExcerptFr').value,
        content_fr: document.getElementById('postContentFr').value,
        hashtagsFr: document.getElementById('postHashtagsFr').value,
        seoTitle: document.getElementById('seoTitle').value,
        metaDescription: document.getElementById('metaDescription').value,
        metaKeywords: document.getElementById('metaKeywords').value,
        focusKeyword: document.getElementById('focusKeyword').value,
        imageAlt: document.getElementById('imageAlt').value,
        socialPreview: document.getElementById('socialPreview').value,
        // French SEO fields
        seoTitleFr: document.getElementById('seoTitleFr').value,
        metaDescriptionFr: document.getElementById('metaDescriptionFr').value,
        metaKeywordsFr: document.getElementById('metaKeywordsFr').value,
        imageAltFr: document.getElementById('imageAltFr').value,
        socialPreviewFr: document.getElementById('socialPreviewFr').value,
        // Portuguese content fields
        title_pt: document.getElementById('postTitlePt').value,
        excerpt_pt: document.getElementById('postExcerptPt').value,
        content_pt: document.getElementById('postContentPt').value,
        hashtagsPt: document.getElementById('postHashtagsPt').value,
        // Portuguese SEO fields
        seoTitlePt: document.getElementById('seoTitlePt').value,
        metaDescriptionPt: document.getElementById('metaDescriptionPt').value,
        metaKeywordsPt: document.getElementById('metaKeywordsPt').value,
        imageAltPt: document.getElementById('imageAltPt').value,
        socialPreviewPt: document.getElementById('socialPreviewPt').value
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
        const isNewPost = !currentPost; // Check if editing existing post or creating new
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

        // Auto-republish if this was an already-published post
        if (!isNewPost && currentPost && currentPost.status === 'published') {
            saveBtn.textContent = 'Publishing changes...';

            try {
                const publishResponse = await fetch(`${API_URL}/posts/${currentPost.id}/publish`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (publishResponse.ok) {
                    alert('Post saved and republished! Changes will be live in 1-2 minutes.');
                } else {
                    alert('Post saved but republish failed. Please republish manually from the admin panel.');
                }
            } catch (publishError) {
                console.error('Auto-republish failed:', publishError);
                alert('Post saved but republish failed. Please republish manually from the admin panel.');
            }
        } else {
            alert(isNewPost ? 'Post created successfully!' : 'Post updated successfully!');
        }

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

async function generateSEO() {
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const image = document.getElementById('postImageUrl').value.trim();

    // Validate that we have at least some content
    if (!title && !excerpt && !content) {
        alert('Please add a title, excerpt, or content first!');
        return;
    }

    // Show loading state
    const generateBtn = document.getElementById('generateSEOBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';

    try {
        const response = await fetch(`${API_URL}/posts/generate-seo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                excerpt: excerpt,
                content: content,
                image: image
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to generate SEO metadata');
        }

        const data = await response.json();
        const seo = data.seo;

        // Populate all SEO fields
        document.getElementById('seoTitle').value = seo.seoTitle || '';
        document.getElementById('metaDescription').value = seo.metaDescription || '';
        document.getElementById('metaKeywords').value = Array.isArray(seo.metaKeywords)
            ? seo.metaKeywords.join(', ')
            : seo.metaKeywords || '';
        document.getElementById('metaKeywordsFr').value = Array.isArray(seo.metaKeywordsFr)
            ? seo.metaKeywordsFr.join(', ')
            : seo.metaKeywordsFr || '';
        document.getElementById('focusKeyword').value = seo.focusKeyword || '';
        document.getElementById('imageAlt').value = seo.imageAlt || '';
        document.getElementById('socialPreview').value = seo.socialPreview || '';

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = 'SEO metadata generated!';
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error generating SEO:', error);
        alert('Error generating SEO metadata: ' + error.message);
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate SEO';
    }
}

// Helper function for tag suggestions
function addTag(tagName) {
    const tagsInput = document.getElementById('postTags');
    const currentTags = tagsInput.value.trim();

    // Check if tag already exists
    const tagsArray = currentTags.split(',').map(t => t.trim()).filter(t => t);
    if (tagsArray.includes(tagName)) {
        return; // Tag already added
    }

    // Add tag
    if (currentTags) {
        tagsInput.value = currentTags + ', ' + tagName;
    } else {
        tagsInput.value = tagName;
    }
}

// Translation functions
async function translateField(fieldType) {
    let sourceText = '';
    let targetFieldId = '';

    // Get source text based on field type
    switch (fieldType) {
        case 'title':
            sourceText = document.getElementById('postTitle').value.trim();
            targetFieldId = 'postTitleFr';
            break;
        case 'excerpt':
            sourceText = document.getElementById('postExcerpt').value.trim();
            targetFieldId = 'postExcerptFr';
            break;
        case 'content':
            sourceText = document.getElementById('postContent').value.trim();
            targetFieldId = 'postContentFr';
            break;
        case 'metaKeywords':
            sourceText = document.getElementById('metaKeywords').value.trim();
            targetFieldId = 'metaKeywordsFr';
            break;
        case 'seoTitle':
            sourceText = document.getElementById('seoTitle').value.trim();
            targetFieldId = 'seoTitleFr';
            break;
        case 'metaDescription':
            sourceText = document.getElementById('metaDescription').value.trim();
            targetFieldId = 'metaDescriptionFr';
            break;
        case 'imageAlt':
            sourceText = document.getElementById('imageAlt').value.trim();
            targetFieldId = 'imageAltFr';
            break;
        case 'socialPreview':
            sourceText = document.getElementById('socialPreview').value.trim();
            targetFieldId = 'socialPreviewFr';
            break;
        default:
            alert('Invalid field type');
            return;
    }

    // Validate source text
    if (!sourceText) {
        alert(`Please enter ${fieldType} in English first!`);
        return;
    }

    const targetField = document.getElementById(targetFieldId);
    const originalValue = targetField.value;

    // Show loading state
    targetField.value = 'Translating...';
    targetField.disabled = true;

    try {
        const response = await fetch(`${API_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                text: sourceText,
                type: fieldType
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Translation failed');
        }

        const data = await response.json();
        targetField.value = data.translation;

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} translated!`;
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation error: ' + error.message);
        targetField.value = originalValue; // Restore original value on error
    } finally {
        targetField.disabled = false;
    }
}

async function translateAllFields() {
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const seoTitle = document.getElementById('seoTitle').value.trim();
    const metaDescription = document.getElementById('metaDescription').value.trim();
    const metaKeywords = document.getElementById('metaKeywords').value.trim();
    const imageAlt = document.getElementById('imageAlt').value.trim();
    const socialPreview = document.getElementById('socialPreview').value.trim();

    // Validate that we have content
    if (!title || !excerpt || !content) {
        alert('Please fill in all English fields (Title, Excerpt, Content) before translating!');
        return;
    }

    // Confirm before proceeding (this will cost API credits)
    if (!confirm('This will translate all content and SEO fields to French using AI. Continue?')) {
        return;
    }

    // Get all French field elements
    const titleFr = document.getElementById('postTitleFr');
    const excerptFr = document.getElementById('postExcerptFr');
    const contentFr = document.getElementById('postContentFr');
    const seoTitleFr = document.getElementById('seoTitleFr');
    const metaDescriptionFr = document.getElementById('metaDescriptionFr');
    const metaKeywordsFr = document.getElementById('metaKeywordsFr');
    const imageAltFr = document.getElementById('imageAltFr');
    const socialPreviewFr = document.getElementById('socialPreviewFr');

    // Show loading state for all fields
    titleFr.value = 'Translating...';
    excerptFr.value = 'Translating...';
    contentFr.value = 'Translating...';
    titleFr.disabled = true;
    excerptFr.disabled = true;
    contentFr.disabled = true;

    if (seoTitle) { seoTitleFr.value = 'Translating...'; seoTitleFr.disabled = true; }
    if (metaDescription) { metaDescriptionFr.value = 'Translating...'; metaDescriptionFr.disabled = true; }
    if (metaKeywords) { metaKeywordsFr.value = 'Translating...'; metaKeywordsFr.disabled = true; }
    if (imageAlt) { imageAltFr.value = 'Translating...'; imageAltFr.disabled = true; }
    if (socialPreview) { socialPreviewFr.value = 'Translating...'; socialPreviewFr.disabled = true; }

    try {
        // Translate main content fields
        const response = await fetch(`${API_URL}/translate/bulk`, {
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
            throw new Error(error.error || 'Bulk translation failed');
        }

        const data = await response.json();

        // Populate French content fields
        titleFr.value = data.title_fr || '';
        excerptFr.value = data.excerpt_fr || '';
        contentFr.value = data.content_fr || '';

        // Translate SEO fields individually
        const seoFields = [
            { source: seoTitle, target: seoTitleFr, type: 'seoTitle' },
            { source: metaDescription, target: metaDescriptionFr, type: 'metaDescription' },
            { source: metaKeywords, target: metaKeywordsFr, type: 'metaKeywords' },
            { source: imageAlt, target: imageAltFr, type: 'imageAlt' },
            { source: socialPreview, target: socialPreviewFr, type: 'socialPreview' }
        ];

        for (const field of seoFields) {
            if (field.source) {
                try {
                    const seoResponse = await fetch(`${API_URL}/translate`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ text: field.source, type: field.type })
                    });
                    if (seoResponse.ok) {
                        const seoData = await seoResponse.json();
                        field.target.value = seoData.translation || '';
                    }
                } catch (seoError) {
                    console.error(`${field.type} translation error:`, seoError);
                }
            }
        }

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = '✅ All fields translated to French!';
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 3000);
    } catch (error) {
        console.error('Bulk translation error:', error);
        alert('Translation error: ' + error.message);
        // Clear "Translating..." text on error
        titleFr.value = '';
        excerptFr.value = '';
        contentFr.value = '';
    } finally {
        titleFr.disabled = false;
        excerptFr.disabled = false;
        contentFr.disabled = false;
        seoTitleFr.disabled = false;
        metaDescriptionFr.disabled = false;
        metaKeywordsFr.disabled = false;
        imageAltFr.disabled = false;
        socialPreviewFr.disabled = false;
    }
}

// Portuguese translation functions
async function translateFieldPt(fieldType) {
    let sourceText = '';
    let targetFieldId = '';

    // Get source text based on field type
    switch (fieldType) {
        case 'title':
            sourceText = document.getElementById('postTitle').value.trim();
            targetFieldId = 'postTitlePt';
            break;
        case 'excerpt':
            sourceText = document.getElementById('postExcerpt').value.trim();
            targetFieldId = 'postExcerptPt';
            break;
        case 'content':
            sourceText = document.getElementById('postContent').value.trim();
            targetFieldId = 'postContentPt';
            break;
        case 'metaKeywords':
            sourceText = document.getElementById('metaKeywords').value.trim();
            targetFieldId = 'metaKeywordsPt';
            break;
        case 'seoTitle':
            sourceText = document.getElementById('seoTitle').value.trim();
            targetFieldId = 'seoTitlePt';
            break;
        case 'metaDescription':
            sourceText = document.getElementById('metaDescription').value.trim();
            targetFieldId = 'metaDescriptionPt';
            break;
        case 'imageAlt':
            sourceText = document.getElementById('imageAlt').value.trim();
            targetFieldId = 'imageAltPt';
            break;
        case 'socialPreview':
            sourceText = document.getElementById('socialPreview').value.trim();
            targetFieldId = 'socialPreviewPt';
            break;
        default:
            alert('Invalid field type');
            return;
    }

    // Validate source text
    if (!sourceText) {
        alert(`Please enter ${fieldType} in English first!`);
        return;
    }

    const targetField = document.getElementById(targetFieldId);
    const originalValue = targetField.value;

    // Show loading state
    targetField.value = 'Translating...';
    targetField.disabled = true;

    try {
        const response = await fetch(`${API_URL}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                text: sourceText,
                type: fieldType,
                targetLang: 'pt'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Translation failed');
        }

        const data = await response.json();
        targetField.value = data.translation;

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} translated to Portuguese!`;
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Translation error:', error);
        alert('Translation error: ' + error.message);
        targetField.value = originalValue; // Restore original value on error
    } finally {
        targetField.disabled = false;
    }
}

async function translateAllFieldsPt() {
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const metaKeywords = document.getElementById('metaKeywords').value.trim();
    const seoTitle = document.getElementById('seoTitle').value.trim();
    const metaDescription = document.getElementById('metaDescription').value.trim();
    const imageAlt = document.getElementById('imageAlt').value.trim();
    const socialPreview = document.getElementById('socialPreview').value.trim();

    // Validate that we have content
    if (!title || !excerpt || !content) {
        alert('Please fill in all English fields (Title, Excerpt, Content) before translating!');
        return;
    }

    // Confirm before proceeding (this will cost API credits)
    if (!confirm('This will translate all content and SEO fields to Portuguese using AI. Continue?')) {
        return;
    }

    // Show loading state for main fields
    const titlePt = document.getElementById('postTitlePt');
    const excerptPt = document.getElementById('postExcerptPt');
    const contentPt = document.getElementById('postContentPt');
    const metaKeywordsPt = document.getElementById('metaKeywordsPt');
    const seoTitlePt = document.getElementById('seoTitlePt');
    const metaDescriptionPt = document.getElementById('metaDescriptionPt');
    const imageAltPt = document.getElementById('imageAltPt');
    const socialPreviewPt = document.getElementById('socialPreviewPt');

    titlePt.value = 'Translating...';
    excerptPt.value = 'Translating...';
    contentPt.value = 'Translating...';
    titlePt.disabled = true;
    excerptPt.disabled = true;
    contentPt.disabled = true;

    // Set up loading state for SEO fields
    const seoFieldsToTranslate = [];
    if (metaKeywords) {
        metaKeywordsPt.value = 'Translating...';
        metaKeywordsPt.disabled = true;
        seoFieldsToTranslate.push({ source: metaKeywords, target: metaKeywordsPt, type: 'metaKeywords' });
    }
    if (seoTitle) {
        seoTitlePt.value = 'Translating...';
        seoTitlePt.disabled = true;
        seoFieldsToTranslate.push({ source: seoTitle, target: seoTitlePt, type: 'seoTitle' });
    }
    if (metaDescription) {
        metaDescriptionPt.value = 'Translating...';
        metaDescriptionPt.disabled = true;
        seoFieldsToTranslate.push({ source: metaDescription, target: metaDescriptionPt, type: 'metaDescription' });
    }
    if (imageAlt) {
        imageAltPt.value = 'Translating...';
        imageAltPt.disabled = true;
        seoFieldsToTranslate.push({ source: imageAlt, target: imageAltPt, type: 'imageAlt' });
    }
    if (socialPreview) {
        socialPreviewPt.value = 'Translating...';
        socialPreviewPt.disabled = true;
        seoFieldsToTranslate.push({ source: socialPreview, target: socialPreviewPt, type: 'socialPreview' });
    }

    try {
        // Translate main content fields
        const response = await fetch(`${API_URL}/translate/bulk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                excerpt: excerpt,
                content: content,
                targetLang: 'pt'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Bulk translation failed');
        }

        const data = await response.json();

        // Populate Portuguese fields
        titlePt.value = data.title_pt || '';
        excerptPt.value = data.excerpt_pt || '';
        contentPt.value = data.content_pt || '';

        // Translate all SEO fields
        for (const field of seoFieldsToTranslate) {
            try {
                const fieldResponse = await fetch(`${API_URL}/translate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        text: field.source,
                        type: field.type,
                        targetLang: 'pt'
                    })
                });

                if (fieldResponse.ok) {
                    const fieldData = await fieldResponse.json();
                    field.target.value = fieldData.translation || '';
                }
            } catch (fieldError) {
                console.error(`${field.type} translation error:`, fieldError);
                // Don't fail the whole operation for individual SEO fields
            }
        }

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = '✅ All fields translated to Portuguese!';
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 3000);
    } catch (error) {
        console.error('Bulk translation error:', error);
        alert('Translation error: ' + error.message);
        // Clear "Translating..." text on error
        titlePt.value = '';
        excerptPt.value = '';
        contentPt.value = '';
        metaKeywordsPt.value = '';
        seoTitlePt.value = '';
        metaDescriptionPt.value = '';
        imageAltPt.value = '';
        socialPreviewPt.value = '';
    } finally {
        titlePt.disabled = false;
        excerptPt.disabled = false;
        contentPt.disabled = false;
        metaKeywordsPt.disabled = false;
        seoTitlePt.disabled = false;
        metaDescriptionPt.disabled = false;
        imageAltPt.disabled = false;
        socialPreviewPt.disabled = false;
    }
}

/**
 * Generate native SEO content for a specific language
 * Uses AI to create optimized SEO fields based on the post content
 * @param {string} language - 'en', 'fr', or 'pt'
 */
async function generateSEO(language) {
    // Get the content fields based on language
    const langSuffix = language === 'en' ? '' : (language === 'fr' ? 'Fr' : 'Pt');
    const langName = language === 'en' ? 'English' : (language === 'fr' ? 'French' : 'Portuguese');

    const title = document.getElementById(`postTitle${langSuffix}`).value.trim();
    const content = document.getElementById(`postContent${langSuffix}`).value.trim();
    const excerpt = document.getElementById(`postExcerpt${langSuffix}`).value.trim();

    // Validate content exists
    if (!title || !content) {
        alert(`Please fill in the ${langName} title and content before generating SEO.`);
        return;
    }

    // Confirm before proceeding
    if (!confirm(`Generate native ${langName} SEO content optimized for ${langName}-speaking markets? This uses AI.`)) {
        return;
    }

    // Get SEO field elements
    const seoTitle = document.getElementById(`seoTitle${langSuffix}`);
    const metaDescription = document.getElementById(`metaDescription${langSuffix}`);
    const metaKeywords = document.getElementById(`metaKeywords${langSuffix}`);
    const imageAlt = document.getElementById(`imageAlt${langSuffix}`);
    const socialPreview = document.getElementById(`socialPreview${langSuffix}`);

    // Show loading state
    const originalValues = {
        seoTitle: seoTitle.value,
        metaDescription: metaDescription.value,
        metaKeywords: metaKeywords.value,
        imageAlt: imageAlt.value,
        socialPreview: socialPreview.value
    };

    seoTitle.value = 'Generating...';
    metaDescription.value = 'Generating...';
    metaKeywords.value = 'Generating...';
    imageAlt.value = 'Generating...';
    socialPreview.value = 'Generating...';

    seoTitle.disabled = true;
    metaDescription.disabled = true;
    metaKeywords.disabled = true;
    imageAlt.disabled = true;
    socialPreview.disabled = true;

    try {
        const response = await fetch(`${API_URL}/generate/seo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content,
                excerpt: excerpt,
                language: language
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'SEO generation failed');
        }

        const data = await response.json();

        // Populate fields with generated content
        seoTitle.value = data.seoTitle || '';
        metaDescription.value = data.metaDescription || '';
        metaKeywords.value = data.metaKeywords || '';
        imageAlt.value = data.imageAlt || '';
        socialPreview.value = data.socialPreview || '';

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = `✅ ${langName} SEO generated!`;
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 3000);

    } catch (error) {
        console.error('SEO generation error:', error);
        alert('SEO generation error: ' + error.message);
        // Restore original values on error
        seoTitle.value = originalValues.seoTitle;
        metaDescription.value = originalValues.metaDescription;
        metaKeywords.value = originalValues.metaKeywords;
        imageAlt.value = originalValues.imageAlt;
        socialPreview.value = originalValues.socialPreview;
    } finally {
        seoTitle.disabled = false;
        metaDescription.disabled = false;
        metaKeywords.disabled = false;
        imageAlt.disabled = false;
        socialPreview.disabled = false;
    }
}

/**
 * Generate native hashtags for a specific language
 * Uses AI to create hashtags relevant to that language's social media landscape
 * @param {string} language - 'en', 'fr', or 'pt'
 */
async function generateHashtags(language) {
    // Get the content fields based on language
    const langSuffix = language === 'en' ? '' : (language === 'fr' ? 'Fr' : 'Pt');
    const langName = language === 'en' ? 'English' : (language === 'fr' ? 'French' : 'Portuguese');

    const title = document.getElementById(`postTitle${langSuffix}`).value.trim();
    const content = document.getElementById(`postContent${langSuffix}`).value.trim();
    const excerpt = document.getElementById(`postExcerpt${langSuffix}`).value.trim();

    // Validate content exists
    if (!title || !content) {
        alert(`Please fill in the ${langName} title and content before generating hashtags.`);
        return;
    }

    // Get hashtag field
    const hashtagField = document.getElementById(`postHashtags${langSuffix}`);

    // Show loading state
    const originalValue = hashtagField.value;
    hashtagField.value = 'Generating...';
    hashtagField.disabled = true;

    try {
        const response = await fetch(`${API_URL}/generate/hashtags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                content: content,
                excerpt: excerpt,
                language: language,
                platform: 'all'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Hashtag generation failed');
        }

        const data = await response.json();

        // Populate field with generated hashtags
        hashtagField.value = data.hashtags || '';

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success message
        const autoSaveText = document.getElementById('autoSaveText');
        const originalText = autoSaveText.textContent;
        autoSaveText.textContent = `✅ ${langName} hashtags generated!`;
        setTimeout(() => {
            autoSaveText.textContent = originalText;
        }, 3000);

    } catch (error) {
        console.error('Hashtag generation error:', error);
        alert('Hashtag generation error: ' + error.message);
        // Restore original value on error
        hashtagField.value = originalValue;
    } finally {
        hashtagField.disabled = false;
    }
}

/**
 * Generate a complete localized page for a language
 * 1. Translates content from English (title, excerpt, content)
 * 2. Generates native hashtags based on translated content
 * 3. Generates native SEO based on translated content
 * @param {string} language - 'fr' or 'pt'
 */
async function generateFullPage(language) {
    const langName = language === 'fr' ? 'French' : 'Portuguese';
    const langSuffix = language === 'fr' ? 'Fr' : 'Pt';

    // Get English content
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();

    // Validate English content exists
    if (!title || !excerpt || !content) {
        alert('Please fill in all English fields (Title, Excerpt, Content) before generating.');
        return;
    }

    // Confirm before proceeding
    if (!confirm(`Generate complete ${langName} page?\n\nThis will:\n1. Translate content from English\n2. Generate native ${langName} hashtags\n3. Generate native ${langName} SEO\n\nContinue?`)) {
        return;
    }

    // Get all target field elements
    const titleTarget = document.getElementById(`postTitle${langSuffix}`);
    const excerptTarget = document.getElementById(`postExcerpt${langSuffix}`);
    const contentTarget = document.getElementById(`postContent${langSuffix}`);
    const hashtagsTarget = document.getElementById(`postHashtags${langSuffix}`);
    const seoTitleTarget = document.getElementById(`seoTitle${langSuffix}`);
    const metaDescriptionTarget = document.getElementById(`metaDescription${langSuffix}`);
    const metaKeywordsTarget = document.getElementById(`metaKeywords${langSuffix}`);
    const imageAltTarget = document.getElementById(`imageAlt${langSuffix}`);
    const socialPreviewTarget = document.getElementById(`socialPreview${langSuffix}`);

    // Show loading state for all fields
    const allFields = [titleTarget, excerptTarget, contentTarget, hashtagsTarget,
                       seoTitleTarget, metaDescriptionTarget, metaKeywordsTarget,
                       imageAltTarget, socialPreviewTarget];

    allFields.forEach(field => {
        field.value = 'Generating...';
        field.disabled = true;
    });

    // Update status indicator
    const autoSaveText = document.getElementById('autoSaveText');
    const originalStatusText = autoSaveText.textContent;

    try {
        // STEP 1: Translate content
        autoSaveText.textContent = `⏳ Step 1/3: Translating to ${langName}...`;

        const translateResponse = await fetch(`${API_URL}/translate/bulk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                title: title,
                excerpt: excerpt,
                content: content,
                targetLang: language
            })
        });

        if (!translateResponse.ok) {
            const error = await translateResponse.json();
            throw new Error(error.error || 'Translation failed');
        }

        const translateData = await translateResponse.json();
        const langKey = language === 'fr' ? '_fr' : '_pt';

        // Populate translated content
        const translatedTitle = translateData[`title${langKey}`] || '';
        const translatedExcerpt = translateData[`excerpt${langKey}`] || '';
        const translatedContent = translateData[`content${langKey}`] || '';

        titleTarget.value = translatedTitle;
        excerptTarget.value = translatedExcerpt;
        contentTarget.value = translatedContent;

        // STEP 2: Generate hashtags based on translated content
        autoSaveText.textContent = `⏳ Step 2/3: Generating ${langName} hashtags...`;

        const hashtagsResponse = await fetch(`${API_URL}/generate/hashtags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                title: translatedTitle,
                content: translatedContent,
                excerpt: translatedExcerpt,
                language: language,
                platform: 'all'
            })
        });

        if (hashtagsResponse.ok) {
            const hashtagsData = await hashtagsResponse.json();
            hashtagsTarget.value = hashtagsData.hashtags || '';
        } else {
            console.error('Hashtag generation failed, continuing...');
            hashtagsTarget.value = '';
        }

        // STEP 3: Generate SEO based on translated content
        autoSaveText.textContent = `⏳ Step 3/3: Generating ${langName} SEO...`;

        const seoResponse = await fetch(`${API_URL}/generate/seo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                title: translatedTitle,
                content: translatedContent,
                excerpt: translatedExcerpt,
                language: language
            })
        });

        if (seoResponse.ok) {
            const seoData = await seoResponse.json();
            seoTitleTarget.value = seoData.seoTitle || '';
            metaDescriptionTarget.value = seoData.metaDescription || '';
            metaKeywordsTarget.value = seoData.metaKeywords || '';
            imageAltTarget.value = seoData.imageAlt || '';
            socialPreviewTarget.value = seoData.socialPreview || '';
        } else {
            console.error('SEO generation failed, continuing...');
            seoTitleTarget.value = '';
            metaDescriptionTarget.value = '';
            metaKeywordsTarget.value = '';
            imageAltTarget.value = '';
            socialPreviewTarget.value = '';
        }

        // Mark as having unsaved changes
        hasUnsavedChanges = true;

        // Show success
        autoSaveText.textContent = `✅ ${langName} page generated!`;
        setTimeout(() => {
            autoSaveText.textContent = originalStatusText;
        }, 4000);

    } catch (error) {
        console.error('Generate page error:', error);
        alert(`Error generating ${langName} page: ${error.message}`);

        // Clear all fields on error
        allFields.forEach(field => {
            field.value = '';
        });

        autoSaveText.textContent = originalStatusText;
    } finally {
        // Re-enable all fields
        allFields.forEach(field => {
            field.disabled = false;
        });
    }
}
