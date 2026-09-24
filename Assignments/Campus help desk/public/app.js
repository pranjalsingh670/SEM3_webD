/**
 * Campus Help Desk - Interactive Application Script
 * Clean REST CRUD implementation using Fetch API:
 * - GET    /api/requests
 * - POST   /api/requests
 * - PUT    /api/requests/:id
 * - DELETE /api/requests/:id
 * No emojis used.
 */

// Global State
let allRequests = [];
let currentStatusFilter = 'All';
let requestToDelete = null;

// DOM Elements
const requestForm = document.getElementById('requestForm');
const requestsContainer = document.getElementById('requestsContainer');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const filterCategory = document.getElementById('filterCategory');
const statusTabs = document.getElementById('statusTabs');
const refreshBtn = document.getElementById('refreshBtn');

// Stat Counters
const statTotal = document.getElementById('statTotal');
const statPending = document.getElementById('statPending');
const statProgress = document.getElementById('statProgress');
const statResolved = document.getElementById('statResolved');

const tabCountAll = document.getElementById('tabCountAll');
const tabCountPending = document.getElementById('tabCountPending');
const tabCountProgress = document.getElementById('tabCountProgress');
const tabCountResolved = document.getElementById('tabCountResolved');

// Priority Cards
const priorityCards = document.querySelectorAll('.priority-card');
const prioritySelect = document.getElementById('priority');

// Character Counter
const descriptionInput = document.getElementById('description');
const charCount = document.getElementById('charCount');

// Edit Modal
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editForm = document.getElementById('editForm');
const editRequestId = document.getElementById('editRequestId');
const editStudentName = document.getElementById('editStudentName');
const editEmail = document.getElementById('editEmail');
const editCategory = document.getElementById('editCategory');
const editPriority = document.getElementById('editPriority');
const editStatus = document.getElementById('editStatus');
const editDescription = document.getElementById('editDescription');

// Delete Modal
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteTargetName = document.getElementById('deleteTargetName');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const toastIcon = document.getElementById('toastIcon');

// ==========================================================
// 1. GET ALL REQUESTS (Fetch API: GET)
// ==========================================================
async function fetchRequests() {
  try {
    const response = await fetch('/api/requests');
    if (!response.ok) {
      throw new Error(`Server returned status: ${response.status}`);
    }
    const data = await response.json();
    allRequests = Array.isArray(data) ? data : [];
    updateStats(allRequests);
    renderRequests();
  } catch (error) {
    console.error('Error fetching requests:', error);
    requestsContainer.innerHTML = `
      <div class="empty-box">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Could not load requests. Ensure the server is running on port 3000.</p>
        <button class="btn btn-ghost btn-sm" onclick="fetchRequests()" style="margin-top: 10px;">
          Try Again
        </button>
      </div>
    `;
    showToast('Failed to load requests from server', true);
  }
}

