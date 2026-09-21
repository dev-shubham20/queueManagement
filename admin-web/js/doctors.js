// CareQueue Doctors Management & Approval Controller
document.addEventListener('DOMContentLoaded', () => {
  let allDoctors = [];
  let currentFilter = 'ALL';
  let searchQuery = '';
  let activeReviewDoctor = null;
  let activeRejectDoctor = null;

  // Check URL params for initial filter e.g. ?filter=PENDING or ?status=DEACTIVATED
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter') || urlParams.get('status');
  if (filterParam) {
    currentFilter = filterParam;
  }

  // Bind Search Input
  const searchInput = document.getElementById('doctor-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderDoctorsTable();
    });
  }

  // Bind Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    if (chip.dataset.filter === currentFilter) {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    }

    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderDoctorsTable();
    });
  });

  async function loadData() {
    const [doctors, stats] = await Promise.all([
      API.getDoctors(),
      API.getStats(),
    ]);

    if (doctors) {
      allDoctors = doctors;
      updateBadgesAndCounters(stats);
      renderDoctorsTable();
    }

    if (stats) {
      const docBadge = document.getElementById('sidebar-doc-count');
      if (docBadge) docBadge.textContent = stats.totalDoctors || 0;
      const patBadge = document.getElementById('sidebar-pat-count');
      if (patBadge) patBadge.textContent = stats.totalPatients || 0;
    }
  }

  function updateBadgesAndCounters(stats) {
    const activeCount = allDoctors.filter(d => d.status === 'ACTIVE').length;
    const suspendedCount = allDoctors.filter(d => d.status === 'SUSPENDED' || d.approvalStatus === 'SUSPENDED').length;
    const deactivatedCount = allDoctors.filter(d => d.status === 'DEACTIVATED' && d.approvalStatus !== 'PENDING' && d.approvalStatus !== 'SUSPENDED').length;
    const pendingCount = allDoctors.filter(d => d.approvalStatus === 'PENDING').length;
    const treatingCount = allDoctors.reduce((sum, d) => sum + (d.patientsCurrentlyTreating || 0), 0);

    const elTotal = document.getElementById('doc-stat-total');
    if (elTotal) elTotal.textContent = allDoctors.length;
    
    const elPending = document.getElementById('doc-stat-pending');
    if (elPending) elPending.textContent = pendingCount;

    const elActive = document.getElementById('doc-stat-active');
    if (elActive) elActive.textContent = activeCount;

    const elSuspended = document.getElementById('doc-stat-suspended');
    if (elSuspended) elSuspended.textContent = suspendedCount;

    const elDeact = document.getElementById('doc-stat-deactivated');
    if (elDeact) elDeact.textContent = deactivatedCount;

    const elTreat = document.getElementById('doc-stat-treating');
    if (elTreat) elTreat.textContent = treatingCount;

    const badgeAll = document.getElementById('badge-all');
    if (badgeAll) badgeAll.textContent = allDoctors.length;

    const badgePending = document.getElementById('badge-pending');
    if (badgePending) badgePending.textContent = pendingCount;

    const badgeActive = document.getElementById('badge-active');
    if (badgeActive) badgeActive.textContent = activeCount;

    const badgeSuspended = document.getElementById('badge-suspended');
    if (badgeSuspended) badgeSuspended.textContent = suspendedCount;

    const badgeDeactive = document.getElementById('badge-deactivated');
    if (badgeDeactive) badgeDeactive.textContent = deactivatedCount;

    // Visual pulse if pending approvals exist
    const chipPending = document.getElementById('chip-pending');
    if (chipPending) {
      if (pendingCount > 0) {
        chipPending.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
      } else {
        chipPending.style.boxShadow = 'none';
      }
    }
  }

  function renderDoctorsTable() {
    const tbody = document.getElementById('doctors-tbody');
    if (!tbody) return;

    const filtered = allDoctors.filter(doc => {
      // 1. Filter
      if (currentFilter === 'PENDING') {
        return doc.approvalStatus === 'PENDING';
      }
      if (currentFilter === 'SUSPENDED') {
        return doc.status === 'SUSPENDED' || doc.approvalStatus === 'SUSPENDED';
      }
      if (currentFilter === 'ACTIVE' && doc.status !== 'ACTIVE') return false;
      if (currentFilter === 'DEACTIVATED' && (doc.status !== 'DEACTIVATED' || doc.status === 'SUSPENDED' || doc.approvalStatus === 'SUSPENDED')) return false;

      // 2. Search
      if (searchQuery) {
        const matchesName = (doc.name || '').toLowerCase().includes(searchQuery);
        const matchesClinic = doc.clinicName ? doc.clinicName.toLowerCase().includes(searchQuery) : false;
        const matchesSpec = (doc.specialization || '').toLowerCase().includes(searchQuery);
        const matchesPhone = (doc.phone || '').includes(searchQuery);
        const matchesCity = doc.city ? doc.city.toLowerCase().includes(searchQuery) : false;
        const matchesLicense = doc.licenseNumber ? doc.licenseNumber.toLowerCase().includes(searchQuery) : false;
        return matchesName || matchesClinic || matchesSpec || matchesPhone || matchesCity || matchesLicense;
      }

      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 48px; color: var(--text-muted);">
            No doctors match the selected criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(doc => {
      const isSuspended = doc.status === 'SUSPENDED' || doc.approvalStatus === 'SUSPENDED';
      const isActive = doc.status === 'ACTIVE' && !isSuspended;
      const isPending = doc.approvalStatus === 'PENDING';
      const isRejected = doc.approvalStatus === 'REJECTED';

      return `
        <tr style="${isPending ? 'background-color: #FFFDF5;' : isSuspended ? 'background-color: #FAF5FF;' : ''}">
          <td>
            <div class="entity-profile">
              <div class="entity-avatar" style="background-color: ${isSuspended ? '#F3E8FF' : '#EFF6FF'}; color: ${isSuspended ? '#7C3AED' : '#2563EB'};">
                ${isSuspended ? '🚫' : '🩺'}
              </div>
              <div>
                <div class="entity-title" style="display: flex; align-items: center; gap: 6px;">
                  <span>${doc.name}</span>
                  ${isPending ? '<span class="pulse-badge">NEW REGISTRATION</span>' : ''}
                  ${isSuspended ? '<span class="pulse-badge" style="background:#F3E8FF; color:#6B21A8; border-color:#DDD6FE;">SUSPENDED</span>' : ''}
                </div>
                <div class="entity-sub">${doc.specialization} • Phone: ${doc.phone}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-weight: 600; color: #1E293B; font-size: 13px;">🏢 ${doc.clinicName || 'Private Practice'}</span>
          </td>
          <td>
            <div class="metric-pill">
              <span class="live-treating-pulse" style="display: ${doc.patientsCurrentlyTreating > 0 ? 'inline-block' : 'none'};"></span>
              <span style="color: #059669; font-weight: 800; font-size: 15px;">${doc.patientsCurrentlyTreating || 0}</span>
              <span style="font-size: 11px; color: var(--text-muted);">In Room</span>
            </div>
          </td>
          <td>
            <span style="font-weight: 800; color: #2563EB; font-size: 15px;">${doc.waitingQueueCount || 0}</span>
            <span style="font-size: 11px; color: var(--text-muted);">Waiting</span>
          </td>
          <td>
            <span style="font-weight: 700; color: var(--text-secondary);">${doc.totalPatientsTreated || 0}</span>
          </td>
          <td>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${doc.city || 'India'}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${doc.consultationFee || '₹500'} fee</div>
          </td>
          <td>
            ${isPending ? `
              <span class="badge badge-pending">
                ⏳ Pending Review
              </span>
            ` : isRejected ? `
              <span class="badge badge-rejected">
                ✕ Rejected
              </span>
            ` : isSuspended ? `
              <span class="badge" style="background-color: #F3E8FF; color: #6B21A8; border: 1px solid #DDD6FE; font-weight: 700;">
                🚫 Suspended
              </span>
            ` : `
              <span class="badge ${isActive ? 'badge-active' : 'badge-deactive'}" id="status-badge-${doc.id}">
                ${isActive ? '● Active (Live)' : '✕ Deactivated'}
              </span>
            `}
          </td>
          <td>
            ${isPending ? `
              <div style="display: flex; align-items: center; gap: 6px;">
                <button class="btn btn-review btn-sm" onclick="window.openReviewModal('${doc.id}')">
                  📋 Review
                </button>
                <button class="btn btn-approve btn-sm" style="padding: 6px 10px;" title="Approve Practice" onclick="window.approveDirectly('${doc.id}')">
                  ✓
                </button>
                <button class="btn btn-reject btn-sm" style="padding: 6px 10px;" title="Reject Practice" onclick="window.openRejectDialog('${doc.id}', '${doc.name.replace(/'/g, "\\'")}')">
                  ✕
                </button>
              </div>
            ` : isSuspended ? `
              <div style="display: flex; align-items: center; gap: 6px;">
                <button class="btn btn-approve btn-sm" style="background-color: #059669; color: #fff; font-size: 11px; padding: 4px 10px;" onclick="window.reactivateProvider('${doc.id}')">
                  ✓ Reactivate
                </button>
                <button class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 11px;" onclick="window.openReviewModal('${doc.id}')">
                  Details
                </button>
              </div>
            ` : `
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn btn-sm" style="background-color: #FEF2F2; color: #DC2626; border: 1px solid #FECACA; font-size: 11px; padding: 4px 8px; font-weight: 600;" onclick="window.suspendProvider('${doc.id}')">
                  🚫 Suspend
                </button>
                <div class="toggle-cell">
                  <label class="switch-control">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleDoctorStatus('${doc.id}', this)">
                    <span class="slider"></span>
                  </label>
                  <span class="toggle-status-text ${isActive ? 'text-active' : 'text-deactive'}" id="toggle-label-${doc.id}">
                    ${isActive ? 'Active' : 'Deactive'}
                  </span>
                </div>
                <button class="btn btn-outline btn-sm" style="padding: 4px 8px; font-size: 11px;" onclick="window.openReviewModal('${doc.id}')">
                  Details
                </button>
              </div>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Provider Lifecycle Actions: Suspend & Reactivate
  window.suspendProvider = async (id) => {
    const doc = allDoctors.find(d => d.id === id);
    const reason = prompt(`Reason for suspending ${doc ? doc.name : 'provider'}:`, 'Administrative review / policy enforcement');
    if (!reason) return;
    const res = await API.suspendDoctor(id, reason);
    if (res) {
      await loadData();
    }
  };

  window.reactivateProvider = async (id) => {
    const doc = allDoctors.find(d => d.id === id);
    if (!confirm(`Reactivate ${doc ? doc.name : 'provider'} and restore practice access?`)) return;
    const res = await API.reactivateDoctor(id);
    if (res) {
      await loadData();
    }
  };

  // Global toggle handler
  window.toggleDoctorStatus = async (id, checkbox) => {
    checkbox.disabled = true;
    const result = await API.toggleDoctorStatus(id);
    checkbox.disabled = false;

    if (result) {
      const idx = allDoctors.findIndex(d => d.id === id);
      if (idx > -1) {
        allDoctors[idx].status = result.status;
      }
      updateBadgesAndCounters();
      renderDoctorsTable();
    } else {
      checkbox.checked = !checkbox.checked;
    }
  };

  // Modal Handlers
  window.openReviewModal = (id) => {
    const doc = allDoctors.find(d => d.id === id);
    if (!doc) return;

    activeReviewDoctor = doc;
    const content = document.getElementById('review-modal-content');
    const isPending = doc.approvalStatus === 'PENDING';
    const isRejected = doc.approvalStatus === 'REJECTED';
    const isApproved = doc.approvalStatus === 'APPROVED';

    content.innerHTML = `
      <!-- Profile Header -->
      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border);">
        <div style="width: 56px; height: 56px; border-radius: 14px; background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 28px;">
          🩺
        </div>
        <div style="flex: 1;">
          <h3 style="font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${doc.name}</h3>
          <div style="font-size: 13px; color: var(--text-secondary); font-weight: 500;">
            ${doc.specialization} • ${doc.clinicName || 'Private Practice'}
          </div>
          ${doc.city ? `<div style="font-size: 12px; color: #2563EB; font-weight: 600; margin-top: 2px;">📍 ${doc.city}</div>` : ''}
        </div>
        <div>
          <span class="badge ${isPending ? 'badge-pending' : isRejected ? 'badge-rejected' : 'badge-approved'}" style="font-size: 12px; padding: 6px 12px;">
            ${isPending ? '⏳ Awaiting Approval' : isRejected ? '✕ Rejected' : '✓ Approved & Live'}
          </span>
        </div>
      </div>

      <!-- Overview Grid -->
      <div class="review-grid">
        <div class="review-item">
          <div class="review-label">Phone & Contact</div>
          <div class="review-value">${doc.phone}</div>
        </div>
        <div class="review-item">
          <div class="review-label">Email Address</div>
          <div class="review-value">${doc.email || 'Not provided'}</div>
        </div>
        <div class="review-item">
          <div class="review-label">Medical Registration / License</div>
          <div class="review-value" style="color: #2563EB; font-family: monospace;">${doc.licenseNumber || 'REG-MED-2026-PENDING'}</div>
        </div>
        <div class="review-item">
          <div class="review-label">Qualifications & Experience</div>
          <div class="review-value">${doc.qualifications || 'MBBS, MD'} (${doc.experience || '5 years'})</div>
        </div>
        <div class="review-item">
          <div class="review-label">Consultation Fee</div>
          <div class="review-value" style="color: #059669; font-weight: 700;">${doc.consultationFee || '₹500'}</div>
        </div>
        <div class="review-item">
          <div class="review-label">City & Location</div>
          <div class="review-value">${doc.city || 'Bangalore'}</div>
        </div>
      </div>

      <!-- Address Box -->
      <div style="background-color: #F8FAFC; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 16px;">
        <div class="review-label">Clinic Address</div>
        <div class="review-value">${doc.address || doc.clinicAddress || 'Main Clinic Facility, Healthcare Avenue'}</div>
      </div>

      <!-- Working Hours & Queue Settings -->
      <div style="background-color: #F8FAFC; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 16px;">
        <div class="review-label">Schedule & Queue Configuration</div>
        <div style="font-size: 13px; color: var(--text-secondary); margin-top: 4px; line-height: 1.6;">
          • Morning Session: ${doc.workingHours?.morningSession ? '09:00 AM - 01:00 PM' : 'Disabled'}<br>
          • Evening Session: ${doc.workingHours?.eveningSession ? '05:00 PM - 08:00 PM' : 'Disabled'}<br>
          • Walk-in Patients: ${doc.workingHours?.allowWalkIn ? 'Allowed' : 'Appointment Only'}
        </div>
      </div>

      <!-- Attached Verification Documents -->
      <div style="margin-bottom: 16px;">
        <div class="review-label" style="margin-bottom: 8px;">Submitted Verification Documents (2)</div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 6px; font-size: 12px; color: #4338CA; font-weight: 600;">
            📄 Medical_Registration_Cert.pdf
          </span>
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 6px; font-size: 12px; color: #4338CA; font-weight: 600;">
            🏢 Clinic_Establishment_Proof.pdf
          </span>
        </div>
      </div>

      ${doc.rejectionReason ? `
        <div style="background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius-sm); padding: 12px; margin-top: 12px;">
          <div style="color: #991B1B; font-weight: 700; font-size: 12px; margin-bottom: 4px;">PREVIOUS REJECTION REASON:</div>
          <div style="color: #7F1D1D; font-size: 13px;">${doc.rejectionReason}</div>
        </div>
      ` : ''}
    `;

    const btnApprove = document.getElementById('btn-modal-approve');
    const btnReject = document.getElementById('btn-modal-reject');

    if (btnApprove) btnApprove.style.display = isApproved ? 'none' : 'inline-flex';
    if (btnReject) btnReject.style.display = isRejected ? 'none' : 'inline-flex';

    const modal = document.getElementById('review-modal');
    if (modal) modal.classList.add('active');
  };

  window.closeReviewModal = () => {
    const modal = document.getElementById('review-modal');
    if (modal) modal.classList.remove('active');
    activeReviewDoctor = null;
  };

  window.confirmApproveFromModal = async () => {
    if (!activeReviewDoctor) return;
    const res = await API.approveDoctor(activeReviewDoctor.id);
    if (res) {
      window.closeReviewModal();
      await loadData();
    }
  };

  window.approveDirectly = async (id) => {
    const res = await API.approveDoctor(id);
    if (res) {
      await loadData();
    }
  };

  window.openRejectDialogFromModal = () => {
    if (!activeReviewDoctor) return;
    const doc = activeReviewDoctor;
    window.closeReviewModal();
    window.openRejectDialog(doc.id, doc.name);
  };

  window.openRejectDialog = (id, name) => {
    activeRejectDoctor = { id, name };
    const nameEl = document.getElementById('reject-doctor-name');
    if (nameEl) nameEl.textContent = name;
    const input = document.getElementById('reject-reason-input');
    if (input) input.value = '';
    const err = document.getElementById('reject-error-msg');
    if (err) err.style.display = 'none';

    const modal = document.getElementById('reject-modal');
    if (modal) modal.classList.add('active');
  };

  window.closeRejectModal = () => {
    const modal = document.getElementById('reject-modal');
    if (modal) modal.classList.remove('active');
    activeRejectDoctor = null;
  };

  window.submitRejection = async () => {
    if (!activeRejectDoctor) return;
    const input = document.getElementById('reject-reason-input');
    const reason = input ? input.value.trim() : '';

    if (!reason) {
      const err = document.getElementById('reject-error-msg');
      if (err) err.style.display = 'block';
      return;
    }

    const res = await API.rejectDoctor(activeRejectDoctor.id, reason);
    if (res) {
      window.closeRejectModal();
      await loadData();
    }
  };

  // Close modals on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeReviewModal();
      window.closeRejectModal();
    }
  });

  // Start live polling every 2.5s for real-time synchronization
  API.startLiveSync(loadData, 2500);
});
