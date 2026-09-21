import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';
import { MockDB, PatientRecord } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';

export default function PatientsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPatients = useCallback(async () => {
    try {
      // Prioritize live backend API with authenticated JWT scoping
      const remoteData = await RemoteAPI.getPatients();
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        setPatients(remoteData);
        return;
      }
      // Offline fallback if remote API returns empty or offline
      const localData = await MockDB.getPatients();
      setPatients(localData || []);
    } catch {
      try {
        const localData = await MockDB.getPatients();
        setPatients(localData || []);
      } catch {
        // Fallback handled
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();
    const interval = setInterval(loadPatients, 4000);
    return () => clearInterval(interval);
  }, [loadPatients]);

  const filteredPatients = patients.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.condition && p.condition.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.tokenNumber && p.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeOrWaiting = filteredPatients.filter(p => p.treatmentStatus === 'WAITING' || p.treatmentStatus === 'IN_CONSULTATION');
  const completedOrPast = filteredPatients.filter(p => p.treatmentStatus === 'COMPLETED' || p.treatmentStatus === 'REGISTERED');

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="Patients Directory" leftIcon="menu" rightElement="none" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients by name..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && patients.length === 0 ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={{ marginTop: 12, color: '#64748B' }}>Loading patient database...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {activeOrWaiting.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>ACTIVE & WAITING QUEUE ({activeOrWaiting.length})</Text>
              <View style={styles.listContainer}>
                {activeOrWaiting.map((patient, index) => (
                  <View
                    key={patient.id}
                    style={[
                      styles.patientListItem,
                      index === activeOrWaiting.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <View style={[styles.avatarCircle, patient.treatmentStatus === 'IN_CONSULTATION' && { backgroundColor: '#DCFCE7' }]}>
                      <Text style={[styles.avatarText, patient.treatmentStatus === 'IN_CONSULTATION' && { color: '#16A34A' }]}>
                        {patient.tokenNumber || 'TK'}
                      </Text>
                    </View>
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <Text style={styles.patientDetails}>Age: {patient.age} • {patient.condition || 'General'}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeLabel}>Status</Text>
                      <Text style={[
                        styles.timeText,
                        patient.treatmentStatus === 'IN_CONSULTATION' ? { color: '#16A34A' } : { color: '#2563EB' }
                      ]}>
                        {patient.treatmentStatus === 'IN_CONSULTATION' ? 'Serving' : 'Waiting'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {completedOrPast.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 8 }]}>COMPLETED & REGISTERED ({completedOrPast.length})</Text>
              <View style={styles.listContainer}>
                {completedOrPast.map((patient, index) => (
                  <View
                    key={patient.id}
                    style={[
                      styles.patientListItem,
                      index === completedOrPast.length - 1 && { borderBottomWidth: 0 }
                    ]}
                  >
                    <View style={[styles.avatarCircle, { backgroundColor: '#F1F5F9' }]}>
                      <Text style={[styles.avatarText, { color: '#64748B' }]}>
                        {patient.tokenNumber || 'TK'}
                      </Text>
                    </View>
                    <View style={styles.patientInfo}>
                      <Text style={styles.patientName}>{patient.name}</Text>
                      <Text style={styles.patientDetails}>Age: {patient.age} • {patient.condition || 'General'}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.timeLabel}>Status</Text>
                      <Text style={[styles.timeText, { color: '#64748B' }]}>
                        {patient.treatmentStatus}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

        </ScrollView>
      )}

      {/* Common Bottom Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  patientListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: 13,
    color: '#64748B',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
});
