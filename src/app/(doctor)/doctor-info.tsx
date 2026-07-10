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

export default function DoctorInfoScreen() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [regNumber, setRegNumber] = useState('');

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
          <Text style={styles.headerTitle}>Create Your Practice</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.stepperContainer}>
            <Step icon="checkmark" label="Account Type" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="2" label="Doctor Info" state="active" />
            <View style={styles.stepLine} />
            <Step number="3" label="Clinic Info" state="inactive" />
            <View style={styles.stepLine} />
            <Step number="4" label="Setup" state="inactive" />
          </View>

          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Doctor Information</Text>
              <Text style={styles.subtitle}>
                Let's get your basic information to get started.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="person" size={60} color="#DBEAFE" />
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Profile Photo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Photo <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.photoUploadRow}>
                <Pressable style={styles.photoPlaceholder}>
                  <Ionicons name="camera" size={28} color="#2563EB" />
                  <View style={styles.photoPlusIcon}>
                    <Ionicons name="add" size={14} color="#fff" />
                  </View>
                </Pressable>
                <View style={styles.photoTextContainer}>
                  <Text style={styles.photoTitle}>Upload your photo</Text>
                  <Text style={styles.photoSubtitle}>JPG, PNG or WebP. Max size 2MB</Text>
                </View>
              </View>
            </View>

            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <View style={styles.countryBox}>
                  <Text style={styles.countryText}>🇮🇳 +91</Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
                </View>
                <TextInput
                  style={styles.inputPhone}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Email Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Medical Registration Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medical Registration Number <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your medical registration number"
                  placeholderTextColor="#9CA3AF"
                  value={regNumber}
                  onChangeText={setRegNumber}
                />
              </View>
            </View>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <View style={styles.securityIconWrapper}>
                <Ionicons name="shield-checkmark" size={16} color="#2563EB" />
              </View>
              <View style={styles.securityTextWrapper}>
                <Text style={styles.securityNoticeTitle}>Your information is secure</Text>
                <Text style={styles.securityNoticeSubtitle}>
                  We use industry-standard security to keep your data safe and private.
                </Text>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable style={styles.button} onPress={() => router.push('/clinic-info')}>
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </Pressable>

            {/* Help */}
            <Pressable style={styles.helpButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="headset-outline"
                  size={16}
                  color="#2563EB"
                />
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
          <Ionicons name={icon} size={16} color="#fff" />
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
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
    paddingHorizontal: 10,
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
    width: 80,
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
    marginTop: 14, // Half of stepCircle height
    marginHorizontal: -15, // Overlap slightly
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
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  illustrationPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  asterisk: {
    color: '#EF4444',
  },

  // Photo Upload
  photoUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  photoPlusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoTextContainer: {
    flex: 1,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  photoSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Inputs
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 52,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
    paddingRight: 16,
  },
  countryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  countryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  inputPhone: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
    paddingHorizontal: 16,
  },

  // Security Notice
  securityNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginTop: 4,
    alignItems: 'flex-start',
  },
  securityIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  securityTextWrapper: {
    flex: 1,
  },
  securityNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  securityNoticeSubtitle: {
    fontSize: 12,
    color: '#6B7280',
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