// ==========================================================
// 2. SUBMIT A NEW REQUEST (Fetch API: POST)
// ==========================================================
requestForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const studentName = document.getElementById('studentName').value.trim();
  const email = document.getElementById('email').value.trim();
  const category = document.getElementById('category').value;
  const priority = prioritySelect.value;
  const description = descriptionInput.value.trim();

  // Validate form
  if (!validateForm(studentName, email, category, priority, description)) {
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  const originalHtml = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Submitting...`;

  try {
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentName,
        email,
        category,
        priority,
        description,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit request');
    }

    showToast('Request submitted successfully');
    requestForm.reset();
    resetPriorityCards();
    updateCharCount();
    clearErrors();
    await fetchRequests();
  } catch (error) {
    console.error('Error submitting request:', error);
    showToast(error.message, true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
  }
});

// ==========================================================
// 3. UPDATE A REQUEST (Fetch API: PUT)
// ==========================================================

// Quick status change from card dropdown or Quick Resolve button
async function quickUpdateStatus(id, newStatus) {
  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update status');
    }

    showToast(`Status updated to "${newStatus}"`);
    await fetchRequests();
  } catch (error) {
    console.error('Error updating status:', error);
    showToast(error.message, true);
    fetchRequests();
  }
}

// Quick 1-click Resolve
async function quickResolve(id) {
  await quickUpdateStatus(id, 'Resolved');
}

// Open Edit Modal
function openEditModal(request) {
  editRequestId.value = request.id;
  editStudentName.value = request.studentName;
  editEmail.value = request.email;
  editCategory.value = request.category;
  editPriority.value = request.priority;
  editStatus.value = request.status || 'Pending';
  editDescription.value = request.description;

  editModal.classList.add('active');
  editModal.setAttribute('aria-hidden', 'false');
}

function closeEditDialog() {
  editModal.classList.remove('active');
  editModal.setAttribute('aria-hidden', 'true');
}

closeEditModal.addEventListener('click', closeEditDialog);
cancelEditBtn.addEventListener('click', closeEditDialog);
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) closeEditDialog();
});

// Submit Edit Form (PUT /api/requests/:id)
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = editRequestId.value;
  const payload = {
    studentName: editStudentName.value.trim(),
    email: editEmail.value.trim(),
    category: editCategory.value,
    priority: editPriority.value,
    status: editStatus.value,
    description: editDescription.value.trim(),
  };

  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update request');
    }

    closeEditDialog();
    showToast('Request updated successfully');
    await fetchRequests();
  } catch (error) {
    console.error('Error updating request:', error);
    showToast(error.message, true);
  }
});

// ==========================================================
// 4. DELETE A REQUEST (Fetch API: DELETE)
// ==========================================================
function promptDeleteRequest(id, studentName) {
  requestToDelete = id;
  deleteTargetName.textContent = studentName || 'this student';
  deleteModal.classList.add('active');
  deleteModal.setAttribute('aria-hidden', 'false');
}

function closeDeleteDialog() {
  deleteModal.classList.remove('active');
  deleteModal.setAttribute('aria-hidden', 'true');
  requestToDelete = null;
}

closeDeleteModal.addEventListener('click', closeDeleteDialog);
cancelDeleteBtn.addEventListener('click', closeDeleteDialog);
deleteModal.addEventListener('click', (e) => {
  if (e.target === deleteModal) closeDeleteDialog();
});

confirmDeleteBtn.addEventListener('click', async () => {
  if (!requestToDelete) return;

  const id = requestToDelete;
  try {
    const response = await fetch(`/api/requests/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete request');
    }

    closeDeleteDialog();
    showToast('Request deleted successfully');
    await fetchRequests();
  } catch (error) {
    console.error('Error deleting request:', error);
    showToast(error.message, true);
  }
});

// ==========================================================
// Priority Card Selector Logic
// ==========================================================
function selectPriority(val) {
  prioritySelect.value = val;
  priorityCards.forEach((card) => {
    card.classList.toggle('active', card.dataset.value === val);
  });
}

function resetPriorityCards() {
  prioritySelect.value = '';
  priorityCards.forEach((c) => c.classList.remove('active'));
}

priorityCards.forEach((card) => {
  card.addEventListener('click', () => {
    selectPriority(card.dataset.value);
  });
});

// Character Counter
function updateCharCount() {
  const len = descriptionInput.value.length;
  charCount.textContent = `${len} / 500`;
  if (len > 450) {
    charCount.style.color = 'var(--urgent)';
  } else {
    charCount.style.color = 'var(--text-dim)';
  }
}
descriptionInput.addEventListener('input', updateCharCount);

