import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';

export default function AddPatientScreen() {
  const router = useRouter();

  // State
  const [patientName, setPatientName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [session, setSession] = useState<'morning' | 'evening'>('morning');
  const [bookingType, setBookingType] = useState<'walk-in' | 'phone'>('walk-in');

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="Add Patient" leftIcon="back" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>New Registration</Text>
          <Text style={styles.subtitle}>Fill in the details to generate a queue token.</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>

          {/* Patient Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Patient Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter first and last name"
                placeholderTextColor="#94A3B8"
                value={patientName}
                onChangeText={setPatientName}
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="phone-portrait-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="+91 Enter Number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
              />
            </View>
          </View>

          {/* Select Doctor */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Doctor</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="medkit-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <Text style={{ flex: 1, fontSize: 15, color: '#475569' }}>Choose a physician</Text>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </View>
          </View>

          {/* Select Session */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Session</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[styles.toggleButton, session === 'morning' && styles.toggleButtonActive]}
                onPress={() => setSession('morning')}
              >
                <Ionicons
                  name="sunny-outline"
                  size={18}
                  color={session === 'morning' ? "#2563EB" : "#475569"}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.toggleButtonText, session === 'morning' && styles.toggleButtonTextActive]}>
                  Morning
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleButton, session === 'evening' && styles.toggleButtonActive]}
                onPress={() => setSession('evening')}
              >
                <Ionicons
                  name="moon-outline"
                  size={18}
                  color={session === 'evening' ? "#2563EB" : "#475569"}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.toggleButtonText, session === 'evening' && styles.toggleButtonTextActive]}>
                  Evening
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Booking Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Booking Type</Text>
            <View style={styles.toggleRow}>
              <Pressable
                style={[styles.toggleButton, bookingType === 'walk-in' && styles.toggleButtonActive]}
                onPress={() => setBookingType('walk-in')}
              >
                <Ionicons
                  name="walk-outline"
                  size={18}
                  color={bookingType === 'walk-in' ? "#2563EB" : "#475569"}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.toggleButtonText, bookingType === 'walk-in' && styles.toggleButtonTextActive]}>
                  Walk-in
                </Text>
              </Pressable>
              <Pressable
                style={[styles.toggleButton, bookingType === 'phone' && styles.toggleButtonActive]}
                onPress={() => setBookingType('phone')}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={bookingType === 'phone' ? "#2563EB" : "#475569"}
                  style={{ marginRight: 8 }}
                />
                <Text style={[styles.toggleButtonText, bookingType === 'phone' && styles.toggleButtonTextActive]}>
                  Phone
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={18} color="#2563EB" style={{ marginRight: 12, marginTop: 2 }} />
            <Text style={styles.infoText}>
              A token will be automatically generated upon registration and sent to the patient via SMS.
            </Text>
          </View>

        </View>

        {/* Buttons */}
        <Pressable style={styles.submitButton} onPress={() => router.back()}>
          <Text style={styles.submitButtonText}>Register & Generate Token</Text>
          <Ionicons name="ticket-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.push('/dashboard')}>
          <Text style={styles.cancelButtonText}>Cancel and Return to Dashboard</Text>
        </Pressable>

      </ScrollView>

      {/* Common Bottom Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatarImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Title Area
  titleArea: {
    marginTop: 12,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0052CC',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F8FAFC',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },

  // Toggle Buttons
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  toggleButtonActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  toggleButtonTextActive: {
    color: '#2563EB',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },

  // Buttons
  submitButton: {
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#0052CC',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginBottom: 12,
  },
  cancelButtonText: {
    color: '#0052CC',
    fontSize: 14,
    fontWeight: '700',
  },
});
