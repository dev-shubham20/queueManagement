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

export default function ClinicInfoScreen() {
  const router = useRouter();

  // Form states
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [fee, setFee] = useState('');
  const [payAtReception, setPayAtReception] = useState(false);

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
            <Step icon="checkmark" label="Doctor Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="3" label="Clinic Info" state="active" />
            <View style={styles.stepLine} />
            <Step number="4" label="Setup" state="inactive" />
          </View>

          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Clinic Information</Text>
              <Text style={styles.subtitle}>
                Tell us about your clinic so patients can find and visit you easily.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="business" size={60} color="#86EFAC" />
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Clinic Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter clinic name"
                  placeholderTextColor="#9CA3AF"
                  value={clinicName}
                  onChangeText={setClinicName}
                />
              </View>
            </View>

            {/* Clinic Logo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic Logo</Text>
              <View style={styles.photoUploadRow}>
                <Pressable style={styles.photoPlaceholder}>
                  <Ionicons name="image" size={28} color="#2563EB" />
                  <View style={styles.photoPlusIcon}>
                    <Ionicons name="add" size={14} color="#fff" />
                  </View>
                </Pressable>
                <View style={styles.photoTextContainer}>
                  <Text style={styles.photoTitle}>Upload clinic logo</Text>
                  <Text style={styles.photoSubtitle}>JPG, PNG or WebP. Max size 2MB</Text>
                </View>
              </View>
            </View>

            {/* Clinic Address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic Address <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="location-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter full address"
                  placeholderTextColor="#9CA3AF"
                  value={address}
                  onChangeText={setAddress}
                />
                <Pressable style={styles.inputIconRight}>
                  <Ionicons name="locate-outline" size={20} color="#6B7280" />
                </Pressable>
              </View>
              <Text style={styles.helpTextBelowInput}>Include street, area, city and pincode</Text>
            </View>

            {/* Location on Map */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Location on Map <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.mapRow}>
                <View style={styles.creativeMapPlaceholder}>
                  <Ionicons name="location" size={24} color="#1F2937" />
                </View>
                <View style={styles.mapActionContainer}>
                  <Pressable style={styles.creativeSelectMapButton}>
                    <Ionicons name="locate" size={18} color="#4F46E5" />
                    <Text style={styles.creativeSelectMapText}>Select on Map</Text>
                  </Pressable>
                  <Text style={styles.mapHelpText}>Tap to mark your clinic location</Text>
                </View>
              </View>
            </View>

            {/* Contact Numbers Row */}
            <View style={[ { alignItems: 'flex-end' }]}>
              <View style={[styles.inputGroup, { marginRight: 8, width: '100%', marginBottom: 20 }]}>
                <Text style={styles.label}>Contact Number <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.creativeInputWrapper}>
                  <View style={styles.creativeCountryBox}>
                    <Text style={styles.countryCodeBold}>IN</Text>
                    <Text style={styles.countryText}> +91</Text>
                    <Ionicons name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
                  </View>
                  <TextInput
                    style={styles.inputPhone}
                    placeholder="Enter numb"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={contactNumber}
                    onChangeText={setContactNumber}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { marginLeft: 8, width: '100%', marginBottom: 20 }]}>
                <View style={{ marginBottom: 8 }}>
                  <Text style={[styles.label, { marginBottom: 2 }]}>WhatsApp Number (Optional)</Text>
                </View>
                <View style={styles.creativeInputWrapper}>
                  <View style={styles.creativeCountryBox}>
                    <Text style={styles.countryCodeBold}>IN</Text>
                    <Text style={styles.countryText}> +91</Text>
                    <Ionicons name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
                  </View>
                  <TextInput
                    style={styles.inputPhone}
                    placeholder="Enter numb"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={10}
                    value={whatsappNumber}
                    onChangeText={setWhatsappNumber}
                  />
                </View>
              </View>
            </View>

            {/* Consultation Fee */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consultation Fee (₹) <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <View style={styles.rupeeIconBox}>
                  <Text style={styles.rupeeText}>₹</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter consultation fee"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  value={fee}
                  onChangeText={setFee}
                />
              </View>
              
              <Pressable 
                style={styles.checkboxRow} 
                onPress={() => setPayAtReception(!payAtReception)}
              >
                <View style={[styles.checkbox, payAtReception && styles.checkboxActive]}>
                  {payAtReception && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <View style={styles.checkboxTextContainer}>
                  <Text style={styles.checkboxLabel}>Pay at Clinic / Reception</Text>
                  <Text style={styles.checkboxSubtext}>Patients will pay the consultation fee directly at the clinic. No online payment required for booking.</Text>
                </View>
              </Pressable>
            </View>

            {/* Info Notice */}
            <View style={styles.infoNotice}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="information" size={16} color="#2563EB" />
              </View>
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoNoticeTitle}>You can update this information anytime later from settings.</Text>
                <Text style={styles.infoNoticeSubtitle}>
                  Don't worry, you can always make changes.
                </Text>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable style={styles.button} onPress={() => router.push('/setup')}>
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
    width: 70, // Slightly wider to accommodate labels
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
    marginTop: 14,
    marginHorizontal: -20, // adjust overlap
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
    backgroundColor: '#F0FDF4', // Light green
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
  row: {
    flexDirection: 'row',
    marginBottom: 0,
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
  optionalText: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  helpTextBelowInput: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
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
  inputIconRight: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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
    paddingHorizontal: 12,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },
  countryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  inputPhone: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#111827',
    paddingHorizontal: 12,
  },
  rupeeIconBox: {
    paddingLeft: 16,
    paddingRight: 12,
  },
  rupeeText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Map Section
  mapRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creativeMapPlaceholder: {
    width: 84,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mapActionContainer: {
    flex: 1,
  },
  creativeSelectMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    height: 44,
    backgroundColor: '#FFFFFF',
    marginBottom: 6,
  },
  creativeSelectMapText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  },
  mapHelpText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Custom Phone Input
  creativeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 48,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  creativeCountryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#F3F4F6', 
    backgroundColor: '#FFFFFF',
  },
  countryCodeBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  checkboxSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 16,
  },

  // Info Notice
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    marginTop: 4,
    alignItems: 'flex-start',
  },
  infoIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
    lineHeight: 18,
  },
  infoNoticeSubtitle: {
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
