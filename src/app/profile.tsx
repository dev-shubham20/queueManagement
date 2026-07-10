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
  Platform,
  TextInput,
  Switch,
} from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import DashboardHeader from '../components/DashboardHeader';

export default function ProfileScreen() {
  const router = useRouter();

  // --- State Variables ---

  // Doctor Info
  const [fullName, setFullName] = useState('Dr. Sarah Jenkins');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [email, setEmail] = useState('sarah.jenkins@clinicflow.com');
  const [regNumber, setRegNumber] = useState('MD-8472910');

  // Clinic Info
  const [clinicName, setClinicName] = useState('CarePlus Medical Center');
  const [clinicAddress, setClinicAddress] = useState('123 Health Ave, Medical District');
  const [contactNumber, setContactNumber] = useState('9876543210');
  const [whatsappNumber, setWhatsappNumber] = useState('9876543210');
  const [consultationFee, setConsultationFee] = useState('500');
  const [payAtClinic, setPayAtClinic] = useState(true);

  // Working Hours & Setup
  const [morningSession, setMorningSession] = useState(true);
  const [eveningSession, setEveningSession] = useState(true);
  
  const [morningOffs, setMorningOffs] = useState<string[]>(['Sun']);
  const [eveningOffs, setEveningOffs] = useState<string[]>(['Sun']);
  
  const [maxTokensMorning, setMaxTokensMorning] = useState('40');
  const [maxTokensEvening, setMaxTokensEvening] = useState('30');
  const [consultationTime, setConsultationTime] = useState('10 Minutes');
  
  const [allowWalkIn, setAllowWalkIn] = useState(true);

  // Helpers
  const toggleMorningOff = (day: string) => {
    setMorningOffs(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleEveningOff = (day: string) => {
    setEveningOffs(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="My Profile" leftIcon="menu" rightElement="none" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>DOCTOR INFORMATION</Text>
          
          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={24} color="#2563EB" />
              </View>
              <Pressable style={styles.editAvatarBadge}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.avatarTextContainer}>
              <Text style={styles.avatarLabel}>Profile Photo *</Text>
              <Text style={styles.avatarSubtext}>JPG, PNG or WebP. Max size 2MB</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number *</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>IN +91</Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </View>
              <TextInput
                style={[styles.textInput, { flex: 1, paddingLeft: 12 }]}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter your mobile number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Medical Registration Number *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={regNumber}
                onChangeText={setRegNumber}
                placeholder="Enter your medical registration number"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.secureInfoBox}>
            <Ionicons name="shield-checkmark" size={20} color="#2563EB" style={{ marginTop: 2 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.secureInfoTitle}>Your information is secure</Text>
              <Text style={styles.secureInfoText}>We use industry-standard security to keep your data safe and private.</Text>
            </View>
          </View>
        </View>


        {/* ================= CLINIC INFORMATION ================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>CLINIC INFORMATION</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Clinic Name *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={clinicName}
                onChangeText={setClinicName}
                placeholder="Enter clinic name"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.avatarRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="image-outline" size={24} color="#2563EB" />
              </View>
              <Pressable style={styles.editAvatarBadge}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
              </Pressable>
            </View>
            <View style={styles.avatarTextContainer}>
              <Text style={styles.avatarLabel}>Clinic Logo</Text>
              <Text style={styles.avatarSubtext}>JPG, PNG or WebP. Max size 2MB</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Clinic Address *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={clinicAddress}
                onChangeText={setClinicAddress}
                placeholder="Enter full address"
                placeholderTextColor="#94A3B8"
              />
              <Ionicons name="locate-outline" size={20} color="#64748B" />
            </View>
            <Text style={styles.helperText}>Include street, area, city and pincode</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location on Map *</Text>
            <View style={styles.mapActionRow}>
              <View style={styles.mapPinBox}>
                <Ionicons name="location" size={24} color="#111827" />
              </View>
              <Pressable style={styles.mapSelectButton}>
                <Ionicons name="locate" size={20} color="#2563EB" style={{ marginRight: 8 }} />
                <Text style={styles.mapSelectText}>Select on Map</Text>
              </Pressable>
            </View>
            <Text style={[styles.helperText, { textAlign: 'right' }]}>Tap to mark your clinic location</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number *</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>IN +91</Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </View>
              <TextInput
                style={[styles.textInput, { flex: 1, paddingLeft: 12 }]}
                value={contactNumber}
                onChangeText={setContactNumber}
                placeholder="Enter number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>WhatsApp Number (Optional)</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>IN +91</Text>
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              </View>
              <TextInput
                style={[styles.textInput, { flex: 1, paddingLeft: 12 }]}
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
                placeholder="Enter number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Consultation Fee (₹) *</Text>
            <View style={styles.inputWrapper}>
              <Text style={{ fontSize: 16, color: '#64748B', marginRight: 12 }}>₹</Text>
              <TextInput
                style={styles.textInput}
                value={consultationFee}
                onChangeText={setConsultationFee}
                placeholder="Enter consultation fee"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setPayAtClinic(!payAtClinic)}>
            <View style={[styles.checkbox, payAtClinic && styles.checkboxActive]}>
              {payAtClinic && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.checkboxTitle}>Pay at Clinic / Reception</Text>
              <Text style={styles.checkboxDesc}>Patients will pay the consultation fee directly at the clinic. No online payment required for booking.</Text>
            </View>
          </Pressable>
        </View>

        {/* ================= CLINIC WORKING HOURS & SETUP ================= */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>CLINIC WORKING HOURS</Text>
          
          {/* Morning Session */}
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.sessionIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="sunny-outline" size={20} color="#D97706" />
                </View>
                <Text style={styles.sessionTitleText}>Morning Session <Text style={{ color: '#94A3B8', fontWeight: '400' }}>(Optional)</Text></Text>
              </View>
              <Switch 
                value={morningSession} 
                onValueChange={setMorningSession} 
                trackColor={{ false: '#E2E8F0', true: '#34D399' }}
                thumbColor="#FFFFFF"
              />
            </View>
            {morningSession && (
              <View style={styles.timeSelectRow}>
                <View style={styles.timeSelectBox}>
                  <Text style={styles.timeSelectText}>09:00 AM</Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </View>
                <Text style={styles.timeToText}>to</Text>
                <View style={styles.timeSelectBox}>
                  <Text style={styles.timeSelectText}>01:00 PM</Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </View>
              </View>
            )}
          </View>

          {/* Evening Session */}
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.sessionIconBox, { backgroundColor: '#E0E7FF' }]}>
                  <Ionicons name="moon-outline" size={20} color="#4338CA" />
                </View>
                <Text style={styles.sessionTitleText}>Evening Session <Text style={{ color: '#94A3B8', fontWeight: '400' }}>(Optional)</Text></Text>
              </View>
              <Switch 
                value={eveningSession} 
                onValueChange={setEveningSession} 
                trackColor={{ false: '#E2E8F0', true: '#34D399' }}
                thumbColor="#FFFFFF"
              />
            </View>
            {eveningSession && (
              <View style={styles.timeSelectRow}>
                <View style={styles.timeSelectBox}>
                  <Text style={styles.timeSelectText}>05:00 PM</Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </View>
                <Text style={styles.timeToText}>to</Text>
                <View style={styles.timeSelectBox}>
                  <Text style={styles.timeSelectText}>08:00 PM</Text>
                  <Ionicons name="chevron-down" size={16} color="#64748B" />
                </View>
              </View>
            )}
          </View>

          {/* Weekly Offs */}
          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="calendar-outline" size={20} color="#2563EB" />
              <Text style={[styles.sectionTitleText, { marginLeft: 8 }]}>Weekly Offs (Shift-wise)</Text>
            </View>
            
            <Text style={styles.subLabel}>Morning Session Offs</Text>
            <View style={styles.daysContainer}>
              {days.map(day => {
                const isSelected = morningOffs.includes(day);
                return (
                  <Pressable 
                    key={`m-${day}`} 
                    style={[styles.dayBadge, isSelected && styles.dayBadgeSelected]}
                    onPress={() => toggleMorningOff(day)}
                  >
                    <Text style={[styles.dayBadgeText, isSelected && styles.dayBadgeTextSelected]}>{day}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.subLabel, { marginTop: 16 }]}>Evening Session Offs</Text>
            <View style={styles.daysContainer}>
              {days.map(day => {
                const isSelected = eveningOffs.includes(day);
                return (
                  <Pressable 
                    key={`e-${day}`} 
                    style={[styles.dayBadge, isSelected && styles.dayBadgeSelected]}
                    onPress={() => toggleEveningOff(day)}
                  >
                    <Text style={[styles.dayBadgeText, isSelected && styles.dayBadgeTextSelected]}>{day}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        {/* ================= DAILY TOKEN SETTINGS ================= */}
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="ticket-outline" size={20} color="#2563EB" />
            <Text style={[styles.sectionTitleText, { marginLeft: 8 }]}>Daily Token Settings</Text>
          </View>

          <View style={styles.rowInputs}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>Max Tokens (Morning)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#34D399" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={maxTokensMorning}
                  onChangeText={setMaxTokensMorning}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>Max Tokens (Evening)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#34D399" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={maxTokensEvening}
                  onChangeText={setMaxTokensEvening}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* ================= CONSULTATION SETTINGS ================= */}
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Ionicons name="hourglass-outline" size={20} color="#2563EB" />
            <Text style={[styles.sectionTitleText, { marginLeft: 8 }]}>Consultation Settings</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Average Consultation Time</Text>
            <View style={[styles.inputWrapper, { justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={20} color="#64748B" style={styles.inputIcon} />
                <Text style={styles.textInput}>{consultationTime}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#64748B" />
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleIconBox}>
              <Ionicons name="notifications-outline" size={20} color="#4338CA" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.toggleTitle}>Allow Walk-in Patients</Text>
              <Text style={styles.toggleDesc}>Allow patients to join without prior booking</Text>
            </View>
            <Switch 
              value={allowWalkIn} 
              onValueChange={setAllowWalkIn} 
              trackColor={{ false: '#E2E8F0', true: '#34D399' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color="#059669" style={{ marginTop: 2 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.tipTitle}>Tip</Text>
              <Text style={styles.tipText}>These settings will help us manage your queue smoothly and provide a better experience for your patients.</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Profile & Settings</Text>
          </Pressable>

        </View>

      </ScrollView>

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  
  // Avatar & Logo
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarTextContainer: {
    flex: 1,
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  avatarSubtext: {
    fontSize: 12,
    color: '#64748B',
  },

  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    height: '100%',
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginRight: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Map
  mapActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapPinBox: {
    width: 64,
    height: 52,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mapSelectButton: {
    flex: 1,
    flexDirection: 'row',
    height: 52,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapSelectText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  checkboxDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },

  // Secure / Tip Boxes
  secureInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  secureInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  secureInfoText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 18,
  },

  // Sessions
  sessionCard: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  timeSelectBox: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSelectText: {
    fontSize: 14,
    color: '#1E293B',
  },
  timeToText: {
    fontSize: 14,
    color: '#64748B',
    marginHorizontal: 12,
  },

  // Days
  subLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  dayBadgeSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  dayBadgeText: {
    fontSize: 13,
    color: '#475569',
  },
  dayBadgeTextSelected: {
    color: '#EF4444',
    fontWeight: '600',
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 12,
    color: '#64748B',
  },

  // Actions
  actionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 8,
  },
});
