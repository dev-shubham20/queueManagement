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
  Image,
  Switch,
} from 'react-native';

export default function DoctorsInfoScreen() {
  const router = useRouter();

  const [doctorName, setDoctorName] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [about, setAbout] = useState('');

  const [morningSession, setMorningSession] = useState(true);
  const [eveningSession, setEveningSession] = useState(true);
  
  const daysOfWeek = [
    {label: 'S', id: 0}, {label: 'M', id: 1}, {label: 'T', id: 2}, 
    {label: 'W', id: 3}, {label: 'T', id: 4}, {label: 'F', id: 5}, {label: 'S', id: 6}
  ];
  const [morningOffs, setMorningOffs] = useState<number[]>([0]);
  const [eveningOffs, setEveningOffs] = useState<number[]>([0]);

  const toggleOff = (dayId: number, session: 'morning' | 'evening') => {
    if (session === 'morning') {
      setMorningOffs(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
    } else {
      setEveningOffs(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
    }
  };

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
            <Step icon="checkmark" label="Clinic Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="4" label="Doctors" state="active" />
            <View style={styles.stepLine} />
            <Step number="5" label="Setup" state="inactive" />
          </View>

          {/* Title Area */}
          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Add Doctors</Text>
              <Text style={styles.subtitle}>
                Add your doctors to let patients{'\n'}
                book appointments.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.clipboardBg}>
                <Ionicons name="clipboard" size={56} color="#DBEAFE" style={styles.clipboardIcon} />
                <Ionicons name="person-circle" size={20} color="#60A5FA" style={styles.docAvatar1} />
                <Ionicons name="person-circle" size={20} color="#60A5FA" style={styles.docAvatar2} />
                <Ionicons name="person-circle" size={20} color="#60A5FA" style={styles.docAvatar3} />
                <View style={styles.addCircle}>
                  <Ionicons name="add" size={16} color="#fff" />
                </View>
                <Ionicons name="leaf" size={20} color="#60A5FA" style={styles.clipboardPlant} />
              </View>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Add Doctor</Text>
              <Pressable style={styles.addDoctorBtn}>
                <Ionicons name="add" size={16} color="#2563EB" />
                <Text style={styles.addDoctorBtnText}>Add Doctor</Text>
              </Pressable>
            </View>

            <View>
              {/* Doctor Name */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
                <Text style={styles.label}>Doctor Name <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter doctor full name"
                    placeholderTextColor="#9CA3AF"
                    value={doctorName}
                    onChangeText={setDoctorName}
                  />
                </View>
              </View>

              {/* Qualification */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>Qualification <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="school-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. MBBS, MD"
                    placeholderTextColor="#9CA3AF"
                    value={qualification}
                    onChangeText={setQualification}
                  />
                </View>
              </View>
            </View>

            <View>
              {/* Specialization */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
                <Text style={styles.label}>Specialization <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.dropdownWrapper}>
                  <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <Text style={styles.dropdownTextPlaceholder}>Select specialization</Text>
                  <Ionicons name="chevron-down" size={18} color="#6B7280" style={{ paddingRight: 10 }} />
                </View>
              </View>

              {/* Experience */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>Experience (Years)</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 8"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    value={experience}
                    onChangeText={setExperience}
                  />
                </View>
              </View>
            </View>

            <View>
              {/* Consultation Fee */}
              <View style={[styles.inputGroup, { flex: 1, marginRight: 0 }]}>
                <Text style={styles.label}>Consultation Fee (₹) <Text style={styles.asterisk}>*</Text></Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.rupeeCircle}>
                    <Text style={styles.rupeeSymbol}>₹</Text>
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
              </View>

              {/* Gender */}
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 0 }]}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  <Pressable
                    style={[styles.genderCard, gender === 'male' && styles.genderCardActive]}
                    onPress={() => setGender('male')}
                  >
                    <Ionicons name="person-outline" size={16} color={gender === 'male' ? '#2563EB' : '#9CA3AF'} />
                    <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>Male</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.genderCard, gender === 'female' && styles.genderCardActive]}
                    onPress={() => setGender('female')}
                  >
                    <Ionicons name="person-outline" size={16} color={gender === 'female' ? '#2563EB' : '#9CA3AF'} />
                    <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>Female</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Profile Photo */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Photo <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.uploadArea}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#9CA3AF" />
                  <View style={styles.addIconSmall}>
                    <Ionicons name="add" size={10} color="#fff" />
                  </View>
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>Upload photo</Text>
                  <Text style={styles.uploadSubtitle}>JPG, PNG or WebP. Max size 2MB</Text>
                </View>
              </View>
            </View>

            {/* About Doctor */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>About Doctor <Text style={styles.optionalText}>(Optional)</Text></Text>
              <View style={styles.textAreaWrapper}>
                <Ionicons name="document-text-outline" size={18} color="#9CA3AF" style={[styles.inputIcon, { marginTop: 14 }]} />
                <TextInput
                  style={styles.textArea}
                  placeholder="Briefly describe about the doctor"
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

            {/* Working Hours */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consulting Days & Time</Text>
              
              {/* Morning Session */}
              <View style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionTitleRow}>
                    <View style={styles.iconBoxMorning}>
                      <Ionicons name="sunny-outline" size={18} color="#F59E0B" />
                    </View>
                    <Text style={styles.sessionName}>Morning Session</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#D1D5DB"
                    onValueChange={setMorningSession}
                    value={morningSession}
                  />
                </View>
                {morningSession && (
                  <View style={styles.timePickerRow}>
                    <View style={styles.timeDropdown}>
                      <Text style={styles.timeText}>09:00 AM</Text>
                      <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </View>
                    <Text style={styles.toText}>to</Text>
                    <View style={styles.timeDropdown}>
                      <Text style={styles.timeText}>01:00 PM</Text>
                      <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </View>
                  </View>
                )}
              </View>

              {/* Evening Session */}
              <View style={styles.sessionCard}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionTitleRow}>
                    <View style={styles.iconBoxEvening}>
                      <Ionicons name="moon-outline" size={18} color="#4F46E5" />
                    </View>
                    <Text style={styles.sessionName}>Evening Session</Text>
                  </View>
                  <Switch
                    trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                    thumbColor="#ffffff"
                    ios_backgroundColor="#D1D5DB"
                    onValueChange={setEveningSession}
                    value={eveningSession}
                  />
                </View>
                {eveningSession && (
                  <View style={styles.timePickerRow}>
                    <View style={styles.timeDropdown}>
                      <Text style={styles.timeText}>05:00 PM</Text>
                      <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </View>
                    <Text style={styles.toText}>to</Text>
                    <View style={styles.timeDropdown}>
                      <Text style={styles.timeText}>08:00 PM</Text>
                      <Ionicons name="chevron-down" size={16} color="#6B7280" />
                    </View>
                  </View>
                )}
              </View>

              {/* Weekly Offs */}
              <Text style={[styles.label, { marginTop: 12 }]}>Weekly Offs (Shift-wise)</Text>
              <View style={styles.weekOffsContainer}>
                {morningSession && (
                  <>
                    <Text style={styles.weekOffsSubtitle}>Morning Session Offs</Text>
                    <View style={styles.daysRow}>
                      {daysOfWeek.map((day) => {
                        const isOff = morningOffs.includes(day.id);
                        return (
                          <Pressable 
                            key={`m-${day.id}`} 
                            style={[styles.dayPill, isOff && styles.dayPillActive]}
                            onPress={() => toggleOff(day.id, 'morning')}
                          >
                            <Text style={[styles.dayText, isOff && styles.dayTextActive]}>{day.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                )}

                {eveningSession && (
                  <>
                    <Text style={[styles.weekOffsSubtitle, morningSession && { marginTop: 16 }]}>Evening Session Offs</Text>
                    <View style={styles.daysRow}>
                      {daysOfWeek.map((day) => {
                        const isOff = eveningOffs.includes(day.id);
                        return (
                          <Pressable 
                            key={`e-${day.id}`} 
                            style={[styles.dayPill, isOff && styles.dayPillActive]}
                            onPress={() => toggleOff(day.id, 'evening')}
                          >
                            <Text style={[styles.dayText, isOff && styles.dayTextActive]}>{day.label}</Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                )}

                {!morningSession && !eveningSession && (
                  <Text style={styles.weekOffsSubtitle}>Please enable at least one session to manage week offs.</Text>
                )}
              </View>
            </View>

            {/* Added Doctors List */}
            <View style={styles.addedDoctorsHeader}>
              <Text style={styles.addedDoctorsTitle}>Added Doctors (2)</Text>
              <Pressable>
                <Text style={styles.editOrderText}>Edit Order</Text>
              </Pressable>
            </View>

            {/* Doctor Card 1 */}
            <View style={styles.doctorListItem}>
              <View style={styles.dragHandle}>
                <Ionicons name="grid-outline" size={16} color="#D1D5DB" />
              </View>
              <View style={styles.doctorListAvatar}>
                <Ionicons name="person" size={24} color="#9CA3AF" />
              </View>
              <View style={styles.doctorListInfo}>
                <Text style={styles.docName}>Dr. Rajesh Sharma</Text>
                <Text style={styles.docDetails}>MBBS, MD - General Physician</Text>
                <Text style={styles.docExperience}>8 Years Experience • ₹500 Fee</Text>
              </View>
              <View style={styles.docActions}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Available</Text>
                </View>
                <Pressable style={styles.iconActionBtn}>
                  <Ionicons name="pencil-outline" size={18} color="#6B7280" />
                </Pressable>
                <Pressable style={styles.iconActionBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </Pressable>
              </View>
            </View>

            {/* Doctor Card 2 */}
            <View style={styles.doctorListItem}>
              <View style={styles.dragHandle}>
                <Ionicons name="grid-outline" size={16} color="#D1D5DB" />
              </View>
              <View style={styles.doctorListAvatar}>
                <Ionicons name="person" size={24} color="#9CA3AF" />
              </View>
              <View style={styles.doctorListInfo}>
                <Text style={styles.docName}>Dr. Priya Verma</Text>
                <Text style={styles.docDetails}>MBBS, DGO - Gynecologist</Text>
                <Text style={styles.docExperience}>6 Years Experience • ₹600 Fee</Text>
              </View>
              <View style={styles.docActions}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>Available</Text>
                </View>
                <Pressable style={styles.iconActionBtn}>
                  <Ionicons name="pencil-outline" size={18} color="#6B7280" />
                </Pressable>
                <Pressable style={styles.iconActionBtn}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </Pressable>
              </View>
            </View>

            {/* Info Notice */}
            <View style={styles.infoNotice}>
              <View style={styles.infoIconWrapper}>
                <Ionicons name="information-circle" size={18} color="#2563EB" />
              </View>
              <Text style={styles.infoNoticeText}>
                You can add, edit or remove doctors later from settings.
              </Text>
            </View>

            {/* Continue Button */}
            <Pressable style={styles.button} onPress={() => router.push('/clinic-setup')}>
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
  clipboardBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  clipboardIcon: {
    position: 'absolute',
    top: 15,
    zIndex: 1,
  },
  docAvatar1: { position: 'absolute', top: 32, left: 32, zIndex: 2 },
  docAvatar2: { position: 'absolute', top: 48, left: 32, zIndex: 2 },
  docAvatar3: { position: 'absolute', top: 64, left: 32, zIndex: 2 },
  addCircle: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  clipboardPlant: {
    position: 'absolute',
    bottom: 10,
    right: 5,
    zIndex: 0,
    opacity: 0.5,
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
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  addDoctorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addDoctorBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 4,
  },

  // Inputs
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 16,
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
    height: 44,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    paddingRight: 12,
  },
  dropdownTextPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  rupeeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 8,
  },
  rupeeSymbol: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },

  // Gender Radio
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 44,
    backgroundColor: '#FFFFFF',
  },
  genderCardActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  genderText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  genderTextActive: {
    color: '#2563EB',
    fontWeight: '600',
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
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  addIconSmall: {
    position: 'absolute',
    bottom: 0,
    right: -2,
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
    fontSize: 13,
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
    minHeight: 70,
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

  // Doctors List
  addedDoctorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  addedDoctorsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  editOrderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
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
  dragHandle: {
    marginRight: 10,
  },
  doctorListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  iconActionBtn: {
    padding: 4,
  },

  // Info Notice
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
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

  // Session Cards
  sessionCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    padding: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBoxMorning: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconBoxEvening: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sessionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timeDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  timeText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  toText: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 12,
    fontWeight: '500',
  },

  // Week Offs
  weekOffsContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
  },
  weekOffsSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayPill: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPillActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
});
