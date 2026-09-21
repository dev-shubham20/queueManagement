import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const Storage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        console.error('Error reading from localStorage', e);
        return null;
      }
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from AsyncStorage', e);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error('Error writing to localStorage', e);
      }
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to AsyncStorage', e);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        console.error('Error removing from localStorage', e);
      }
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from AsyncStorage', e);
    }
  }
};

export interface UserData {
  id?: string;
  phone: string;
  email?: string;
  role: 'DOCTOR' | 'CLINIC' | 'RECEPTIONIST' | 'STAFF' | 'PATIENT' | 'SUPER_ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  permissions?: string[];
  name?: string;
  clinicId?: string;
  clinicName?: string;
  doctorId?: string;
  token?: string;
}

export interface QueueRecord {
  id: string;
  _id?: string;
  doctorId: string;
  clinicId?: string;
  doctorName: string;
  clinicName?: string;
  date: string;
  session: 'MORNING' | 'EVENING' | 'FULL_DAY';
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  isPaused: boolean;
  pauseReason?: string;
  pausedAt?: string;
  currentTokenNumber: string;
  currentTokenId?: string;
  nextTokenNumber: string;
  totalTokensIssued: number;
  totalTokensCompleted: number;
  totalEmergencyTokens: number;
}

export interface TokenRecord {
  id: string;
  _id?: string;
  tokenNumber: string;
  tokenType: 'REGULAR' | 'EMERGENCY';
  queueId: string;
  doctorId: string;
  clinicId?: string;
  patientId?: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  patientGender?: 'MALE' | 'FEMALE' | 'OTHER';
  condition?: string;
  source: 'APP_BOOKING' | 'WALK_IN_RECEPTIONIST';
  priority: number; // 0 for emergency, 1 for regular
  status: 'WAITING' | 'CALLED' | 'SERVING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';
  positionAhead: number;
  estimatedWaitMinutes: number;
  createdAt: string;
  calledAt?: string;
  servingStartedAt?: string;
  completedAt?: string;
}

export interface ReceptionistRecord {
  id: string;
  _id?: string;
  userId: string;
  clinicId: string;
  name: string;
  phone: string;
  email?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
  permissions: string[];
  shift?: {
    startTime: string;
    endTime: string;
    workDays: string[];
  };
}

export type DoctorType = 'INDIVIDUAL' | 'CLINIC';
export type DoctorStatus = 'ACTIVE' | 'DEACTIVATED';

export interface DoctorRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: DoctorType; // 'INDIVIDUAL' or 'CLINIC'
  clinicName?: string;
  specialization: string;
  experience?: string;
  qualifications?: string;
  licenseNumber?: string;
  ownerName?: string;
  ownerPhone?: string;
  clinicAddress?: string;
  profileImage?: string;
  documents?: Array<{ name: string; url: string; type?: string; uploadedAt?: string }>;
  workingHours?: any;
  status: DoctorStatus; // 'ACTIVE' or 'DEACTIVATED'
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  registeredAt: string;
  patientsCurrentlyTreating: number;
  waitingQueueCount: number;
  totalPatientsTreated: number;
  address?: string;
  city?: string;
  consultationFee?: string;
  rating?: number;
}

export type PatientTreatmentStatus = 'IN_CONSULTATION' | 'WAITING' | 'COMPLETED' | 'REGISTERED';

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  registeredAt: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  clinicName?: string;
  tokenNumber?: string;
  treatmentStatus: PatientTreatmentStatus;
  condition?: string;
  lastVisitDate?: string;
  totalVisits: number;
}

export interface ActiveTokenData {
  id: string;
  token: string;
  queueId?: string;
  doctorId: string;
  doctorName: string;
  clinicName?: string;
  specialty?: string;
  image?: string;
  fee?: string;
  appointmentDate?: string;
  session?: string;
  patientName: string;
  patientPhone: string;
  condition?: string;
  positionAhead: number;
  expectedTime: string;
  createdAt: string;
  status: PatientTreatmentStatus;
}

export interface AdminStats {
  totalDoctors: number;
  individualDoctors: number;
  clinicDoctors: number;
  activeDoctors: number;
  deactivatedDoctors: number;
  pendingApprovals?: number;
  approvedDoctors?: number;
  rejectedDoctors?: number;
  totalPatients: number;
  patientsInConsultation: number;
  patientsInQueue: number;
  patientsCompleted: number;
}

const DEFAULT_DOCTORS: DoctorRecord[] = [];

const DEFAULT_PATIENTS: PatientRecord[] = [];