// ==========================================================
// Quick Demo Templates (No emojis)
// ==========================================================
window.fillTemplate = function (type) {
  const templates = {
    wifi: {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu',
      category: 'IT & Wi-Fi',
      priority: 'Urgent',
      desc: 'Wi-Fi access point in Hostel Block C (3rd Floor) keeps disconnecting every few minutes. Several students have online test submissions today.',
    },
    hostel: {
      name: 'Pooja Verma',
      email: 'pooja.verma@campus.edu',
      category: 'Hostel',
      priority: 'High',
      desc: 'Room 312 ceiling fan is vibrating aggressively and the speed regulator knob is jammed at maximum.',
    },
    mess: {
      name: 'Rohan Gupta',
      email: 'rohan.g@campus.edu',
      category: 'Mess & Canteen',
      priority: 'Medium',
      desc: 'Drinking water dispenser near table row 4 in North Mess is empty and requires refill and filter maintenance.',
    },
    library: {
      name: 'Karan Singh',
      email: 'karan.s@campus.edu',
      category: 'Library',
      priority: 'Low',
      desc: 'Digital library barcode is not registering properly at the main gate scanner. Need barcode re-validation.',
    },
  };

  const t = templates[type];
  if (!t) return;

  document.getElementById('studentName').value = t.name;
  document.getElementById('email').value = t.email;
  document.getElementById('category').value = t.category;
  descriptionInput.value = t.desc;

  selectPriority(t.priority);
  updateCharCount();
  clearErrors();
  showToast(`Loaded example: ${t.category}`);
};

