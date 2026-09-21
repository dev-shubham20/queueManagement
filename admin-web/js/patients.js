// CareQueue Patients Management Controller
document.addEventListener('DOMContentLoaded', () => {
  let allPatients = [];
  let currentFilter = 'ALL';
  let searchQuery = '';

  // Search Input
  const searchInput = document.getElementById('patient-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderPatientsTable();
    });
  }

  // Filter Chips
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderPatientsTable();
    });
  });

  async function loadData() {
    const [patients, stats] = await Promise.all([
      API.getPatients(),
      API.getStats(),
    ]);

    if (patients) {
      allPatients = patients;
      updateCounters();
      renderPatientsTable();
    }

    if (stats) {
      const docBadge = document.getElementById('sidebar-doc-count');
      if (docBadge) docBadge.textContent = stats.totalDoctors || 0;
      const patBadge = document.getElementById('sidebar-pat-count');
      if (patBadge) patBadge.textContent = stats.totalPatients || 0;
    }
  }

  function updateCounters() {
    const consultation = allPatients.filter(p => p.treatmentStatus === 'IN_CONSULTATION').length;
    const waiting = allPatients.filter(p => p.treatmentStatus === 'WAITING').length;
    const completed = allPatients.filter(p => p.treatmentStatus === 'COMPLETED').length;
    const registered = allPatients.filter(p => p.treatmentStatus === 'REGISTERED').length;

    document.getElementById('pat-stat-total').textContent = allPatients.length;
    document.getElementById('pat-stat-consultation').textContent = consultation;
    document.getElementById('pat-stat-queue').textContent = waiting;
    document.getElementById('pat-stat-completed').textContent = completed;

    document.getElementById('badge-all').textContent = allPatients.length;
    document.getElementById('badge-consultation').textContent = consultation;
    document.getElementById('badge-waiting').textContent = waiting;
    document.getElementById('badge-completed').textContent = completed;
    document.getElementById('badge-registered').textContent = registered;
  }

  function renderPatientsTable() {
    const tbody = document.getElementById('patients-tbody');
    const filtered = allPatients.filter(p => {
      if (currentFilter !== 'ALL' && p.treatmentStatus !== currentFilter) {
        return false;
      }

      if (searchQuery) {
        const matchesName = p.name.toLowerCase().includes(searchQuery);
        const matchesPhone = p.phone.includes(searchQuery);
        const matchesDoc = p.assignedDoctorName ? p.assignedDoctorName.toLowerCase().includes(searchQuery) : false;
        const matchesClinic = p.clinicName ? p.clinicName.toLowerCase().includes(searchQuery) : false;
        const matchesToken = p.tokenNumber ? p.tokenNumber.toLowerCase().includes(searchQuery) : false;
        const matchesCond = p.condition ? p.condition.toLowerCase().includes(searchQuery) : false;
        return matchesName || matchesPhone || matchesDoc || matchesClinic || matchesToken || matchesCond;
      }

      return true;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 48px; color: var(--text-muted);">
            No patients match the selected filter or search query.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered.map(p => {
      const statusMeta = getStatusBadge(p.treatmentStatus);

      return `
        <tr>
          <td>
            <div class="entity-profile">
              <div class="entity-avatar" style="background-color: ${statusMeta.bg}; color: ${statusMeta.color}; font-weight: 800;">
                ${p.name.charAt(0)}
              </div>
              <div>
                <div class="entity-title">${p.name}</div>
                <div class="entity-sub">${p.age} yrs • ${p.gender} • +91 ${p.phone}</div>
              </div>
            </div>
          </td>
          <td>
            ${p.tokenNumber ? `<span class="token-tag">#${p.tokenNumber}</span>` : '<span style="color: var(--text-muted); font-size: 12px;">No token</span>'}
          </td>
          <td>
            <div style="font-size: 13px; font-weight: 600; color: var(--text-primary);">${p.condition || 'General Visit'}</div>
            <div style="font-size: 11px; color: var(--text-muted);">Registered: ${formatDate(p.registeredAt)}</div>
          </td>
          <td>
            <div style="font-size: 13px; font-weight: 700; color: #4338CA;">
              ${p.assignedDoctorName || 'Unassigned'}
            </div>
            ${p.clinicName ? `<div style="font-size: 11px; color: var(--text-muted);">${p.clinicName}</div>` : ''}
          </td>
          <td>
            <span style="font-weight: 700; color: var(--text-secondary);">${p.totalVisits || 1} visit${p.totalVisits !== 1 ? 's' : ''}</span>
          </td>
          <td>
            <span class="badge" style="background-color: ${statusMeta.bg}; color: ${statusMeta.color}; border: 1px solid ${statusMeta.border};">
              ${statusMeta.label}
            </span>
          </td>
          <td>
            ${renderActionButtons(p)}
          </td>
        </tr>
      `;
    }).join('');
  }

  function renderActionButtons(patient) {
    if (patient.treatmentStatus === 'WAITING') {
      return `
        <button class="btn btn-primary btn-sm" onclick="updatePatientStatus('${patient.id}', 'IN_CONSULTATION')">
          ▶ Call Patient
        </button>
      `;
    }
    if (patient.treatmentStatus === 'IN_CONSULTATION') {
      return `
        <button class="btn btn-sm" style="background-color: #10B981; color: #fff;" onclick="updatePatientStatus('${patient.id}', 'COMPLETED')">
          ✓ Complete
        </button>
      `;
    }
    if (patient.treatmentStatus === 'REGISTERED') {
      return `
        <button class="btn btn-outline btn-sm" onclick="updatePatientStatus('${patient.id}', 'WAITING')">
          + Add to Queue
        </button>
      `;
    }
    return `<span style="font-size: 12px; color: #10B981; font-weight: 600;">✓ Finished</span>`;
  }

  function getStatusBadge(status) {
    switch (status) {
      case 'IN_CONSULTATION':
        return { label: '● In Consultation', bg: '#FEF3C7', color: '#92400E', border: '#FCD34D' };
      case 'WAITING':
        return { label: '⏱ In Queue', bg: '#E0F2FE', color: '#0369A1', border: '#BAE6FD' };
      case 'COMPLETED':
        return { label: '✓ Completed', bg: '#DCFCE7', color: '#15803D', border: '#86EFAC' };
      case 'REGISTERED':
        return { label: '📝 Registered', bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
      default:
        return { label: status, bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    }
  }

  function formatDate(isoStr) {
    if (!isoStr) return 'Today';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recent';
    }
  }

  window.updatePatientStatus = async (id, status) => {
    const updated = await API.updatePatientStatus(id, status);
    if (updated) {
      const idx = allPatients.findIndex(p => p.id === id);
      if (idx > -1) {
        allPatients[idx].treatmentStatus = status;
      }
      updateCounters();
      renderPatientsTable();
    }
  };

  // Start live sync
  API.startLiveSync(loadData, 2500);
});
