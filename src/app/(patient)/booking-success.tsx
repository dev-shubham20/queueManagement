import { Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

const BellIcon = ({ size = 20, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const CheckIcon = ({ size = 36, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const ClockIcon = ({ size = 16, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const UsersIcon = ({ size = 16, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const MapPinIcon = ({ size = 18, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const QueueTrackIcon = ({ size = 18, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

function parseClinicName(specialty: string) {
  const parts = specialty.split('•').map((part) => part.trim());
  return parts.length > 1 ? parts[parts.length - 1] : 'City Heart Clinic';
}

function parseDoctorRole(specialty: string) {
  const parts = specialty.split('•').map((part) => part.trim());
  return parts[0] || 'General Physician';
}

function formatSessionLabel(session: string) {
  return session === 'evening' ? 'Evening' : 'Morning';
}

function QrPlaceholder() {
  const cells = useMemo(
    () =>
      Array.from({ length: 49 }, (_, i) => ({
        key: i,
        filled: (i * 7 + 3) % 5 !== 0 && (i * 11 + 2) % 7 !== 0,
      })),
    [],
  );

  return (
    <View style={styles.qrGrid}>
      {cells.map((cell) => (
        <View
          key={cell.key}
          style={[styles.qrCell, cell.filled && styles.qrCellFilled]}
        />
      ))}
    </View>
  );
}

export default function BookingSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = (params.name as string) || 'Dr. Sarah Mitchell';
  const specialty = (params.specialty as string) || 'General Physician • City Heart Clinic';
  const image =
    (params.image as string) ||
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';
  const appointmentDate = (params.appointmentDate as string) || '24 Oct 2023';
  const session = (params.session as string) || 'morning';
  const token = (params.token as string) || 'A-24';
  const bookingId = (params.bookingId as string) || '#SC-98231';
  const expectedTime = (params.expectedTime as string) || '10:30 AM';
  const positionAhead = (params.positionAhead as string) || '4 Ahead';

  const clinicName = parseClinicName(specialty);
  const doctorRole = parseDoctorRole(specialty);
  const dateSession = `${appointmentDate}, ${formatSessionLabel(session)}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Image source={{ uri: image }} style={styles.headerAvatar} />
        <Text style={styles.brandName}>MedQueue</Text>
        <Pressable
          style={styles.bellButton}
          hitSlop={8}
          onPress={() => {
            console.log('Header bell pressed (BookingSuccess) - navigating to /notifications');
            router.replace('/notifications');
          }}
        >
          <BellIcon />
        </Pressable>
      </View>
      <View style={styles.headerDivider} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.successSection}>
          <View style={styles.successGlow}>
            <View style={styles.successCircle}>
              <CheckIcon />
            </View>
          </View>
          <Text style={styles.successTitle}>Booking Successful</Text>
          <Text style={styles.successSubtitle}>Your appointment has been confirmed.</Text>
        </View>

        <View style={styles.tokenCard}>
          <View style={styles.tokenAccent} />
          <Text style={styles.tokenLabel}>TOKEN NUMBER</Text>
          <Text style={styles.tokenValue}>{token}</Text>
          <View style={styles.tokenDashedDivider} />
          <View style={styles.tokenMetaRow}>
            <View style={styles.tokenMetaItem}>
              <Text style={styles.tokenMetaLabel}>Expected Time</Text>
              <View style={styles.tokenMetaValueRow}>
                <ClockIcon />
                <Text style={styles.tokenMetaValue}>{expectedTime}</Text>
              </View>
            </View>
            <View style={styles.tokenMetaDivider} />
            <View style={styles.tokenMetaItem}>
              <Text style={styles.tokenMetaLabel}>Position</Text>
              <View style={styles.tokenMetaValueRow}>
                <UsersIcon />
                <Text style={styles.tokenMetaValue}>{positionAhead}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.sectionLabel}>APPOINTMENT DETAILS</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailsTopRow}>
            <View>
              <Text style={styles.detailLabel}>ID</Text>
              <Text style={[styles.detailValue, styles.detailValueLeft]}>{bookingId}</Text>
            </View>
            <View style={styles.detailsTopRight}>
              <Text style={styles.detailLabel}>Date & Session</Text>
              <Text style={[styles.detailValue, styles.detailValueRight]}>{dateSession}</Text>
            </View>
          </View>

          <View style={styles.doctorCard}>
            <Image source={{ uri: image }} style={styles.doctorAvatar} />
            <View>
              <Text style={styles.doctorName}>{name}</Text>
              <Text style={styles.doctorRole}>{doctorRole}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <MapPinIcon />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.clinicName}>{clinicName}</Text>
              <Text style={styles.clinicAddress}>123 Healthcare Blvd, North Valley</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.replace('/(patient)/(tabs)/queue')}>
          <QueueTrackIcon />
          <Text style={styles.primaryButtonText}>Track Live Queue</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => router.replace('/(patient)/(tabs)/home')}>
          <Text style={styles.secondaryButtonText}>Done</Text>
        </Pressable>

        <View style={styles.qrSection}>
          <View style={styles.qrCard}>
            <QrPlaceholder />
          </View>
          <Text style={styles.qrCaption}>Scan at clinic reception</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#EBF0F6',
  },
  brandName: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
    letterSpacing: -0.3,
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#EBF0F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.six,
  },
  successSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  successGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 204, 102, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#00CC66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
  },
  tokenCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    padding: Spacing.four,
    marginBottom: Spacing.four,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
    }),
  },
  tokenAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#0052FF',
  },
  tokenLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#8E9AA8',
    letterSpacing: 1.2,
    marginBottom: 6,
    marginLeft: 8,
  },
  tokenValue: {
    fontSize: 42,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
    letterSpacing: -1,
    marginLeft: 8,
    marginBottom: Spacing.three,
  },
  tokenDashedDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D8DEE8',
    marginBottom: Spacing.three,
    marginLeft: 8,
  },
  tokenMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  tokenMetaItem: {
    flex: 1,
  },
  tokenMetaLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
    marginBottom: 6,
  },
  tokenMetaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tokenMetaValue: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  tokenMetaDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#EBF0F6',
    marginHorizontal: Spacing.three,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#8E9AA8',
    letterSpacing: 1.2,
    marginBottom: Spacing.two,
  },
  detailsCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  detailsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  detailsTopRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#8E9AA8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  detailValueLeft: {
    textAlign: 'left',
  },
  detailValueRight: {
    textAlign: 'right',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  clinicName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    marginBottom: 2,
  },
  clinicAddress: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#8E9AA8',
    lineHeight: 18,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 42,
    backgroundColor: '#0052FF',
    borderRadius: 26,
    marginBottom: 12,
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
  secondaryButton: {
    height: 42,
    backgroundColor: '#F0F2F5',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1A1C1F',
  },
  qrSection: {
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  qrGrid: {
    width: 120,
    height: 120,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  qrCell: {
    width: '14.28%',
    height: '14.28%',
    backgroundColor: '#F5F7FA',
  },
  qrCellFilled: {
    backgroundColor: '#60646C',
  },
  qrCaption: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#B0B4BA',
  },
});
