import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Platform,
  Image,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';

export default function StaffPermissionsScreen() {
  const router = useRouter();

  // State for permissions
  const [queueManagement, setQueueManagement] = useState(true);
  const [patientRecords, setPatientRecords] = useState(true);
  const [billing, setBilling] = useState(false);
  const [administrative, setAdministrative] = useState(false);

  // Custom Checkbox component to match the circular blue check design
  const CircularCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) => {
    return (
      <Pressable onPress={() => onChange(!checked)}>
        {checked ? (
          <View style={styles.checkboxChecked}>
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          </View>
        ) : (
          <View style={styles.checkboxUnchecked} />
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="Clinic Setup" leftIcon="back" rightElement="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color="#9CA3AF" />
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Dr. Sarah Jenkins</Text>
              <View style={styles.profileSubtitleRow}>
                <Text style={styles.profileSubtitleGray}>Senior Practitioner</Text>
                <Text style={styles.profileSubtitleDot}> • </Text>
                <Text style={styles.profileSubtitleBlue}>General GP</Text>
              </View>
              <View style={styles.pillsRow}>
                <View style={styles.pillPurple}>
                  <Text style={styles.pillPurpleText}>ID: STF-9920</Text>
                </View>
                <View style={styles.pillGray}>
                  <Text style={styles.pillGrayText}>Active since 2021</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>ACCESS PERMISSIONS</Text>
          <Text style={styles.customRoleText}>Custom Role</Text>
        </View>

        {/* Permission Cards */}
        {/* Queue Management */}
        <View style={styles.permissionCardActive}>
          <View style={styles.permissionCardBorderLeft} />
          <View style={styles.permissionHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="list" size={20} color="#2563EB" />
            </View>
            <View style={styles.permissionTitleContainer}>
              <Text style={styles.permissionTitle}>Queue Management</Text>
              <Text style={styles.permissionSubtitle}>Check-in and call patients</Text>
            </View>
            <CircularCheckbox checked={queueManagement} onChange={setQueueManagement} />
          </View>
          <Text style={styles.permissionDesc}>
            Allows the user to prioritize patients, change status, and manage wait times in real-time.
          </Text>
        </View>

        {/* Patient Records */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="people" size={20} color="#475569" />
            </View>
            <View style={styles.permissionTitleContainer}>
              <Text style={styles.permissionTitle}>Patient Records</Text>
              <Text style={styles.permissionSubtitle}>Access medical histories</Text>
            </View>
            <CircularCheckbox checked={patientRecords} onChange={setPatientRecords} />
          </View>
          <Text style={styles.permissionDesc}>
            Full access to sensitive patient data, diagnostics, and previous consultation notes.
          </Text>
        </View>

        {/* Billing & Payments */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="cash-outline" size={20} color="#059669" />
            </View>
            <View style={styles.permissionTitleContainer}>
              <Text style={styles.permissionTitle}>Billing & Payments</Text>
              <Text style={styles.permissionSubtitle}>Process clinic invoices</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setBilling}
              value={billing}
            />
          </View>
          <Text style={styles.permissionDesc}>
            Handle insurance claims, card processing, and daily financial reporting.
          </Text>
        </View>

        {/* Administrative Access */}
        <View style={styles.permissionCard}>
          <View style={styles.permissionHeaderRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="settings-outline" size={20} color="#DC2626" />
            </View>
            <View style={styles.permissionTitleContainer}>
              <Text style={styles.permissionTitle}>Administrative Access</Text>
              <Text style={styles.permissionSubtitle}>Modify clinic-wide settings</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setAdministrative}
              value={administrative}
            />
          </View>
          <Text style={styles.permissionDesc}>
            Critical access to system-wide configurations, staff accounts, and security logs.
          </Text>
        </View>

        {/* Action Buttons */}
        <Pressable style={styles.updateButton} onPress={() => router.back()}>
          <Text style={styles.updateButtonText}>Update Permissions</Text>
          <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel Changes</Text>
        </Pressable>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#4B5563" style={{ marginRight: 12, marginTop: 2 }} />
          <Text style={styles.infoText}>
            Changes to user permissions are logged for auditing. Dr. Sarah Jenkins will receive a notification and may need to re-login to see updated access levels.
          </Text>
        </View>

      </ScrollView>

      {/* App Bottom Tab Bar */}
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
    color: '#2563EB',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 24,
    marginTop: 8,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  profileSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileSubtitleGray: {
    fontSize: 13,
    color: '#64748B',
  },
  profileSubtitleDot: {
    fontSize: 13,
    color: '#64748B',
    marginHorizontal: 4,
  },
  profileSubtitleBlue: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillPurple: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  pillPurpleText: {
    color: '#4F46E5',
    fontSize: 11,
    fontWeight: '600',
  },
  pillGray: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillGrayText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  customRoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Permission Cards
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  permissionCardActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFF6FF',
    position: 'relative',
    overflow: 'hidden',
  },
  permissionCardBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#2563EB',
  },
  permissionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionTitleContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  permissionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  permissionDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },

  // Circular Checkbox
  checkboxChecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxUnchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },

  // Buttons
  updateButton: {
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 24,
  },
  cancelButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
