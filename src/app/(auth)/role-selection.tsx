import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import { MockDB } from '@/utils/storage';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const handlePatientSelect = async () => {
    const user = { phone: phone as string, role: 'PATIENT' as const, status: 'APPROVED' as const };
    await MockDB.addUser(user);
    await MockDB.setCurrentSession(user);
    router.replace('/(patient)/(tabs)/home');
  };

  const handleDoctorSelect = async () => {
    const user = { phone: phone as string, role: 'DOCTOR' as const, status: 'PENDING' as const };
    await MockDB.addUser(user);
    await MockDB.setCurrentSession(user);
    router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to CareQueue</Text>
        <Text style={styles.subtitle}>How would you like to use the app?</Text>

        <View style={styles.optionsContainer}>
          <Pressable style={styles.card} onPress={handlePatientSelect}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="person" size={32} color="#4F46E5" />
            </View>
            <Text style={styles.cardTitle}>I am a Patient</Text>
            <Text style={styles.cardDesc}>Book appointments and track live wait times.</Text>
          </Pressable>

          <Pressable style={styles.card} onPress={handleDoctorSelect}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFCCB' }]}>
              <Ionicons name="medkit" size={32} color="#65A30D" />
            </View>
            <Text style={styles.cardTitle}>I am a Doctor / Clinic</Text>
            <Text style={styles.cardDesc}>Manage your practice and live patient queue.</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