export const MockDB = {
  async getUsers(): Promise<UserData[]> {
    const data = await Storage.getItem('mock_users');
    return data ? JSON.parse(data) : [];
  },
  async saveUsers(users: UserData[]): Promise<void> {
    await Storage.setItem('mock_users', JSON.stringify(users));
  },
  async getUserByPhone(phone: string, roleFilter?: string): Promise<UserData | undefined> {
    const users = await this.getUsers();
    if (roleFilter) {
      const match = users.find(u => u.phone === phone && u.role.toUpperCase() === roleFilter.toUpperCase());
      if (match) return match;

      if (['DOCTOR', 'CLINIC'].includes(roleFilter.toUpperCase())) {
        const doctors = await this.getDoctors();
        const doc = doctors.find(d => d.phone === phone);
        if (doc) {
          return {
            phone: doc.phone,
            name: doc.name,
            role: 'DOCTOR',
            status: (doc.status === 'ACTIVE' ? 'APPROVED' : doc.approvalStatus || 'APPROVED') as any,
          };
        }
      }
    }
    return users.find(u => u.phone === phone);
  },
  async addUser(user: UserData): Promise<void> {
    const users = await this.getUsers();
    const existingIndex = users.findIndex(u => u.phone === user.phone && u.role === user.role);
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    await this.saveUsers(users);
  },
  async updateUserStatus(phone: string, status: UserData['status']): Promise<void> {
    const users = await this.getUsers();
    const index = users.findIndex(u => u.phone === phone);
    if (index > -1) {
      users[index].status = status;
      await this.saveUsers(users);
    }
  },
  async setCurrentSession(user: UserData): Promise<void> {
    await Storage.setItem('current_user', JSON.stringify(user));
    await Storage.setItem('isLoggedIn', 'true');
  },
  async getCurrentSession(): Promise<UserData | null> {
    const data = await Storage.getItem('current_user');
    return data ? JSON.parse(data) : null;
  },
  async clearSession(): Promise<void> {
    await Storage.removeItem('current_user');
    await Storage.removeItem('isLoggedIn');
  },

  // ===== SUPER ADMIN DYNAMIC METHODS WITH REMOTE SYNC =====
  async getDoctors(): Promise<DoctorRecord[]> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.getDoctors();
      if (remote && Array.isArray(remote)) {
        await Storage.setItem('mock_doctors', JSON.stringify(remote));
        return remote;
      }
    } catch {
      // Fallback to local storage if remote server is not running
    }

    const data = await Storage.getItem('mock_doctors');
    if (!data) {
      await Storage.setItem('mock_doctors', JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(data);
    const cleaned = Array.isArray(parsed)
      ? parsed.filter((d: any) => !d.id?.match(/^doc-[1-7]$/))
      : [];
    if (cleaned.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
      await Storage.setItem('mock_doctors', JSON.stringify(cleaned));
    }
    return cleaned;
  },

  async saveDoctors(doctors: DoctorRecord[]): Promise<void> {
    await Storage.setItem('mock_doctors', JSON.stringify(doctors));
  },

  async toggleDoctorStatus(id: string): Promise<DoctorRecord | undefined> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.toggleDoctorStatus(id);
      if (remote) {
        const doctors = await this.getDoctors();
        const index = doctors.findIndex(d => d.id === id);
        if (index > -1) {
          doctors[index] = remote;
          await this.saveDoctors(doctors);
        }
        return remote;
      }
    } catch {}

    const doctors = await this.getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index > -1) {
      doctors[index].status = doctors[index].status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
      await this.saveDoctors(doctors);
      return doctors[index];
    }
    return undefined;
  },

  async addDoctor(doc: Partial<DoctorRecord>): Promise<DoctorRecord> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.addDoctor(doc);
      if (remote) {
        const doctors = await this.getDoctors();
        const existing = doctors.findIndex(d => d.id === remote.id);
        if (existing > -1) doctors[existing] = remote;
        else doctors.unshift(remote);
        await this.saveDoctors(doctors);
        return remote;
      }
    } catch {}

    const doctors = await this.getDoctors();
    const newDoc: DoctorRecord = {
      id: `doc-${Date.now()}`,
      name: doc.name || 'New Practitioner',
      phone: doc.phone || '9999999999',
      type: 'INDIVIDUAL',
      clinicName: doc.clinicName || 'Private Practice',
      specialization: doc.specialization || 'General Physician',
      experience: doc.experience || '5 years',
      status: doc.status || 'DEACTIVATED',
      approvalStatus: doc.approvalStatus || 'PENDING',
      registeredAt: new Date().toISOString(),
      patientsCurrentlyTreating: 0,
      waitingQueueCount: 0,
      totalPatientsTreated: 0,
      city: doc.city || 'Bangalore',
      consultationFee: doc.consultationFee || '₹500',
      rating: 5.0,
      ...doc,
    };
    doctors.unshift(newDoc);
    await this.saveDoctors(doctors);
    return newDoc;
  },

  async approveDoctor(id: string, approvedBy = 'Super Admin'): Promise<DoctorRecord | null> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.approveDoctor(id, approvedBy);
      if (remote) {
        const doctors = await this.getDoctors();
        const index = doctors.findIndex(d => d.id === id);
        if (index > -1) {
          doctors[index] = remote;
          await this.saveDoctors(doctors);
        }
        return remote;
      }
    } catch {}

    const doctors = await this.getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index > -1) {
      doctors[index].approvalStatus = 'APPROVED';
      doctors[index].status = 'ACTIVE';
      doctors[index].approvedAt = new Date().toISOString();
      doctors[index].approvedBy = approvedBy;
      await this.saveDoctors(doctors);
      return doctors[index];
    }
    return null;
  },

  async rejectDoctor(id: string, reason: string, rejectedBy = 'Super Admin'): Promise<DoctorRecord | null> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.rejectDoctor(id, reason, rejectedBy);
      if (remote) {
        const doctors = await this.getDoctors();
        const index = doctors.findIndex(d => d.id === id);
        if (index > -1) {
          doctors[index] = remote;
          await this.saveDoctors(doctors);
        }
        return remote;
      }
    } catch {}

    const doctors = await this.getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index > -1) {
      doctors[index].approvalStatus = 'REJECTED';
      doctors[index].status = 'DEACTIVATED';
      doctors[index].rejectionReason = reason;
      doctors[index].rejectedAt = new Date().toISOString();
      doctors[index].rejectedBy = rejectedBy;
      await this.saveDoctors(doctors);
      return doctors[index];
    }
    return null;
  },

  async getDoctorStatus(phoneOrId: string): Promise<Partial<DoctorRecord> | null> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.getDoctorStatus(phoneOrId);
      if (remote) return remote;
    } catch {}

    const doctors = await this.getDoctors();
    const found = doctors.find(d => d.phone === phoneOrId || d.id === phoneOrId);
    return found || null;
  },

  async resubmitDoctor(id: string, data: Partial<DoctorRecord>): Promise<DoctorRecord | null> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.resubmitDoctor(id, data);
      if (remote) {
        const doctors = await this.getDoctors();
        const index = doctors.findIndex(d => d.id === id);
        if (index > -1) {
          doctors[index] = remote;
          await this.saveDoctors(doctors);
        }
        return remote;
      }
    } catch {}

    const doctors = await this.getDoctors();
    const index = doctors.findIndex(d => d.id === id);
    if (index > -1) {
      doctors[index] = {
        ...doctors[index],
        ...data,
        approvalStatus: 'PENDING',
        status: 'DEACTIVATED',
      };
      await this.saveDoctors(doctors);
      return doctors[index];
    }
    return null;
  },

  async getPatients(): Promise<PatientRecord[]> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.getPatients();
      if (remote && Array.isArray(remote)) {
        await Storage.setItem('mock_patients', JSON.stringify(remote));
        return remote;
      }
    } catch {
      // Fallback to local
    }

    const data = await Storage.getItem('mock_patients');
    if (!data) {
      await Storage.setItem('mock_patients', JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(data);
    const cleaned = Array.isArray(parsed)
      ? parsed.filter((p: any) => !p.id?.match(/^pat-([1-9]|10)$/))
      : [];
    if (cleaned.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
      await Storage.setItem('mock_patients', JSON.stringify(cleaned));
    }
    return cleaned;
  },

  async savePatients(patients: PatientRecord[]): Promise<void> {
    await Storage.setItem('mock_patients', JSON.stringify(patients));
  },

  async addPatient(patient: Partial<PatientRecord>): Promise<PatientRecord> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.addPatient(patient);
      if (remote) {
        const patients = await this.getPatients();
        const existing = patients.findIndex(p => p.id === remote.id);
        if (existing > -1) patients[existing] = remote;
        else patients.unshift(remote);
        await this.savePatients(patients);
        return remote;
      }
    } catch {}

    const patients = await this.getPatients();
    const newPatient: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: patient.name || 'New Patient',
      phone: patient.phone || '9999999999',
      age: patient.age || 30,
      gender: patient.gender || 'OTHER',
      registeredAt: new Date().toISOString(),
      treatmentStatus: patient.treatmentStatus || 'WAITING',
      condition: patient.condition || 'General Consultation',
      totalVisits: 1,
      ...patient,
    };
    patients.unshift(newPatient);
    await this.savePatients(patients);
    return newPatient;
  },

  async updatePatientStatus(id: string, status: PatientTreatmentStatus): Promise<void> {
    try {
      const { RemoteAPI } = await import('./api');
      await RemoteAPI.updatePatientStatus(id, status);
    } catch {}

    const patients = await this.getPatients();
    const index = patients.findIndex(p => p.id === id);
    if (index > -1) {
      patients[index].treatmentStatus = status;
      await this.savePatients(patients);
    }
  },

  async getAdminStats(): Promise<AdminStats> {
    try {
      const { RemoteAPI } = await import('./api');
      const remote = await RemoteAPI.getStats();
      if (remote) return remote;
    } catch {}

    const doctors = await this.getDoctors();
    const patients = await this.getPatients();

    const individualDoctors = doctors.filter(d => d.type === 'INDIVIDUAL').length;
    const clinicDoctors = doctors.filter(d => d.type === 'CLINIC').length;
    const activeDoctors = doctors.filter(d => d.status === 'ACTIVE').length;
    const deactivatedDoctors = doctors.filter(d => d.status === 'DEACTIVATED').length;

    const patientsInConsultation = patients.filter(p => p.treatmentStatus === 'IN_CONSULTATION').length;
    const patientsInQueue = patients.filter(p => p.treatmentStatus === 'WAITING').length;
    const patientsCompleted = patients.filter(p => p.treatmentStatus === 'COMPLETED').length;

    const pendingApprovals = doctors.filter(d => d.approvalStatus === 'PENDING').length;
    const approvedDoctors = doctors.filter(d => d.approvalStatus === 'APPROVED').length;
    const rejectedDoctors = doctors.filter(d => d.approvalStatus === 'REJECTED').length;

    return {
      totalDoctors: doctors.length,
      individualDoctors,
      clinicDoctors,
      activeDoctors,
      deactivatedDoctors,
      pendingApprovals,
      approvedDoctors,
      rejectedDoctors,
      totalPatients: patients.length,
      patientsInConsultation,
      patientsInQueue,
      patientsCompleted,
    };
  },

  // ===== ACTIVE TOKEN HELPER METHODS FOR PATIENT APP =====
  async getActiveToken(): Promise<ActiveTokenData | null> {
    try {
      const active = await Storage.getItem('hasActiveToken');
      if (active !== 'true') return null;
      const raw = await Storage.getItem('activeTokenData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async setActiveToken(tokenData: ActiveTokenData): Promise<void> {
    await Storage.setItem('hasActiveToken', 'true');
    await Storage.setItem('activeTokenData', JSON.stringify(tokenData));
  },

  async clearActiveToken(): Promise<void> {
    await Storage.removeItem('hasActiveToken');
    await Storage.removeItem('activeTokenData');
  },

  async cancelActiveToken(patientId?: string): Promise<void> {
    try {
      const current = await this.getActiveToken();
      const targetId = patientId || current?.id;
      if (targetId) {
        await this.updatePatientStatus(targetId, 'CANCELLED' as any);
      }
      if (current) {
        const queueId = current.queueId || `queue-${current.doctorId}`;
        const tokenId = current.id;
        const { RemoteAPI } = await import('./api');
        await RemoteAPI.cancelToken(queueId, tokenId, 'Cancelled by patient');
      }
    } catch (err) {
      console.warn('cancelActiveToken warning:', err);
    }
    await this.clearActiveToken();
  },

  // ===== PRACTITIONER REGISTRATION DRAFT & LIFECYCLE =====
  async saveRegistrationDraft(partial: Partial<DoctorRecord>): Promise<void> {
    try {
      const existing = await this.getRegistrationDraft();
      const merged = { ...(existing || {}), ...partial };
      await Storage.setItem('doctor_registration_draft', JSON.stringify(merged));
    } catch (e) {
      console.error('Error saving registration draft:', e);
    }
  },

  async getRegistrationDraft(): Promise<Partial<DoctorRecord> | null> {
    try {
      const raw = await Storage.getItem('doctor_registration_draft');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async clearRegistrationDraft(): Promise<void> {
    await Storage.removeItem('doctor_registration_draft');
  },

  async setActiveRegistration(data: Partial<DoctorRecord>): Promise<void> {
    await Storage.setItem('active_doctor_registration', JSON.stringify(data));
  },

  async getActiveRegistration(): Promise<Partial<DoctorRecord> | null> {
    try {
      const raw = await Storage.getItem('active_doctor_registration');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  async clearActiveRegistration(): Promise<void> {
    await Storage.removeItem('active_doctor_registration');
  }
};
