import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function OwnerInfoScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </Pressable>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create Your Practice</Text>
            <Text style={styles.headerSubtitle}>Register your clinic or hospital in a few simple steps</Text>
          </View>
          <View style={styles.accountTypePill}>
            <Ionicons name="business" size={14} color="#2563EB" />
            <Text style={styles.accountTypePillText}>Clinic / Hospital</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.stepperContainer}>
            <Step icon="checkmark" label="Account Type" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="2" label="Owner Info" state="active" />
            <View style={styles.stepLine} />
            <Step number="3" label="Clinic Info" state="inactive" />
            <View style={styles.stepLine} />
            <Step number="4" label="Doctors" state="inactive" />
            <View style={styles.stepLine} />
            <Step number="5" label="Setup" state="inactive" />
          </View>

          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Clinic Owner Information</Text>
              <Text style={styles.subtitle}>
                Please provide your details. You will be{'\n'}
                the primary administrator of this clinic.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.clinicDeskBg}>
                <Ionicons name="medkit" size={28} color="#34D399" style={styles.medkitIcon} />
                <Ionicons name="desktop-outline" size={24} color="#4B5563" style={styles.desktopIcon} />
                <Ionicons name="leaf" size={20} color="#10B981" style={styles.plantIcon} />
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>

            {/* Personal Information */}
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="person-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View>
              {/* Mobile Number */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
                <Text style={styles.label}>Mobile Number <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={16} color="#9CA3AF" style={styles.inputIcon} />
                  <View style={styles.countryCode}>
                    <Text style={{ fontSize: 12 }}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                    <Ionicons name="chevron-down" size={12} color="#6B7280" />
                  </View>
                  <View style={styles.verticalDivider} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>Email Address <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                  />
                </View>
              </View>
            </View>

            {/* Designation / Role */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Designation / Role <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.dropdownWrapper}>
                <Ionicons name="briefcase-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <Text style={styles.dropdownTextPlaceholder}>e.g. Owner, Director, Administrator</Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" style={{ paddingRight: 16 }} />
              </View>
            </View>

            <View style={styles.divider} />

            {/* Verification */}
            <View style={styles.sectionHeader}>
              <View style={styles.iconCircle}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Verification <Text style={styles.optionalText}>(Optional)</Text></Text>
                <Text style={styles.sectionSubtitle}>This helps us verify your account securely.</Text>
              </View>
            </View>

            <View>
              {/* Aadhaar Number */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
                <Text style={styles.label}>Aadhaar Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="id-card-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Aadhaar number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={aadhaarNumber}
                    onChangeText={setAadhaarNumber}
                  />
                </View>
              </View>

              {/* PAN Number */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>PAN Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="card-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter PAN number"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                    value={panNumber}
                    onChangeText={setPanNumber}
                  />
                </View>
              </View>
            </View>

            {/* Info Notice */}
            <View style={styles.infoNotice}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="information-circle" size={20} color="#2563EB" />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoNoticeText}>
                  This information is used for account verification and will remain secure and confidential.
                </Text>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable style={styles.button} onPress={() => router.push('/hospital-info')}>
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </Pressable>

            {/* Help */}
            <Pressable style={styles.helpButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="headset-outline" size={16} color="#2563EB" />
                <Text style={styles.helpText}>Need help?</Text>
                <Text style={styles.helpSubtext}> Contact Support</Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Subcomponents
function Step({ icon, number, label, state }: { icon?: keyof typeof Ionicons.glyphMap, number?: string, label: string, state: 'completed' | 'active' | 'inactive' }) {
  const isCompleted = state === 'completed';
  const isActive = state === 'active';

  return (
    <View style={styles.stepWrapper}>
      <View style={[
        styles.stepCircle,
        isCompleted && styles.stepCircleCompleted,
        isActive && styles.stepCircleActive,
        !isCompleted && !isActive && styles.stepCircleInactive
      ]}>
        {icon ? (
          <Ionicons name={icon} size={14} color="#fff" />
        ) : (
          <Text style={[
            styles.stepNumber,
            isActive && styles.stepNumberActive,
            !isActive && styles.stepNumberInactive
          ]}>
            {number}
          </Text>
        )}
      </View>
      <Text style={[
        styles.stepLabel,
        isActive && styles.stepLabelActive,
        isCompleted && styles.stepLabelCompleted,
        !isActive && !isCompleted && styles.stepLabelInactive
      ]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  accountTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  accountTypePillText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 0,
  },
  stepWrapper: {
    alignItems: 'center',
    width: 60,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  stepCircleCompleted: {
    backgroundColor: '#2563EB',
  },
  stepCircleActive: {
    backgroundColor: '#2563EB',
  },
  stepCircleInactive: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberInactive: {
    color: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 11,
    textAlign: 'center',
    width: 65,
  },
  stepLabelCompleted: {
    color: '#6B7280',
  },
  stepLabelActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: '#9CA3AF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 14,
    marginHorizontal: -15,
    zIndex: 1,
  },
  stepLineActive: {
    backgroundColor: '#2563EB',
  },

  // Title Area
  titleArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  illustrationPlaceholder: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clinicDeskBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  medkitIcon: {
    position: 'absolute',
    top: 25,
    zIndex: 0,
    opacity: 0.8,
  },
  desktopIcon: {
    position: 'absolute',
    bottom: 25,
    zIndex: 1,
  },
  plantIcon: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    zIndex: 2,
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  optionalText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 20,
  },

  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  asterisk: {
    color: '#EF4444',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 48,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    paddingLeft: 14,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    paddingRight: 14,
  },
  dropdownTextPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Country Code Segment
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  countryCodeText: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },

  // Info Notice
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIconWrapper: {
    marginRight: 12,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoNoticeText: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },

  // Button
  button: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Help
  helpButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  helpText: {
    marginLeft: 6,
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  helpSubtext: {
    color: '#6B7280',
    fontSize: 13,
  },
});
