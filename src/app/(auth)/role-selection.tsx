import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { SmartClinicLogo } from '@/components/ui/logo';

export default function WelcomeEntryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Branding */}
        <View style={styles.brandHeader}>
          <SmartClinicLogo size={52} color="#2563EB" hideText />
          <View style={styles.brandNameRow}>
            <Text style={[styles.brandName, { color: '#2563EB', fontWeight: '800' }]}>CareQueue</Text>
            <Text style={[styles.brandName, { color: '#0F172A', fontWeight: '400', marginLeft: 6 }]}>Health</Text>
          </View>
          <Text style={styles.badge}>Live Queue & Real-Time Token Platform</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to CareQueue</Text>
        <Text style={styles.subtitle}>Select your portal to continue with a dedicated experience</Text>

        {/* Entry Options */}
        <View style={styles.cardsContainer}>
          {/* 1. PATIENT PORTAL */}
          <Pressable
            style={({ pressed }) => [styles.card, styles.patientCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/patient-login')}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }]}>
                <Ionicons name="person" size={28} color="#4F46E5" />
              </View>
              <View style={styles.tagPatient}>
                <Text style={styles.tagPatientText}>PATIENT PORTAL</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>I am a Patient</Text>
            <Text style={styles.cardDesc}>
              Book appointments, get digital tokens, track live doctor consultation wait times, and view emergency queue slots.
            </Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionTextPatient}>Enter Patient Portal</Text>
              <Ionicons name="arrow-forward" size={18} color="#4F46E5" />
            </View>
          </Pressable>

          {/* 2. PRACTITIONER & CLINIC PORTAL */}
          <Pressable
            style={({ pressed }) => [styles.card, styles.doctorCard, pressed && styles.cardPressed]}
            onPress={() => router.push('/doctor-login')}
          >
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                <Ionicons name="medkit" size={28} color="#059669" />
              </View>
              <View style={styles.tagDoctor}>
                <Text style={styles.tagDoctorText}>DOCTOR / CLINIC / STAFF</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>I am a Doctor or Clinic</Text>
            <Text style={styles.cardDesc}>
              Call next tokens, pause/resume queues, issue walk-in & emergency priority tickets, and authorize front-desk receptionists.
            </Text>
            <View style={styles.actionRow}>
              <Text style={styles.actionTextDoctor}>Enter Practitioner Portal</Text>
              <Ionicons name="arrow-forward" size={18} color="#059669" />
            </View>
          </Pressable>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Ionicons name="shield-checkmark-outline" size={16} color="#94A3B8" />
          <Text style={styles.footerText}>Secured by MongoDB Atlas & CareQueue Real-Time Engine</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  brandName: {
    fontSize: 26,
    letterSpacing: -0.5,
  },
  badge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    maxWidth: 340,
  },
  cardsContainer: {
    width: '100%',
    maxWidth: 420,
    gap: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },
  patientCard: {
    borderColor: '#E0E7FF',
  },
  doctorCard: {
    borderColor: '#D1FAE5',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagPatient: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagPatientText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagDoctor: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagDoctorText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: 18,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  actionTextPatient: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  actionTextDoctor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
