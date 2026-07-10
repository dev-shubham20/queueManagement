import { Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const ArrowLeftIcon = ({ size = 22, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const SunIcon = ({ size = 16, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="4" />
    <Path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Svg>
);

const MoonIcon = ({ size = 16, color = '#8E9AA8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Svg>
);

const ChevronDownIcon = ({ size = 18, color = '#8E9AA8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

const InfoIcon = ({ size = 18, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4M12 8h.01" />
  </Svg>
);

const CheckCircleIcon = ({ size = 20, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const FAMILY_OPTIONS = ['Myself', 'Spouse', 'Child', 'Parent', 'Others'];

type Session = 'morning' | 'evening';

function buildDateOptions() {
  const today = new Date();
  const options = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    options.push({
      key: date.toISOString().slice(0, 10),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      monthYear: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  return options;
}

export default function ConfirmBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const dateOptions = useMemo(() => buildDateOptions(), []);

  const name = (params.name as string) || 'Dr. Sarah Mitchell';
  const specialty = (params.specialty as string) || 'General GP • Cardiology Specialist';
  const image =
    (params.image as string) ||
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';
  const fee = (params.fee as string) || '$100';

  const [selectedDateKey, setSelectedDateKey] = useState(dateOptions[1]?.key ?? dateOptions[0].key);
  const [session, setSession] = useState<Session>('morning');
  const [familyMember, setFamilyMember] = useState('Myself');
  const [otherFamilyMember, setOtherFamilyMember] = useState('');
  const [reason, setReason] = useState('');
  const [showFamilyPicker, setShowFamilyPicker] = useState(false);

  const selectedDate = dateOptions.find((d) => d.key === selectedDateKey) ?? dateOptions[0];

  const formatAppointmentDate = (dateKey: string) => {
    const date = new Date(`${dateKey}T12:00:00`);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleConfirm = () => {
    router.push({
      pathname: '/review-booking',
      params: {
        name,
        specialty,
        image,
        fee,
        appointmentDate: formatAppointmentDate(selectedDateKey),
        session,
        familyMember,
        otherFamilyMember,
        reason: reason.trim() || 'Check-up and consultation',
      },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
        <Image source={{ uri: image }} style={styles.headerAvatar} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Text style={styles.monthLabel}>{selectedDate.monthYear}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}>
          {dateOptions.map((item) => {
            const isSelected = item.key === selectedDateKey;
            return (
              <Pressable
                key={item.key}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDateKey(item.key)}>
                <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>{item.day}</Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateTextSelected]}>{item.date}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Select Session</Text>
        <View style={styles.sessionToggle}>
          <Pressable
            style={[styles.sessionOption, session === 'morning' && styles.sessionOptionActive]}
            onPress={() => setSession('morning')}>
            <SunIcon color={session === 'morning' ? '#0052FF' : '#8E9AA8'} />
            <Text style={[styles.sessionText, session === 'morning' && styles.sessionTextActive]}>Morning</Text>
          </Pressable>
          <Pressable
            style={[styles.sessionOption, session === 'evening' && styles.sessionOptionActive]}
            onPress={() => setSession('evening')}>
            <MoonIcon color={session === 'evening' ? '#0052FF' : '#8E9AA8'} />
            <Text style={[styles.sessionText, session === 'evening' && styles.sessionTextActive]}>Evening</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Family Member (Optional)</Text>
        <Pressable style={styles.dropdown} onPress={() => setShowFamilyPicker(true)}>
          <Text style={styles.dropdownText}>{familyMember}</Text>
          <ChevronDownIcon />
        </Pressable>

        {familyMember === 'Others' && (
          <TextInput
            style={[styles.dropdown, { marginTop: 12, paddingVertical: 12 }]}
            placeholder="Enter name"
            placeholderTextColor="#B0B4BA"
            value={otherFamilyMember}
            onChangeText={setOtherFamilyMember}
          />
        )}

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Reason for Visit (Optional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Briefly describe your symptoms or reason for visit..."
          placeholderTextColor="#B0B4BA"
          value={reason}
          onChangeText={setReason}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.noteBox}>
          <View style={styles.noteHeader}>
            <InfoIcon />
            <Text style={styles.noteTitle}>Important Note</Text>
          </View>
          <Text style={styles.noteBody}>
            A queue token and estimated consultation time will be automatically generated after your
            booking is confirmed. Please reach the clinic at least one hour before your estimated
            consultation time to avoid missing your turn.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.doctorCard}>
          <View style={styles.doctorAccent} />
          <Image source={{ uri: image }} style={styles.doctorAvatar} />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{name}</Text>
            <Text style={styles.doctorSpecialty}>{specialty}</Text>
          </View>
          <View style={styles.feeGroup}>
            <Text style={styles.feeLabel}>Fee</Text>
            <Text style={styles.feeAmount}>{fee}</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
          ]}
          onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Review Booking</Text>
          <CheckCircleIcon />
        </Pressable>
      </View>

      <Modal visible={showFamilyPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowFamilyPicker(false)}>
          <View style={styles.modalSheet}>
            {FAMILY_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  setFamilyMember(option);
                  setShowFamilyPicker(false);
                }}>
                <Text
                  style={[
                    styles.modalOptionText,
                    familyMember === option && styles.modalOptionTextActive,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
    letterSpacing: -0.3,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#EBF0F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    letterSpacing: -0.2,
  },
  sectionSpacing: {
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  monthLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#0052FF',
  },
  dateRow: {
    gap: 10,
    paddingBottom: 4,
  },
  dateCard: {
    width: 58,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dateCardSelected: {
    backgroundColor: '#0052FF',
    borderColor: '#0052FF',
  },
  dateDay: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
  },
  dateNumber: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  dateTextSelected: {
    color: '#ffffff',
  },
  sessionToggle: {
    flexDirection: 'row',
    backgroundColor: '#EEF1F6',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  sessionOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  sessionOptionActive: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    }),
  },
  sessionText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#8E9AA8',
  },
  sessionTextActive: {
    color: '#0052FF',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1A1C1F',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    minHeight: 110,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#1A1C1F',
    lineHeight: 22,
  },
  noteBox: {
    marginTop: Spacing.four,
    backgroundColor: '#EEF4FF',
    borderWidth: 1,
    borderColor: '#D6E4FF',
    borderRadius: 14,
    padding: Spacing.three,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  noteBody: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#60646C',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#EBF0F6',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Platform.OS === 'ios' ? Spacing.four : Spacing.three,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    overflow: 'hidden',
  },
  doctorAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0052FF',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 8,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.two,
    marginRight: Spacing.two,
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
    lineHeight: 16,
  },
  feeGroup: {
    alignItems: 'flex-end',
  },
  feeLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
    marginBottom: 2,
  },
  feeAmount: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 44,
    backgroundColor: '#0052FF',
    borderRadius: 27,
    ...Platform.select({
      ios: {
        shadowColor: '#0052FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 12px rgba(0,82,255,0.25)' },
    }),
  },
  confirmButtonPressed: {
    opacity: 0.9,
  },
  confirmButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: Spacing.two,
    paddingBottom: Spacing.five,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.four,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: '#1A1C1F',
  },
  modalOptionTextActive: {
    color: '#0052FF',
    fontFamily: 'Inter_700Bold',
  },
});
