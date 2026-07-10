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
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function SetupScreen() {
  const router = useRouter();

  const [morningSession, setMorningSession] = useState(true);
  const [eveningSession, setEveningSession] = useState(true);
  const [allowWalkIn, setAllowWalkIn] = useState(true);

  const [morningOffs, setMorningOffs] = useState<string[]>(['Sun']);
  const [eveningOffs, setEveningOffs] = useState<string[]>(['Sun']);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleOff = (day: string, shift: 'morning' | 'evening') => {
    if (shift === 'morning') {
      if (morningOffs.includes(day)) setMorningOffs(morningOffs.filter(d => d !== day));
      else setMorningOffs([...morningOffs, day]);
    } else {
      if (eveningOffs.includes(day)) setEveningOffs(eveningOffs.filter(d => d !== day));
      else setEveningOffs([...eveningOffs, day]);
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
          <Text style={styles.headerTitle}>Create Your Practice</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.stepperContainer}>
            <Step icon="checkmark" label="Account Type" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step icon="checkmark" label="Doctor Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step icon="checkmark" label="Clinic Info" state="completed" />
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <Step number="4" label="Setup" state="active" />
          </View>

          {/* Title Area */}
          <View style={styles.titleArea}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.title}>Working Hours & Queue Setup</Text>
              <Text style={styles.subtitle}>
                Set your clinic timing and queue preferences.{'\n'}
                You can change these later in settings.
              </Text>
            </View>
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="calendar-outline" size={40} color="#60A5FA" style={{ marginBottom: 4 }} />
              <Ionicons name="time" size={24} color="#34D399" style={{ position: 'absolute', bottom: 10, left: 10 }} />
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>

            {/* Clinic Working Hours */}
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Clinic Working Hours</Text>
            </View>

            {/* Morning Session */}
            <View style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.sessionTitleRow}>
                  <View style={styles.iconBoxMorning}>
                    <Ionicons name="sunny-outline" size={18} color="#D97706" />
                  </View>
                  <Text style={styles.sessionName}>Morning Session</Text>
                  <Text style={styles.optionalText}>(Optional)</Text>
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
                  <Text style={styles.optionalText}>(Optional)</Text>
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
            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
              <Ionicons name="calendar-clear-outline" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Weekly Offs (Shift-wise)</Text>
            </View>

            <View style={styles.weekOffsContainer}>
              {morningSession && (
                <>
                  <Text style={styles.weekOffsSubtitle}>Morning Session Offs</Text>
                  <View style={styles.daysRow}>
                    {daysOfWeek.map((day) => {
                      const isOff = morningOffs.includes(day);
                      return (
                        <Pressable
                          key={`m-${day}`}
                          style={[styles.dayPill, isOff && styles.dayPillActive]}
                          onPress={() => toggleOff(day, 'morning')}
                        >
                          <Text style={[styles.dayText, isOff && styles.dayTextActive]}>{day}</Text>
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
                      const isOff = eveningOffs.includes(day);
                      return (
                        <Pressable
                          key={`e-${day}`}
                          style={[styles.dayPill, isOff && styles.dayPillActive]}
                          onPress={() => toggleOff(day, 'evening')}
                        >
                          <Text style={[styles.dayText, isOff && styles.dayTextActive]}>{day}</Text>
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

            {/* Daily Token Settings */}
            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
              <Ionicons name="ticket-outline" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Daily Token Settings</Text>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Max Tokens (Morning)</Text>
                  <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#10B981" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value="40"
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Max Tokens (Evening)</Text>
                  <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#10B981" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value="30"
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            </View>

            {/* Consultation Settings */}
            <View style={[styles.sectionHeader, { marginTop: 10 }]}>
              <Ionicons name="hourglass-outline" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Consultation Settings</Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Average Consultation Time</Text>
                <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" style={{ marginLeft: 4 }} />
              </View>
              <View style={styles.dropdownWrapper}>
                <Ionicons name="time-outline" size={18} color="#4B5563" style={styles.inputIcon} />
                <Text style={styles.dropdownText}>10 Minutes</Text>
                <Ionicons name="chevron-down" size={18} color="#6B7280" style={{ paddingRight: 16 }} />
              </View>
            </View>

            {/* Allow Walk-in Patients */}
            <View style={styles.walkInContainer}>
              <View style={styles.walkInIconBox}>
                <Ionicons name="notifications-outline" size={20} color="#4F46E5" />
              </View>
              <View style={styles.walkInTextContainer}>
                <Text style={styles.walkInTitle}>Allow Walk-in Patients</Text>
                <Text style={styles.walkInSubtitle}>Allow patients to join without prior booking</Text>
              </View>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#34D399' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#D1D5DB"
                onValueChange={setAllowWalkIn}
                value={allowWalkIn}
              />
            </View>

            {/* Tip Notice */}
            <View style={styles.tipNotice}>
              <View style={styles.tipIconWrapper}>
                <Ionicons name="bulb-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.tipTextWrapper}>
                <Text style={styles.tipNoticeTitle}>Tip</Text>
                <Text style={styles.tipNoticeSubtitle}>
                  These settings will help us manage your queue smoothly and provide a better experience for your patients.
                </Text>
              </View>
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
    width: 70,
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
    marginHorizontal: -20,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },

  // Sessions
  sessionCard: {
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
    fontWeight: '600',
    color: '#111827',
  },
  optionalText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  timeText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  toText: {
    fontSize: 14,
    color: '#6B7280',
    marginHorizontal: 12,
  },

  // Week Offs
  weekOffsContainer: {
    marginBottom: 20,
  },
  weekOffsSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  dayPillActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
  },
  dayTextActive: {
    color: '#B91C1C',
    fontWeight: '600',
  },

  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
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
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    paddingRight: 14,
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },

  // Walk in
  walkInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  walkInIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walkInTextContainer: {
    flex: 1,
  },
  walkInTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  walkInSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Tip Notice
  tipNotice: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  tipIconWrapper: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  tipTextWrapper: {
    flex: 1,
  },
  tipNoticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  tipNoticeSubtitle: {
    fontSize: 12,
    color: '#047857',
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
