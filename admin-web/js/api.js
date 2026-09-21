// CareQueue Super Admin Web API Client
const API_BASE = window.location.origin.includes('http')
  ? window.location.origin
  : 'http://localhost:5001';

const API = {
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('superadmin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/api/stats`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch stats');
      return await res.json();
    } catch (err) {
      console.error('API Error [getStats]:', err);
      return null;
    }
  },

  async getDoctors(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/api/doctors?${query}`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch doctors');
      return await res.json();
    } catch (err) {
      console.error('API Error [getDoctors]:', err);
      return [];
    }
  },

  async toggleDoctorStatus(doctorId) {
    try {
      const res = await fetch(`${API_BASE}/api/doctors/${doctorId}/toggle`, {
        method: 'PATCH',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error('Failed to toggle doctor status');
      const data = await res.json();
      API.showToast(
        `${data.name} is now ${data.status === 'ACTIVE' ? 'Active & Live' : 'Deactivated'}!`,
        data.status === 'ACTIVE' ? 'success' : 'warning'
      );
      return data;
    } catch (err) {
      console.error('API Error [toggleDoctorStatus]:', err);
      API.showToast('Failed to update status', 'error');
      return null;
    }
  },

  async getPendingDoctors() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/pending`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch pending approvals');
      return await res.json();
    } catch (err) {
      console.error('API Error [getPendingDoctors]:', err);
      return [];
    }
  },

  async getDoctorById(id) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/${id}`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch provider details');
      return await res.json();
    } catch (err) {
      console.error('API Error [getDoctorById]:', err);
      return null;
    }
  },

  async approveDoctor(id, approvedBy = 'Super Admin') {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/${id}/approve`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ approvedBy }),
      });
      if (!res.ok) throw new Error('Failed to approve provider');
      const data = await res.json();
      API.showToast(`✓ ${data.name || 'Practice'} approved & activated!`, 'success');
      return data;
    } catch (err) {
      console.error('API Error [approveDoctor]:', err);
      API.showToast('Failed to approve doctor', 'error');
      return null;
    }
  },

  async rejectDoctor(id, reason, rejectedBy = 'Super Admin') {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/${id}/reject`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason, rejectedBy }),
      });
      if (!res.ok) throw new Error('Failed to reject provider');
      const data = await res.json();
      API.showToast(`Application rejected. Reason sent to provider.`, 'warning');
      return data;
    } catch (err) {
      console.error('API Error [rejectDoctor]:', err);
      API.showToast('Failed to reject application', 'error');
      return null;
    }
  },

  async suspendDoctor(id, reason = 'Suspended by Super Admin') {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/${id}/suspend`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to suspend provider');
      }
      const data = await res.json();
      API.showToast(`Provider suspended successfully`, 'warning');
      return data;
    } catch (err) {
      console.error('API Error [suspendDoctor]:', err);
      API.showToast(err.message || 'Failed to suspend provider', 'error');
      return null;
    }
  },

  async reactivateDoctor(id) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/providers/${id}/reactivate`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to reactivate provider');
      }
      const data = await res.json();
      API.showToast(`Provider reactivated & active!`, 'success');
      return data;
    } catch (err) {
      console.error('API Error [reactivateDoctor]:', err);
      API.showToast(err.message || 'Failed to reactivate provider', 'error');
      return null;
    }
  },

  async getPatients(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/api/patients?${query}`, { headers: this.getHeaders() });
      if (!res.ok) throw new Error('Failed to fetch patients');
      return await res.json();
    } catch (err) {
      console.error('API Error [getPatients]:', err);
      return [];
    }
  },

  async updatePatientStatus(patientId, status) {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${patientId}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ treatmentStatus: status }),
      });
      if (!res.ok) throw new Error('Failed to update patient status');
      const data = await res.json();
      API.showToast(`Patient status changed to ${status}`, 'success');
      return data;
    } catch (err) {
      console.error('API Error [updatePatientStatus]:', err);
      API.showToast('Failed to update patient status', 'error');
      return null;
    }
  },

  // Toast Notification Helper
  showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠' : 'ℹ';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Polling helper for real-time synchronization with mobile app
  startLiveSync(callback, intervalMs = 2500) {
    callback();
    return setInterval(callback, intervalMs);
  }
};
