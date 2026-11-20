document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const multipleToggle = document.getElementById('multipleToggle');
  const modeStatusText = document.getElementById('modeStatusText');
  const stagedContainer = document.getElementById('stagedContainer');
  const stagedList = document.getElementById('stagedList');
  const stagedSummary = document.getElementById('stagedSummary');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const progressWrapper = document.getElementById('progressWrapper');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  const progressStatus = document.getElementById('progressStatus');
  const serverFilesList = document.getElementById('serverFilesList');
  const refreshBtn = document.getElementById('refreshBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Application State
  let stagedFiles = [];

  // Helper: Format bytes to human readable string
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // Helper: Return SVG icon based on file mime type or extension
  function getFileIcon(filename, mimeType = '') {
    const ext = filename.split('.').pop().toLowerCase();
    
    // Images
    if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <circle cx="9" cy="9" r="2"/>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
      </svg>`;
    }
    // PDF
    if (ext === 'pdf' || mimeType === 'application/pdf') {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>`;
    }
    // Audio
    if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18V5l12-2v13"></path>
        <circle cx="6" cy="18" r="3"></circle>
        <circle cx="18" cy="16" r="3"></circle>
      </svg>`;
    }
    // Video
    if (mimeType.startsWith('video/') || ['mp4', 'mkv', 'avi', 'mov', 'webm'].includes(ext)) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>`;
    }
    // Zip / Archive
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>`;
    }
    // Code / Text
    if (['html', 'css', 'js', 'json', 'ts', 'py', 'c', 'cpp', 'java', 'txt', 'md'].includes(ext)) {
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>`;
    }
    // Default document
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>`;
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Mode Toggle (Single vs Multiple)
  multipleToggle.addEventListener('change', () => {
    const isMultiple = multipleToggle.checked;
    fileInput.multiple = isMultiple;
    if (isMultiple) {
      modeStatusText.textContent = 'Multiple Files';
      modeStatusText.className = 'mode-badge multiple';
    } else {
      modeStatusText.textContent = 'Single File';
      modeStatusText.className = 'mode-badge single';
      // If user switched to single mode and has multiple staged files, keep only the first
      if (stagedFiles.length > 1) {
        stagedFiles = [stagedFiles[0]];
        renderStagedFiles();
        showToast('Switched to Single File mode. Retained the first file.', 'info');
      }
    }
  });

  // Handle Drag & Drop
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      handleFilesSelected(dt.files);
    }
  });

  // Handle File Input Change
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
    // Reset file input value to allow selecting same file again if desired
    fileInput.value = '';
  });

  // Process selected files
  function handleFilesSelected(newFilesList) {
    const isMultiple = multipleToggle.checked;
    const newFiles = Array.from(newFilesList);

    if (!isMultiple) {
      // In single mode, replace existing selection with the latest single file
      stagedFiles = [newFiles[0]];
    } else {
      // In multiple mode, append new files (filter duplicates by name & size)
      newFiles.forEach(file => {
        const isDuplicate = stagedFiles.some(f => f.name === file.name && f.size === file.size);
        if (!isDuplicate) {
          stagedFiles.push(file);
        }
      });
    }

    renderStagedFiles();
  }

  // Render Staged Files List
  function renderStagedFiles() {
    if (stagedFiles.length === 0) {
      stagedContainer.classList.add('hidden');
      uploadBtn.disabled = true;
      return;
    }

    stagedContainer.classList.remove('hidden');
    uploadBtn.disabled = false;

    // Calculate total size
    const totalSize = stagedFiles.reduce((acc, f) => acc + f.size, 0);
    stagedSummary.textContent = `${stagedFiles.length} file(s) selected (Total: ${formatBytes(totalSize)})`;

    stagedList.innerHTML = '';
    stagedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'staged-item';

      let iconHtml = '';
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        iconHtml = `<div class="staged-icon-box"><img src="${previewUrl}" alt="thumb"></div>`;
      } else {
        iconHtml = `<div class="staged-icon-box">${getFileIcon(file.name, file.type)}</div>`;
      }

      item.innerHTML = `
        <div class="staged-file-meta">
          ${iconHtml}
          <div class="staged-details">
            <span class="staged-name" title="${file.name}">${file.name}</span>
            <span class="staged-size">${formatBytes(file.size)}</span>
          </div>
        </div>
        <button type="button" class="btn-remove-staged" data-index="${index}" title="Remove file">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      stagedList.appendChild(item);
    });

    // Attach remove handlers
    document.querySelectorAll('.btn-remove-staged').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        stagedFiles.splice(idx, 1);
        renderStagedFiles();
      });
    });
  }

  // Clear All Staged Files
  clearAllBtn.addEventListener('click', () => {
    stagedFiles = [];
    renderStagedFiles();
  });

  // Upload Files via AJAX with Real-time Progress
  uploadBtn.addEventListener('click', () => {
    if (stagedFiles.length === 0) return;

    const formData = new FormData();
    stagedFiles.forEach(file => {
      formData.append('files', file);
    });

    const xhr = new XMLHttpRequest();

    // Setup Progress UI
    progressWrapper.classList.remove('hidden');
    uploadBtn.disabled = true;
    progressBar.style.width = '0%';
    progressPercentage.textContent = '0%';
    progressStatus.textContent = `Uploading ${stagedFiles.length} file(s)...`;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percent + '%';
        progressPercentage.textContent = percent + '%';
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          showToast(res.message || 'Upload complete!', 'success');
        } catch {
          showToast('Files uploaded successfully!', 'success');
        }
        // Clear staged queue
        stagedFiles = [];
        renderStagedFiles();
        fetchServerFiles();
      } else {
        let errorMsg = 'Failed to upload files.';
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.error) errorMsg = res.error;
        } catch {}
        showToast(errorMsg, 'error');
        uploadBtn.disabled = false;
      }

      // Hide progress bar after short delay
      setTimeout(() => {
        progressWrapper.classList.add('hidden');
        progressBar.style.width = '0%';
      }, 1200);
    });

    xhr.addEventListener('error', () => {
      showToast('Network error while uploading. Please check connection.', 'error');
      uploadBtn.disabled = false;
      progressWrapper.classList.add('hidden');
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
  });

  // Fetch and Render Uploaded Files from Server
  async function fetchServerFiles() {
    serverFilesList.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Loading server files...</p>
      </div>
    `;

    try {
      const response = await fetch('/api/files');
      if (!response.ok) throw new Error('Could not fetch files');
      const data = await response.json();
      renderServerFiles(data.files || []);
    } catch (err) {
      serverFilesList.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">Error loading files</p>
          <p class="empty-desc">Check if the Node.js server is running properly.</p>
        </div>
      `;
    }
  }

  function renderServerFiles(files) {
    if (files.length === 0) {
      serverFilesList.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
          </svg>
          <p class="empty-title">No files on server yet</p>
          <p class="empty-desc">Upload your single or multiple files using the left panel.</p>
        </div>
      `;
      return;
    }

    serverFilesList.innerHTML = '';
    files.forEach(file => {
      const dateFormatted = new Date(file.modifiedAt).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const item = document.createElement('div');
      item.className = 'server-file-item';
      item.innerHTML = `
        <div class="server-file-info">
          <div class="server-icon-box">
            ${getFileIcon(file.filename)}
          </div>
          <div class="server-details">
            <span class="server-filename" title="${file.filename}">${file.filename}</span>
            <div class="server-meta">
              <span>${file.sizeFormatted}</span>
              <span>•</span>
              <span>${dateFormatted}</span>
            </div>
          </div>
        </div>
        <div class="server-actions">
          <a href="${file.url}" target="_blank" download class="btn-action download" title="Download / Open File">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
          <button class="btn-action delete" data-filename="${file.filename}" title="Delete File">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      serverFilesList.appendChild(item);
    });

    // Attach delete listeners
    document.querySelectorAll('.btn-action.delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const filename = btn.getAttribute('data-filename');
        if (confirm(`Are you sure you want to delete "${filename}"?`)) {
          await deleteFile(filename);
        }
      });
    });
  }

  // Delete file from server
  async function deleteFile(filename) {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok) {
        showToast(data.message || 'File deleted successfully', 'success');
        fetchServerFiles();
      } else {
        showToast(data.error || 'Failed to delete file', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server', 'error');
    }
  }

  // Refresh server files button
  refreshBtn.addEventListener('click', () => {
    fetchServerFiles();
    showToast('Refreshed file list', 'info');
  });

  // Initial load
  fetchServerFiles();
});
