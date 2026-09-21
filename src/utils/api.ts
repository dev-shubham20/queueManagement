import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { DoctorRecord, PatientRecord, AdminStats, Storage } from './storage';

// Live Render Production Backend URL
export const PRODUCTION_API_URL = 'https://queuemanagement-api.onrender.com';

// Determine the best API base URL depending on platform & environment
function getApiBaseUrl(): string {
  // Use explicit environment override if provided via Expo Constants extra
  const customUrl = Constants.expoConfig?.extra?.apiUrl;
  if (customUrl) {
    return customUrl;
  }

  // Default to live production Render backend for all mobile (Android/iOS) and web clients
  return PRODUCTION_API_URL;
}

export const API_BASE_URL = getApiBaseUrl();

let cachedToken: string | null = null;

export const RemoteAPI = {
  async setAuthToken(token: string) {
    cachedToken = token;
    await Storage.setItem('auth_token', token);
  },

  async getAuthToken(): Promise<string | null> {
    if (cachedToken) return cachedToken;
    cachedToken = await Storage.getItem('auth_token');
    return cachedToken;
  },

  async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = await this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getStats(): Promise<AdminStats | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/stats`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async login(phone: string, password?: string, role?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, role }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.token) {
        await this.setAuthToken(data.token);
      }
      return data;
    } catch {
      return null;
    }
  },

  async register(payload: Record<string, any>) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (data.token) {
        await this.setAuthToken(data.token);
      }
      return data;
    } catch {
      return null;
    }
  },

  async getDoctors(query?: string): Promise<DoctorRecord[] | null> {
    try {
      const url = query ? `${API_BASE_URL}/api/doctors?${query}` : `${API_BASE_URL}/api/doctors`;
      const headers = await this.getHeaders();
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async addDoctor(doc: Partial<DoctorRecord>): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors`, {
        method: 'POST',
        headers,
        body: JSON.stringify(doc),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async toggleDoctorStatus(id: string): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/${id}/toggle`, {
        method: 'PATCH',
        headers,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async registerDoctor(payload: Record<string, any>): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Try fallback to /api/doctors if /register is 404
        const fallbackRes = await fetch(`${API_BASE_URL}/api/doctors`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        if (!fallbackRes.ok) return null;
        return await fallbackRes.json();
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async getPendingDoctors(): Promise<DoctorRecord[]> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/providers/pending`, { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async getDoctorById(id: string): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/providers/${id}`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async approveDoctor(id: string, approvedBy = 'Super Admin'): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/providers/${id}/approve`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ approvedBy }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async rejectDoctor(id: string, reason: string, rejectedBy = 'Super Admin'): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/admin/providers/${id}/reject`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason, rejectedBy }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getDoctorStatus(phoneOrId: string): Promise<Partial<DoctorRecord> | null> {
    try {
      const param = phoneOrId.startsWith('doc-') ? `id=${encodeURIComponent(phoneOrId)}` : `phone=${encodeURIComponent(phoneOrId)}`;
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/providers/status?${param}`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async resubmitDoctor(id: string, data: Record<string, any>): Promise<DoctorRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/providers/${id}/resubmit`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getPatients(query?: string): Promise<PatientRecord[] | null> {
    try {
      const url = query ? `${API_BASE_URL}/api/patients?${query}` : `${API_BASE_URL}/api/patients`;
      const headers = await this.getHeaders();
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async addPatient(patient: Partial<PatientRecord>): Promise<PatientRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/patients`, {
        method: 'POST',
        headers,
        body: JSON.stringify(patient),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async updatePatientStatus(id: string, status: string): Promise<PatientRecord | null> {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/patients/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ treatmentStatus: status }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getAppointments(params?: { doctorId?: string; patientPhone?: string; status?: string }) {
    try {
      const query = params ? new URLSearchParams(params as any).toString() : '';
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/appointments?${query}`, { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async bookAppointment(bookingData: Record<string, any>) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/appointments/book`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async savePrescription(appointmentId: string, prescription: Record<string, any>) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/prescription`, {
        method: 'POST',
        headers,
        body: JSON.stringify(prescription),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async getNotifications(role?: string, phone?: string) {
    try {
      const params = new URLSearchParams();
      if (role) params.set('role', role);
      if (phone) params.set('phone', phone);
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/notifications?${params.toString()}`, { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async markNotificationRead(id: string) {
    try {
      const headers = await this.getHeaders();
      await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers,
      });
    } catch {}
  },

  // ===== CHECK USER ACCOUNT EXISTENCE =====
  async checkUser(phoneOrId: string, role?: string): Promise<{ exists: boolean; role?: string; name?: string; status?: string; error?: string; mismatch?: boolean; actualRole?: string }> {
    try {
      const clean = phoneOrId.trim();
      const params = new URLSearchParams({ phone: clean });
      if (role) params.set('role', role);
      const res = await fetch(`${API_BASE_URL}/api/auth/check-user?${params.toString()}`);
      if (!res.ok) {
        return { exists: false, error: 'Could not verify account status' };
      }
      return await res.json();
    } catch {
      return { exists: false, error: 'Network error checking user' };
    }
  },

  // ===== DEDICATED PATIENT AUTHENTICATION =====
  async patientRegister(payload: { name: string; phone: string; age?: number; gender?: string; condition?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/patient/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      if (data.token) {
        await this.setAuthToken(data.token);
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  async patientLogin(phone: string, otp?: string, name?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/patient/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.token) {
        await this.setAuthToken(data.token);
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // ===== DEDICATED PRACTITIONER & RECEPTIONIST AUTHENTICATION =====
  async doctorLogin(identifier: string, password?: string, isOtp = false) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/doctor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, isOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Practitioner login failed');
      if (data.token) {
        await this.setAuthToken(data.token);
      }
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // ===== RECEPTIONIST MANAGEMENT =====
  async authorizeReceptionist(payload: { name: string; phone: string; email?: string; password?: string; permissions?: string[] }) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/receptionists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to authorize receptionist');
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  async getReceptionists() {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/receptionists`, { headers });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateReceptionistPermissions(receptionistId: string, permissions: string[]) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/receptionists/${receptionistId}/permissions`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ permissions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update receptionist permissions');
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  // ===== REAL-TIME QUEUE OPERATIONS =====
  async getDoctorActiveQueue(doctorId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/active-queue`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async pauseQueue(queueId: string, reason?: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/pause`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async resumeQueue(queueId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/resume`, {
        method: 'PATCH',
        headers,
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async callNextToken(queueId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/call-next`, {
        method: 'POST',
        headers,
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async serveToken(queueId: string, tokenId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/tokens/${tokenId}/serve`, {
        method: 'PATCH',
        headers,
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async completeToken(queueId: string, tokenId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/tokens/${tokenId}/complete`, {
        method: 'PATCH',
        headers,
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async skipToken(queueId: string, tokenId: string, reason?: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/tokens/${tokenId}/skip`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async cancelToken(queueId: string, tokenId: string, reason?: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}/tokens/${tokenId}/cancel`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ reason }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async getQueue(queueId: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/queues/${queueId}`, { headers });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // ===== TOKEN CREATION & SEARCH =====
  async bookRegularToken(payload: { doctorId: string; patientName: string; patientPhone: string; patientAge?: number; patientGender?: string; condition?: string; source?: string }) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/tokens/regular`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book token');
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  async bookEmergencyToken(payload: { doctorId: string; patientName: string; patientPhone: string; condition?: string }) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/tokens/emergency`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to book emergency token');
      return data;
    } catch (err: any) {
      throw err;
    }
  },

  async getMyToken(phone: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/tokens/my-token?phone=${encodeURIComponent(phone)}`, { headers });
      if (!res.ok) return { activeToken: null };
      return await res.json();
    } catch {
      return { activeToken: null };
    }
  },

  async searchPatientByPhone(phone: string) {
    try {
      const headers = await this.getHeaders();
      const res = await fetch(`${API_BASE_URL}/api/patients/search?phone=${encodeURIComponent(phone)}`, { headers });
      const data = await res.json();
      if (!res.ok) {
        return {
          patient: null,
          activeToken: null,
          status: res.status,
          error: data?.error || data?.message || 'Patient not found',
          notFound: res.status === 404,
          forbidden: res.status === 403,
        };
      }
      return {
        patient: data.patient,
        activeToken: data.activeToken,
        status: res.status,
        notFound: false,
      };
    } catch (err: any) {
      return {
        patient: null,
        activeToken: null,
        status: 500,
        error: err.message || 'Network error searching patient',
        notFound: false,
      };
    }
  }
};

