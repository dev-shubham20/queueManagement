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
  TextInput,
  Platform,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';

export default function AddStaffScreen() {
  const router = useRouter();

  // State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  // Permissions State
  const [manageQueue, setManageQueue] = useState(true);
  const [patientRecords, setPatientRecords] = useState(false);
  const [billingAccess, setBillingAccess] = useState(false);
  const [clinicSettings, setClinicSettings] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </Pressable>
        <Text style={styles.headerTitle}>Clinic Setup</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title Area */}
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>Add New Staff</Text>
          <Text style={styles.subtitle}>Configure details and access permissions for your new team member.</Text>
        </View>

        {/* Avatar Upload */}
        <View style={styles.avatarUploadContainer}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-add-outline" size={32} color="#64748B" />
          </View>
          <View style={styles.cameraIconBadge}>
            <Ionicons name="camera" size={12} color="#FFFFFF" />
          </View>
        </View>

        {/* STAFF DETAILS */}
        <Text style={styles.sectionTitle}>STAFF DETAILS</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Dr. Sarah Chen"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Position (Determines Access Level)</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.placeholderText}>Select a role</Text>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.prefixText}>+91</Text>
            <TextInput
              style={[styles.textInput, { paddingLeft: 8 }]}
              placeholder="Enter Mobile Number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>
          <Text style={styles.helperTextBlue}>Staff will use this number to sign in.</Text>
        </View>

        {/* ROLE-BASED PERMISSIONS */}
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>ROLE-BASED PERMISSIONS</Text>
        
        <View style={styles.permissionsContainer}>
          
          {/* Manage Queue */}
          <View style={styles.permissionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="list" size={20} color="#2563EB" />
            </View>
            <View style={styles.permissionTextContent}>
              <Text style={styles.permissionTitle}>Manage Queue</Text>
              <Text style={styles.permissionSubtitle}>Check-in and move patients</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setManageQueue}
              value={manageQueue}
            />
          </View>

          <View style={styles.divider} />

          {/* Patient Records */}
          <View style={styles.permissionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="medical" size={20} color="#2563EB" />
            </View>
            <View style={styles.permissionTextContent}>
              <Text style={styles.permissionTitle}>Patient Records</Text>
              <Text style={styles.permissionSubtitle}>View and edit medical history</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setPatientRecords}
              value={patientRecords}
            />
          </View>

          <View style={styles.divider} />

          {/* Billing Access */}
          <View style={styles.permissionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="cash-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.permissionTextContent}>
              <Text style={styles.permissionTitle}>Billing Access</Text>
              <Text style={styles.permissionSubtitle}>Handle invoices and payments</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setBillingAccess}
              value={billingAccess}
            />
          </View>

          <View style={styles.divider} />

          {/* Clinic Settings */}
          <View style={styles.permissionRow}>
            <View style={[styles.iconBox, { backgroundColor: '#E0E7FF' }]}>
              <Ionicons name="settings-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.permissionTextContent}>
              <Text style={styles.permissionTitle}>Clinic Settings</Text>
              <Text style={styles.permissionSubtitle}>Change organization details</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setClinicSettings}
              value={clinicSettings}
            />
          </View>

        </View>

        {/* Submit Button */}
        <Pressable style={styles.submitButton} onPress={async () => {
          const { MockDB } = await import('@/utils/storage');
          const permissions = [];
          if (manageQueue) permissions.push('queue');
          if (patientRecords) permissions.push('records');
          if (billingAccess) permissions.push('billing');
          if (clinicSettings) permissions.push('settings');
          
          await MockDB.addUser({
            phone: mobileNumber.replace(/\D/g, ''),
            role: 'STAFF',
            status: 'APPROVED',
            name: fullName,
            permissions
          });
          router.back();
        }}>
          <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
          <Text style={styles.submitButtonText}>Add Staff Member</Text>
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
    color: '#2563EB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Title Area
  titleArea: {
    marginTop: 12,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },

  // Avatar
  avatarUploadContainer: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Inputs
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  placeholderText: {
    fontSize: 15,
    color: '#475569',
  },
  prefixText: {
    fontSize: 15,
    color: '#64748B',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingRight: 10,
  },
  helperTextBlue: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 6,
    fontWeight: '500',
  },

  // Permissions Container
  permissionsContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  permissionTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  permissionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  permissionSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },

  // Submit Button
  submitButton: {
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 10,
    shadowColor: '#0052CC',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});
