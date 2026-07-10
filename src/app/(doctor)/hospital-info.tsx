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

export default function HospitalInfoScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [type, setType] = useState<'clinic' | 'hospital'>('clinic');
  const [regNumber, setRegNumber] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [about, setAbout] = useState('');
  
  // Dummy specialties for UI
  const [specialties, setSpecialties] = useState(['General Physician', 'Dermatology', 'Pediatrics']);

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
          {/* Progress Indicator */}
          <View style={styles.stepperContainer}>
            <Step icon="checkmark" label="Account Type" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step icon="checkmark" label="Owner Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="3" label="Clinic Info" state="active" />
            <View style={styles.stepLine} />
            <Step number="4" label="Doctors" state="inactive" />
            <View style={styles.stepLine} />
            <Step number="5" label="Setup" state="inactive" />
          </View>

          {/* Title Area */}
          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Clinic / Hospital Information</Text>
              <Text style={styles.subtitle}>
                Tell us about your clinic or hospital so{'\n'}
                patients can find you easily.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.hospitalBg}>
                <Ionicons name="medkit" size={30} color="#10B981" style={styles.hospitalCross} />
                <Ionicons name="business" size={60} color="#60A5FA" style={styles.hospitalBuilding} />
                <Ionicons name="leaf" size={24} color="#34D399" style={styles.hospitalTree} />
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic / Hospital Name <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter clinic or hospital name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic / Hospital Type <Text style={styles.asterisk}>*</Text></Text>
              <View style={styles.typeRow}>
                <Pressable
                  style={[styles.typeCard, type === 'clinic' && styles.typeCardActive]}
                  onPress={() => setType('clinic')}
                >
                  <Ionicons name="business-outline" size={24} color={type === 'clinic' ? '#2563EB' : '#9CA3AF'} />
                  <Text style={[styles.typeText, type === 'clinic' && styles.typeTextActive]}>Clinic</Text>
                  <View style={[styles.radio, type === 'clinic' && styles.radioActive]}>
                    {type === 'clinic' && <View style={styles.radioInner} />}
                  </View>
                </Pressable>

                <Pressable
                  style={[styles.typeCard, type === 'hospital' && styles.typeCardActive]}
                  onPress={() => setType('hospital')}
                >
                  <Ionicons name="business" size={24} color={type === 'hospital' ? '#2563EB' : '#9CA3AF'} />
                  <Text style={[styles.typeText, type === 'hospital' && styles.typeTextActive]}>Hospital</Text>
                  <View style={[styles.radio, type === 'hospital' && styles.radioActive]}>
                    {type === 'hospital' && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              </View>
            </View>

            {/* Registration Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registration Number <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter registration number"
                  placeholderTextColor="#9CA3AF"
                  value={regNumber}
                  onChangeText={setRegNumber}
                />
              </View>
            </View>

            {/* Logo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Clinic / Hospital Logo <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.uploadArea}>
                <View style={styles.logoPlaceholder}>
                  <Ionicons name="image-outline" size={28} color="#9CA3AF" />
                  <View style={styles.addIconSmall}>
                    <Ionicons name="add" size={12} color="#fff" />
                  </View>
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Upload logo</Text>
                  <Text style={styles.uploadSubtitle}>JPG, PNG or WebP. Max size 2MB</Text>
                </View>
              </View>
            </View>

            {/* Established Year */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Established Year <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.dropdownWrapper}>
                <Ionicons name="calendar-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <Text style={styles.dropdownTextPlaceholder}>Select established year</Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" style={{ paddingRight: 16 }} />
              </View>
            </View>

            {/* About */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>About Clinic / Hospital <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.textAreaWrapper}>
                <Ionicons name="document-text-outline" size={18} color="#9CA3AF" style={[styles.inputIcon, { marginTop: 14 }]} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Briefly describe your clinic or hospital"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  value={about}
                  onChangeText={setAbout}
                  maxLength={300}
                />
                <Text style={styles.charCount}>{about.length}/300</Text>
              </View>
            </View>

            {/* Specialties */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Specialties / Departments <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Search and add specialties"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.tagsContainer}>
                {specialties.map((spec, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{spec}</Text>
                    <Ionicons name="close" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
                  </View>
                ))}
                <Pressable style={styles.addTagButton}>
                  <Ionicons name="add" size={14} color="#2563EB" />
                  <Text style={styles.addTagText}>Add More</Text>
                </Pressable>
              </View>
            </View>

            {/* Continue Button */}
            <Pressable style={styles.button} onPress={() => router.push('/doctors-info')}>
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
  hospitalBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  hospitalCross: {
    position: 'absolute',
    top: 15,
    zIndex: 2,
  },
  hospitalBuilding: {
    position: 'absolute',
    bottom: 10,
    zIndex: 1,
  },
  hospitalTree: {
    position: 'absolute',
    bottom: 10,
    left: 10,
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
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
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
  optionalText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '400',
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

  // Type Row
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  typeCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
    marginLeft: 8,
  },
  typeTextActive: {
    color: '#111827',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },

  // Upload Area
  uploadArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  addIconSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  uploadSubtitle: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Text Area
  textAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
    position: 'relative',
  },
  textArea: {
    flex: 1,
    minHeight: 80,
    fontSize: 13,
    color: '#111827',
    paddingTop: 14,
    paddingRight: 14,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 11,
    color: '#9CA3AF',
  },

  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  addTagText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 2,
  },

  // Button
  button: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
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
