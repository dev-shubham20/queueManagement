import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';

export default function PatientsListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock patient data for the same day
  const patients = [
    { id: '1', name: 'Jonathan Henderson', age: 34, time: '09:00 AM', condition: 'Consultation', session: 'morning', token: '402' },
    { id: '2', name: 'Clara Oswald', age: 28, time: '10:30 AM', condition: 'General Checkup', session: 'morning', token: '403' },
    { id: '3', name: 'Arthur Williams', age: 45, time: '11:45 AM', condition: 'Follow-up', session: 'morning', token: '404' },
    { id: '4', name: 'Martha Jones', age: 31, time: '02:15 PM', condition: 'Vaccination', session: 'evening', token: '405' },
    { id: '5', name: 'Eleanor Shellstrop', age: 33, time: '03:30 PM', condition: 'Checkup', session: 'evening', token: '406' },
    { id: '6', name: 'Chidi Anagonye', age: 35, time: '05:00 PM', condition: 'Consultation', session: 'evening', token: '407' },
  ];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const morningPatients = filteredPatients.filter(p => p.session === 'morning');
  const eveningPatients = filteredPatients.filter(p => p.session === 'evening');

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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {morningPatients.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>MORNING SESSION ({morningPatients.length})</Text>
            <View style={styles.listContainer}>
              {morningPatients.map((patient, index) => (
                <View
                  key={patient.id}
                  style={[
                    styles.patientListItem,
                    index === morningPatients.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{patient.token}</Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>Age: {patient.age} • {patient.condition}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <Text style={styles.timeText}>{patient.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {eveningPatients.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>EVENING SESSION ({eveningPatients.length})</Text>
            <View style={styles.listContainer}>
              {eveningPatients.map((patient, index) => (
                <View
                  key={patient.id}
                  style={[
                    styles.patientListItem,
                    index === eveningPatients.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{patient.token}</Text>
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientDetails}>Age: {patient.age} • {patient.condition}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <Text style={styles.timeText}>{patient.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>

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