// ==========================================================
// Render Requests & Filter
// ==========================================================
function renderRequests() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = filterCategory.value;

  // Toggle search clear button
  if (searchTerm) {
    clearSearchBtn.classList.add('active');
  } else {
    clearSearchBtn.classList.remove('active');
  }

  const filtered = allRequests.filter((req) => {
    const matchesSearch =
      !searchTerm ||
      (req.studentName && req.studentName.toLowerCase().includes(searchTerm)) ||
      (req.email && req.email.toLowerCase().includes(searchTerm)) ||
      (req.description && req.description.toLowerCase().includes(searchTerm)) ||
      (req.category && req.category.toLowerCase().includes(searchTerm));

    const matchesStatus =
      currentStatusFilter === 'All' || (req.status || 'Pending') === currentStatusFilter;

    const matchesCategory =
      selectedCategory === 'All' || req.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (filtered.length === 0) {
    requestsContainer.innerHTML = `
      <div class="empty-box">
        <i class="fa-regular fa-folder-open"></i>
        <p>No submitted requests found matching your filter.</p>
      </div>
    `;
    return;
  }

  requestsContainer.innerHTML = filtered
    .map((req) => {
      const priorityClass = getPriorityTagClass(req.priority);
      const statusClass = getStatusTagClass(req.status);
      const formattedDate = formatDate(req.createdAt);
      const initials = getInitials(req.studentName);

      const safeName = escapeHtml(req.studentName);
      const safeEmail = escapeHtml(req.email);
      const safeCategory = escapeHtml(req.category);
      const safePriority = escapeHtml(req.priority);
      const safeStatus = escapeHtml(req.status || 'Pending');
      const safeDesc = escapeHtml(req.description);

      const isResolved = safeStatus === 'Resolved';
      const cardPriorityClass = `priority-${(req.priority || 'low').toLowerCase()}`;

      return `
        <article class="request-card ${cardPriorityClass}" data-id="${req.id}">
          <div class="card-header-line">
            <div class="student-meta">
              <div class="avatar-badge">${initials}</div>
              <div class="student-details">
                <span class="student-name-text">${safeName}</span>
                <span class="student-email-text">
                  <a href="mailto:${safeEmail}">${safeEmail}</a>
                </span>
              </div>
            </div>

            <div class="badge-row">
              <span class="badge badge-category">${safeCategory}</span>
              <span class="badge ${priorityClass}">${safePriority}</span>
              <span class="badge ${statusClass}">${safeStatus}</span>
            </div>
          </div>

          <div class="card-desc-box">
            ${safeDesc}
          </div>

          <div class="card-footer-line">
            <span class="date-text">
              <i class="fa-regular fa-clock"></i> Submitted: ${formattedDate}
            </span>

            <div class="actions-group">
              <div class="status-changer">
                <label for="status-select-${req.id}">Status:</label>
                <select id="status-select-${req.id}" onchange="quickUpdateStatus('${req.id}', this.value)">
                  <option value="Pending" ${safeStatus === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="In Progress" ${safeStatus === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Resolved" ${safeStatus === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>
              </div>

              ${
                !isResolved
                  ? `<button class="btn btn-success btn-sm" onclick="quickResolve('${req.id}')" title="Mark request as resolved">
                      <i class="fa-solid fa-check"></i> Resolve
                    </button>`
                  : ''
              }

              <button class="btn btn-ghost btn-sm" onclick="handleEditClick('${req.id}')" title="Edit request">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>

              <button class="btn btn-danger btn-sm" onclick="promptDeleteRequest('${req.id}', '${safeName.replace(/'/g, "\\'")}')" title="Delete request">
                <i class="fa-regular fa-trash-can"></i> Delete
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
}

// Global bridges
window.handleEditClick = function (id) {
  const req = allRequests.find((r) => String(r.id) === String(id));
  if (req) {
    openEditModal(req);
  }
};
window.quickUpdateStatus = quickUpdateStatus;
window.quickResolve = quickResolve;
window.promptDeleteRequest = promptDeleteRequest;

// Filter Event Listeners
searchInput.addEventListener('input', renderRequests);
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  renderRequests();
  searchInput.focus();
});
filterCategory.addEventListener('change', renderRequests);

// Status Tabs
statusTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.status-tab');
  if (!tab) return;

  document.querySelectorAll('.status-tab').forEach((t) => t.classList.remove('active'));
  tab.classList.add('active');
  currentStatusFilter = tab.dataset.status;
  renderRequests();
});

refreshBtn.addEventListener('click', () => {
  fetchRequests();
  showToast('Requests refreshed');
});

// Reset Form Button
document.getElementById('resetBtn').addEventListener('click', () => {
  resetPriorityCards();
  clearErrors();
  setTimeout(updateCharCount, 10);
});

// Update Header Stats
function updateStats(requests) {
  const total = requests.length;
  const pending = requests.filter((r) => !r.status || r.status === 'Pending').length;
  const progress = requests.filter((r) => r.status === 'In Progress').length;
  const resolved = requests.filter((r) => r.status === 'Resolved').length;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statProgress.textContent = progress;
  statResolved.textContent = resolved;

  tabCountAll.textContent = total;
  tabCountPending.textContent = pending;
  tabCountProgress.textContent = progress;
  tabCountResolved.textContent = resolved;
}

// Tag Styling Classes (No emojis)
function getPriorityTagClass(priority) {
  switch ((priority || '').toLowerCase()) {
    case 'urgent':
      return 'badge-priority-urgent';
    case 'high':
      return 'badge-priority-high';
    case 'medium':
      return 'badge-priority-medium';
    default:
      return 'badge-priority-low';
  }
}

function getStatusTagClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'in progress':
      return 'badge-status-inprogress';
    case 'resolved':
      return 'badge-status-resolved';
    default:
      return 'badge-status-pending';
  }
}

function getInitials(name) {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(isoString) {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recently';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function validateForm(name, email, category, priority, description) {
  clearErrors();
  let isValid = true;

  if (!name) {
    showFieldError('nameError', 'Please enter student name');
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showFieldError('emailError', 'Please enter email address');
    isValid = false;
  } else if (!emailPattern.test(email)) {
    showFieldError('emailError', 'Please enter a valid email address');
    isValid = false;
  }

  if (!category) {
    showFieldError('categoryError', 'Please select a category');
    isValid = false;
  }

  if (!priority) {
    showFieldError('priorityError', 'Please pick a priority level');
    isValid = false;
  }

  if (!description || description.length < 5) {
    showFieldError('descriptionError', 'Description must be at least 5 characters');
    isValid = false;
  }

  return isValid;
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearErrors() {
  ['nameError', 'emailError', 'categoryError', 'priorityError', 'descriptionError'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

// Toast Popup
let toastTimer = null;
function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  toastMessage.textContent = message;

  if (isError) {
    toast.classList.add('toast-error');
    toastIcon.className = 'fa-solid fa-circle-exclamation toast-icon';
  } else {
    toast.classList.remove('toast-error');
    toastIcon.className = 'fa-solid fa-circle-check toast-icon';
  }

  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCharCount();
  fetchRequests();
});
