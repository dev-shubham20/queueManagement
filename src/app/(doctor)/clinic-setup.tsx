import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function ClinicSetupScreen() {
  const router = useRouter();

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
            <Text style={styles.headerSubtitle}>Review all details and finish your registration</Text>
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
            <Step icon="checkmark" label="Owner Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step icon="checkmark" label="Clinic Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step icon="checkmark" label="Doctors" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="5" label="Setup" state="active" />
          </View>

          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Review & Setup</Text>
              <Text style={styles.subtitle}>
                Please review all the information{'\n'}
                before you complete registration.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.buildingBg}>
                <Ionicons name="business" size={56} color="#DBEAFE" style={styles.buildingIcon} />
                <View style={styles.clipboardOverlay}>
                  <Ionicons name="clipboard" size={32} color="#60A5FA" />
                  <Ionicons name="checkmark-circle" size={12} color="#34D399" style={styles.check1} />
                  <Ionicons name="checkmark-circle" size={12} color="#34D399" style={styles.check2} />
                  <Ionicons name="checkmark-circle" size={12} color="#34D399" style={styles.check3} />
                </View>
                <Ionicons name="leaf" size={20} color="#60A5FA" style={styles.buildingPlant} />
              </View>
            </View>
          </View>

          {/* Card 1: Owner Information */}
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Owner Information</Text>
              </View>
              <Pressable style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={14} color="#2563EB" />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.dataGrid}>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Owner Name</Text>
                <Text style={styles.dataValue}>Rajesh Sharma</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Designation</Text>
                <Text style={styles.dataValue}>Owner</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Mobile Number</Text>
                <Text style={styles.dataValue}>+91 98765 43210</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Aadhaar Number</Text>
                <Text style={styles.dataValue}>XXXX XXXX 1234</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Email Address</Text>
                <Text style={styles.dataValue}>rajesh.sharma@email.com</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>PAN Number</Text>
                <Text style={styles.dataValue}>ABCDE1234F</Text>
              </View>
            </View>
          </View>

          {/* Card 2: Clinic / Hospital Information */}
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="business-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Clinic / Hospital Information</Text>
              </View>
              <Pressable style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={14} color="#2563EB" />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.dataGrid}>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Clinic Name</Text>
                <Text style={styles.dataValue}>Sharma Multi-Speciality Clinic</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Address</Text>
                <Text style={styles.dataValue}>123, Green Park Road,{'\n'}New Delhi - 110016</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Type</Text>
                <Text style={styles.dataValue}>Clinic</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Specialties</Text>
                <View style={styles.tagsContainer}>
                  <View style={styles.tag}><Text style={styles.tagText}>General Physician</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>Dermatology</Text></View>
                  <View style={styles.tag}><Text style={styles.tagText}>Pediatrics</Text></View>
                  <Text style={styles.moreTagsText}>+1 more</Text>
                </View>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Registration Number</Text>
                <Text style={styles.dataValue}>CLN/2024/12345</Text>
              </View>
              <View style={styles.dataCol}>
                <Text style={styles.dataLabel}>Established Year</Text>
                <Text style={styles.dataValue}>2018</Text>
              </View>
            </View>
          </View>

          {/* Card 3: Doctors Added */}
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person-add-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Doctors Added (2)</Text>
              </View>
              <Pressable style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={14} color="#2563EB" />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>

            <View style={styles.doctorListItem}>
              <View style={styles.doctorListAvatar}>
                <Ionicons name="person" size={24} color="#9CA3AF" />
                <View style={styles.plusBadge}>
                  <Ionicons name="add" size={10} color="#fff" />
                </View>
              </View>
              <View style={styles.doctorListInfo}>
                <Text style={styles.docName}>Dr. Rajesh Sharma</Text>
                <Text style={styles.docDetails}>MBBS, MD – General Physician</Text>
                <Text style={styles.docExperience}>8 Years Experience • ₹500 Fee</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Available</Text>
              </View>
            </View>

            <View style={[styles.doctorListItem, { marginBottom: 0 }]}>
              <View style={styles.doctorListAvatar}>
                <Ionicons name="person" size={24} color="#9CA3AF" />
              </View>
              <View style={styles.doctorListInfo}>
                <Text style={styles.docName}>Dr. Priya Verma</Text>
                <Text style={styles.docDetails}>MBBS, DGO – Gynecologist</Text>
                <Text style={styles.docExperience}>6 Years Experience • ₹600 Fee</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Available</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Clinic Setup & Preferences */}
          <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="settings-outline" size={18} color="#2563EB" />
                </View>
                <Text style={styles.cardTitle}>Clinic Setup & Preferences</Text>
              </View>
              <Pressable style={styles.editBtn}>
                <Ionicons name="pencil-outline" size={14} color="#2563EB" />
                <Text style={styles.editBtnText}>Edit</Text>
              </Pressable>
            </View>
            
            <View style={styles.preferencesGrid}>
              <View style={styles.prefItem}>
                <Ionicons name="time-outline" size={20} color="#6B7280" style={styles.prefIcon} />
                <View>
                  <Text style={styles.dataLabel}>Working Hours</Text>
                  <Text style={styles.dataValue}>9:00 AM – 1:00 PM (Morning)</Text>
                  <Text style={styles.dataValue}>5:00 PM – 8:00 PM (Evening)</Text>
                </View>
              </View>
              
              <View style={styles.prefItem}>
                <Ionicons name="wallet-outline" size={20} color="#6B7280" style={styles.prefIcon} />
                <View>
                  <Text style={styles.dataLabel}>Consultation Fee</Text>
                  <Text style={styles.dataValue}>Paid at Reception</Text>
                </View>
              </View>
              
              <View style={styles.prefItem}>
                <Ionicons name="ticket-outline" size={20} color="#6B7280" style={styles.prefIcon} />
                <View>
                  <Text style={styles.dataLabel}>Max Daily Tokens</Text>
                  <Text style={styles.dataValue}>Morning: 40  |  Evening: 30</Text>
                </View>
              </View>
              
              <View style={styles.prefItem}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" style={styles.prefIcon} />
                <View>
                  <Text style={styles.dataLabel}>Holiday Management</Text>
                  <Text style={styles.dataValue}>3 Upcoming Holidays Added</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Info Notice */}
          <View style={styles.infoNotice}>
            <View style={styles.infoIconWrapper}>
              <Ionicons name="information-circle" size={18} color="#2563EB" />
            </View>
            <Text style={styles.infoNoticeText}>
              You can edit any information using the Edit option before completing the registration.
            </Text>
          </View>

          {/* Finish Button */}
          <Pressable style={styles.button} onPress={() => router.push('/pending-verification')}>
            <Text style={styles.buttonText}>Finish Registration</Text>
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
  buildingBg: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buildingIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  clipboardOverlay: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  check1: { position: 'absolute', top: 12, left: 10 },
  check2: { position: 'absolute', top: 22, left: 10 },
  check3: { position: 'absolute', top: 32, left: 10 },
  buildingPlant: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    opacity: 0.8,
  },

  // Review Cards
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },

  // Data Grid
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  dataCol: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  dataLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    lineHeight: 18,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    alignSelf: 'center',
  },

  // Doctors List Item
  doctorListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  doctorListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  plusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  doctorListInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  docDetails: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 2,
  },
  docExperience: {
    fontSize: 11,
    color: '#6B7280',
  },
  statusPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16A34A',
  },

  // Preferences Grid
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  prefItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  prefIcon: {
    marginRight: 8,
    marginTop: 2,
  },

  // Info Notice
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoIconWrapper: {
    marginRight: 10,
    marginTop: 2,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
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
