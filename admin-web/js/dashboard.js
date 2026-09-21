// CareQueue Dashboard Controller
document.addEventListener('DOMContentLoaded', () => {
  async function refreshDashboard() {
    const [stats, doctors, patients] = await Promise.all([
      API.getStats(),
      API.getDoctors(),
      API.getPatients({ status: 'IN_CONSULTATION' }),
    ]);

    if (stats) {
      updateKpis(stats);
      updateDoctorPlatformStatus(stats);
      updateSidebarBadges(stats);
    }

    if (patients) {
      renderConsultationStream(patients);
    }

    if (doctors) {
      renderQuickDoctors(doctors.slice(0, 6));
    }
  }

  function updateKpis(stats) {
    document.getElementById('kpi-total-doctors').textContent = stats.totalDoctors || 0;
    document.getElementById('active-doc-badge').textContent = `${stats.activeDoctors || 0} Active`;
    document.getElementById('kpi-doc-breakdown').textContent = `Active: ${stats.activeDoctors || 0} • Pending: ${stats.pendingApprovals || 0}`;

    document.getElementById('kpi-treating-patients').textContent = stats.totalTreating || 0;
    document.getElementById('kpi-queue-count').textContent = `+ ${stats.totalQueue || 0} patients waiting in queues`;

    document.getElementById('kpi-total-patients').textContent = stats.totalPatients || 0;
    document.getElementById('kpi-completed-count').textContent = `${stats.patientsCompleted || 0} completed consultations`;

    const activeRatio = stats.totalDoctors > 0
      ? Math.round((stats.activeDoctors / stats.totalDoctors) * 100)
      : 100;
    document.getElementById('kpi-active-ratio').textContent = `${activeRatio}%`;
    document.getElementById('kpi-deactivated-count').textContent = `${stats.deactivatedDoctors || 0} deactivated accounts`;

    const pendingBanner = document.getElementById('pending-banner');
    if (pendingBanner) {
      if (stats.pendingApprovals > 0) {
        pendingBanner.style.display = 'flex';
        const pendingText = document.getElementById('pending-banner-text');
        if (pendingText) {
          pendingText.textContent = `New Doctor Registrations: ${stats.pendingApprovals} doctor profile(s) awaiting Super Admin review.`;
        }
      } else {
        pendingBanner.style.display = 'none';
      }
    }

    const banner = document.getElementById('deactivated-banner');
    if (stats.deactivatedDoctors > 0) {
      banner.style.display = 'flex';
      document.getElementById('deactivated-banner-text').textContent =
        `Attention: ${stats.deactivatedDoctors} doctor account(s) are currently deactivated and hidden from patient app.`;
    } else {
      banner.style.display = 'none';
    }
  }

  function updateDoctorPlatformStatus(stats) {
    const total = stats.totalDoctors || 1;
    const actPct = Math.round(((stats.activeDoctors || 0) / total) * 100);
    const pndPct = Math.round(((stats.pendingApprovals || 0) / total) * 100);

    const barAct = document.getElementById('ratio-bar-act');
    const barPnd = document.getElementById('ratio-bar-pnd');
    if (barAct) barAct.style.width = `${actPct}%`;
    if (barPnd) barPnd.style.width = `${pndPct}%`;

    const legAct = document.getElementById('legend-act-count');
    const legPnd = document.getElementById('legend-pnd-count');
    if (legAct) legAct.textContent = `${stats.activeDoctors || 0} (${actPct}%)`;
    if (legPnd) legPnd.textContent = `${stats.pendingApprovals || 0} (${pndPct}%)`;
  }

  function updateSidebarBadges(stats) {
    const docBadge = document.getElementById('sidebar-doc-count');
    if (docBadge) docBadge.textContent = stats.totalDoctors || 0;

    const patBadge = document.getElementById('sidebar-pat-count');
    if (patBadge) patBadge.textContent = stats.totalPatients || 0;
  }

  function renderConsultationStream(patients) {
    const container = document.getElementById('consultation-stream');
    if (!container) return;

    if (!patients || patients.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
          No patients are currently inside consultation rooms right now.
        </div>
      `;
      return;
    }

    container.innerHTML = patients.slice(0, 4).map(p => `
      <div class="stream-item">
        <div class="stream-left">
          <span class="token-tag">#${p.tokenNumber || 'GP'}</span>
          <div>
            <div class="stream-patient-name">${p.name} (${p.age}y, ${p.gender})</div>
            <div class="stream-doctor">Doctor: <strong>${p.assignedDoctorName || 'Physician'}</strong> ${p.clinicName ? '• ' + p.clinicName : ''}</div>
          </div>
        </div>
        <span class="badge badge-in-consultation">
          <span class="live-treating-pulse"></span> In Care
        </span>
      </div>
    `).join('');
  }

  function renderQuickDoctors(doctors) {
    const tbody = document.getElementById('quick-doctors-tbody');
    if (!doctors || doctors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No doctors found.</td></tr>`;
      return;
    }

    tbody.innerHTML = doctors.map(doc => {
      const isActive = doc.status === 'ACTIVE';

      return `
        <tr>
          <td>
            <div class="entity-profile">
              <div class="entity-avatar" style="background-color: #EFF6FF; color: #2563EB;">
                🩺
              </div>
              <div>
                <div class="entity-title">${doc.name}</div>
                <div class="entity-sub">${doc.specialization} • ${doc.city || 'India'}</div>
              </div>
            </div>
          </td>
          <td>
            <span style="font-weight: 600; color: #1E293B; font-size: 13px;">🏢 ${doc.clinicName || 'Private Practice'}</span>
          </td>
          <td>
            <div class="metric-pill">
              <span class="live-treating-pulse" style="display: ${doc.patientsCurrentlyTreating > 0 ? 'inline-block' : 'none'};"></span>
              <span style="color: #059669;">${doc.patientsCurrentlyTreating || 0}</span>
            </div>
          </td>
          <td>
            <span style="font-weight: 700; color: #2563EB;">${doc.waitingQueueCount || 0}</span>
          </td>
          <td>
            <span style="font-weight: 600; color: var(--text-secondary);">${doc.totalPatientsTreated || 0}</span>
          </td>
          <td>
            <span class="badge ${isActive ? 'badge-active' : 'badge-deactive'}" id="status-badge-${doc.id}">
              ${isActive ? '● Active' : '✕ Deactivated'}
            </span>
          </td>
          <td>
            <div class="toggle-cell">
              <label class="switch-control">
                <input type="checkbox" ${isActive ? 'checked' : ''} onchange="toggleDoctorStatus('${doc.id}', this)">
                <span class="slider"></span>
              </label>
              <span class="toggle-status-text ${isActive ? 'text-active' : 'text-deactive'}" id="toggle-label-${doc.id}">
                ${isActive ? 'Active' : 'Deactive'}
              </span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Global toggle handler
  window.toggleDoctorStatus = async (id, checkbox) => {
    checkbox.disabled = true;
    const result = await API.toggleDoctorStatus(id);
    checkbox.disabled = false;

    if (result) {
      const isActive = result.status === 'ACTIVE';
      const label = document.getElementById(`toggle-label-${id}`);
      const badge = document.getElementById(`status-badge-${id}`);

      if (label) {
        label.textContent = isActive ? 'Active' : 'Deactive';
        label.className = `toggle-status-text ${isActive ? 'text-active' : 'text-deactive'}`;
      }

      if (badge) {
        badge.textContent = isActive ? '● Active' : '✕ Deactivated';
        badge.className = `badge ${isActive ? 'badge-active' : 'badge-deactive'}`;
      }

      // Refresh overall KPIs immediately
      const stats = await API.getStats();
      if (stats) updateKpis(stats);
    } else {
      checkbox.checked = !checkbox.checked;
    }
  };

  // Start polling every 2.5s for real-time live sync with mobile app
  API.startLiveSync(refreshDashboard, 2500);
});
