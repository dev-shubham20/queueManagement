import { Spacing } from '@/constants/theme';
import { Storage } from '@/utils/storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const ArrowLeftIcon = ({ size = 22, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const UserIcon = ({ size = 22, color = '#8E9AA8' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const CalendarIcon = ({ size = 14, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const ClockIcon = ({ size = 14, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const MapPinIcon = ({ size = 18, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const InfoIcon = ({ size = 18, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 16v-4M12 8h.01" />
  </Svg>
);

const TicketIcon = ({ size = 18, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 20" fill="none">
    <Path
      d="M2,4 C2,2.9 2.9,2 4,2 L20,2 C21.1,2 22,2.9 22,4 L22,8 C21,8 20,8.9 20,10 C20,11.1 21,12 22,12 L22,16 C22,17.1 21.1,18 20,18 L4,18 C2.9,18 2,17.1 2,16 L2,12 C3,12 4,11.1 4,10 C4,8.9 3,8 2,8 L2,4 Z"
      fill={color}
    />
    <Circle cx={12} cy={7} r={1.2} fill="#0052FF" />
    <Circle cx={12} cy={10} r={1.2} fill="#0052FF" />
    <Circle cx={12} cy={13} r={1.2} fill="#0052FF" />
  </Svg>
);

function formatFeeAmount(fee: string) {
  const numeric = fee.replace(/[^0-9.]/g, '');
  if (!numeric) return '$100.00';
  const value = Number.parseFloat(numeric);
  return `$${value.toFixed(2)}`;
}

function parseClinicName(specialty: string) {
  const parts = specialty.split('•').map((part) => part.trim());
  return parts.length > 1 ? parts[parts.length - 1] : 'City Heart Clinic';
}

function parseDoctorRole(specialty: string) {
  const parts = specialty.split('•').map((part) => part.trim());
  return parts[0] || 'General Physician';
}

export default function ReviewBookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [confirming, setConfirming] = useState(false);

  const name = (params.name as string) || 'Dr. Sarah Mitchell';
  const specialty = (params.specialty as string) || 'General Physician • City Heart Clinic';
  const image =
    (params.image as string) ||
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';
  const fee = (params.fee as string) || '$100';
  const appointmentDate = (params.appointmentDate as string) || '24 Oct 2023';
  const session = (params.session as string) || 'morning';
  const familyMember = (params.familyMember as string) || 'Myself';
  const otherFamilyMember = (params.otherFamilyMember as string) || '';
  const reason = (params.reason as string) || 'Check-up and consultation';

  const feeAmount = formatFeeAmount(fee);
  const sessionLabel = session === 'evening' ? 'Evening Session' : 'Morning Session';
  const clinicName = parseClinicName(specialty);
  const doctorRole = parseDoctorRole(specialty);
  const patientName = familyMember === 'Myself' ? 'John Doe' : familyMember === 'Others' && otherFamilyMember ? otherFamilyMember : familyMember;

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await Storage.setItem('hasActiveToken', 'true');
      router.replace({
        pathname: '/booking-success',
        params: {
          name,
          specialty,
          image,
          appointmentDate,
          session,
          token: 'A-24',
          bookingId: '#SC-98231',
          expectedTime: '10:30 AM',
          positionAhead: '4 Ahead',
        },
      } as any);
    } catch (e) {
      console.error('Error confirming booking', e);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Review Booking</Text>
        <Image source={{ uri: image }} style={styles.headerAvatar} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>PATIENT DETAILS</Text>
        <View style={styles.card}>
          <View style={styles.patientRow}>
            <View style={styles.patientIcon}>
              <UserIcon />
            </View>
            <View>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientRelation}>Relationship: {familyMember}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>APPOINTMENT</Text>
        <View style={styles.card}>
          <View style={styles.doctorRow}>
            <Image source={{ uri: image }} style={styles.doctorAvatar} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{name}</Text>
              <Text style={styles.doctorRole}>{doctorRole}</Text>
            </View>
            <View style={styles.feeBadge}>
              <Text style={styles.feeBadgeText}>{fee}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <CalendarIcon />
              <Text style={styles.metaText}>{appointmentDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <ClockIcon />
              <Text style={styles.metaText}>{sessionLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <MapPinIcon />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.clinicAddress}>123 Health Ave, Central District, Metropolis</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>REASON FOR VISIT</Text>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonText}>&ldquo;{reason}&rdquo;</Text>
        </View>

        <Text style={styles.sectionLabel}>PAYMENT SUMMARY</Text>
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Consultation Fee</Text>
            <Text style={styles.paymentValue}>{feeAmount}</Text>
          </View>
          <View style={styles.paymentRow}>
            <View style={styles.serviceFeeLabel}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <View style={styles.promoBadge}>
                <Text style={styles.promoText}>PROMO</Text>
              </View>
            </View>
            <Text style={styles.promoValue}>$0.00</Text>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{feeAmount}</Text>
          </View>
        </View>

        <View style={styles.noteBox}>
          <InfoIcon />
          <Text style={styles.noteText}>
            Your queue token and estimated wait time will be generated automatically once you
            confirm this booking.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
            confirming && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={confirming}>
          <Text style={styles.confirmButtonText}>
            {confirming ? 'Generating Token...' : 'Confirm & Generate Token'}
          </Text>
          <TicketIcon />
        </Pressable>
        <Text style={styles.stepText}>STEP 3 OF 3: SECURE CONFIRMATION</Text>
      </View>
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#8E9AA8',
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
    marginTop: Spacing.three,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    padding: Spacing.three,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    }),
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  patientIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 2,
  },
  patientRelation: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.three,
    marginRight: Spacing.two,
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 2,
  },
  doctorRole: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
  },
  feeBadge: {
    backgroundColor: '#E6F9F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  feeBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#00A854',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBF0F6',
    marginVertical: Spacing.three,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#60646C',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    padding: Spacing.three,
    marginTop: Spacing.two,
    gap: Spacing.three,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 4,
  },
  clinicAddress: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#8E9AA8',
    lineHeight: 18,
  },
  reasonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    padding: Spacing.three,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    color: '#60646C',
    lineHeight: 22,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  paymentLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  paymentValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1C1F',
  },
  serviceFeeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoBadge: {
    backgroundColor: '#E6F9F0',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  promoText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#00A854',
    letterSpacing: 0.5,
  },
  promoValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#00A854',
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D8DEE8',
    marginVertical: Spacing.two,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF4FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6E4FF',
    padding: Spacing.three,
    marginTop: Spacing.four,
  },
  noteText: {
    flex: 1,
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
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 54,
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
  stepText: {
    marginTop: Spacing.two,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#B0B4BA',
    letterSpacing: 1.4,
  },
});
