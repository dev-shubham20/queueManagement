import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const BRAND = '#1D4ED8';

const BackIcon = ({ size = 20, color = BRAND }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const ShareIcon = ({ size = 19, color = BRAND }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="18" cy="5" r="2.6" />
    <Circle cx="6" cy="12" r="2.6" />
    <Circle cx="18" cy="19" r="2.6" />
    <Path d="M8.3 10.7l7.4-4.4" />
    <Path d="M8.3 13.3l7.4 4.4" />
  </Svg>
);

const CheckIcon = ({ size = 12, color = '#16a34a' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 13l4 4L19 7" />
  </Svg>
);

const LocationIcon = ({ size = 15, color = BRAND }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 21s7-4.35 7-10a7 7 0 0 0-14 0c0 5.65 7 10 7 10z" />
    <Circle cx="12" cy="11" r="2" />
  </Svg>
);

const PhoneIcon = ({ size = 16, color = BRAND }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 2 5.18 2 2 0 0 1 4 3h3a2 2 0 0 1 2 1.72c.12 1.14.34 2.25.65 3.32a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l1.76-1.1a2 2 0 0 1 2.11-.45c1.07.31 2.18.53 3.32.65A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const TrackIcon = ({ size = 17, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 17l5-5 4 4 8-9" />
    <Path d="M14 7h6v6" />
  </Svg>
);

const PatientIcon = ({ size = 18, color = BRAND }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="16" rx="3" />
    <Circle cx="9" cy="10.5" r="2.2" />
    <Path d="M5.5 17c.6-2.2 2.2-3.4 3.5-3.4s2.9 1.2 3.5 3.4" />
    <Path d="M14.5 9.5h4" />
    <Path d="M14.5 13h4" />
  </Svg>
);

export default function BookingDetailsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
          <BackIcon />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Booking Details</ThemedText>
        <Pressable style={styles.iconButton} onPress={() => { }} hitSlop={8}>
          <ShareIcon />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Token card */}
        <View style={styles.tokenCard}>
          <View style={styles.tokenHeaderRow}>
            <View>
              <ThemedText style={styles.tokenLabel}>YOUR TOKEN NUMBER</ThemedText>
              <ThemedText style={styles.tokenValue}>A-24</ThemedText>
            </View>
            <View style={styles.tokenHeaderRight}>
              <View style={styles.statusPill}>
                <CheckIcon />
                <ThemedText style={styles.statusPillText}>Confirmed</ThemedText>
              </View>
              <ThemedText style={styles.waitText}>Est. Wait: 12 mins</ThemedText>
            </View>
          </View>

          <Pressable style={styles.trackButton} onPress={() => router.push('/queue')}>
            <TrackIcon />
            <ThemedText style={styles.trackButtonText}>Track Live Queue</ThemedText>
          </Pressable>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>CLINIC INFORMATION</ThemedText>
          <View style={styles.clinicRow}>
            <View style={styles.clinicImageWrapper}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1580281657521-9178a17ed5d8?auto=format&fit=crop&w=200&q=80' }}
                style={styles.clinicImage}
                contentFit="cover"
              />
            </View>
            <View style={styles.clinicText}>
              <ThemedText style={styles.clinicName}>City Health Specialists</ThemedText>
              <ThemedText style={styles.clinicAddress}>Suite 402, Medical Arts Tower, North Point</ThemedText>
              <Pressable style={styles.directionRow} onPress={() => { }}>
                <LocationIcon />
                <ThemedText style={styles.directionText}>Get Directions</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>APPOINTMENT DETAILS</ThemedText>
          <View style={styles.detailGrid}>
            <View style={styles.detailCell}>
              <ThemedText style={styles.detailLabel}>Doctor</ThemedText>
              <ThemedText style={styles.detailValue}>Dr. Sarah Jenkins</ThemedText>
            </View>
            <View style={styles.detailCell}>
              <ThemedText style={styles.detailLabel}>Specialty</ThemedText>
              <ThemedText style={styles.detailValue}>Cardiologist</ThemedText>
            </View>
            <View style={styles.detailCell}>
              <ThemedText style={styles.detailLabel}>Date</ThemedText>
              <ThemedText style={styles.detailValue}>Oct 24, 2023</ThemedText>
            </View>
            <View style={styles.detailCell}>
              <ThemedText style={styles.detailLabel}>Session</ThemedText>
              <ThemedText style={styles.detailValue}>Morning (10:30 AM)</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>PATIENT</ThemedText>
          <View style={styles.patientRow}>
            <View>
              <ThemedText style={styles.patientName}>Michael Stevens</ThemedText>
              <ThemedText style={styles.patientSubtitle}>Self (Primary)</ThemedText>
            </View>
            <View style={styles.patientIconBox}>
              <PatientIcon />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>PAYMENT SUMMARY</ThemedText>
          <View style={styles.paymentRow}>
            <ThemedText style={styles.paymentLabel}>Consultation Fee</ThemedText>
            <ThemedText style={styles.paymentValue}>$120.00</ThemedText>
          </View>
          <View style={styles.paymentRow}>
            <ThemedText style={styles.paymentLabel}>Facility Charge</ThemedText>
            <ThemedText style={styles.paymentValue}>$15.00</ThemedText>
          </View>
          <View style={styles.dashedDivider} />
          <View style={styles.summaryFooterRow}>
            <View>
              <ThemedText style={styles.paymentStatusLabel}>Payment Status</ThemedText>
              <ThemedText style={styles.paymentStatusValue}>PAID</ThemedText>
            </View>
            <View style={styles.totalCol}>
              <ThemedText style={styles.totalLabel}>Total Amount</ThemedText>
              <ThemedText style={styles.totalValue}>$135.00</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerRow}>
        <Pressable style={styles.cancelBookingButton} onPress={() => router.back()}>
          <ThemedText style={styles.cancelBookingText}>Cancel Booking</ThemedText>
        </Pressable>
        <Pressable style={styles.callClinicButton} onPress={() => { }}>
          <PhoneIcon />
          <ThemedText style={styles.callClinicText}>Call Clinic</ThemedText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    backgroundColor: '#ffffff',
  },
  iconButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BRAND,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
  },
  tokenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    borderTopWidth: 3,
    borderTopColor: BRAND,
    borderLeftWidth: 3,
    borderLeftColor: BRAND,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 3,
  },
  tokenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.four,
  },
  tokenLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  tokenValue: {
    fontSize: 36,
    fontWeight: '900',
    color: BRAND,
  },
  tokenHeaderRight: {
    alignItems: 'flex-end',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  waitText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  trackButton: {
    backgroundColor: BRAND,
    borderRadius: 6,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: Spacing.four,
    marginBottom: Spacing.four,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#64748B',
    marginBottom: Spacing.three,
  },
  clinicRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  clinicImageWrapper: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },
  clinicText: {
    flex: 1,
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  clinicAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 19,
    marginBottom: Spacing.one,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  directionText: {
    fontSize: 13,
    color: BRAND,
    fontWeight: '700',
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailCell: {
    width: '47%',
    marginBottom: Spacing.three,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748bb8',
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  patientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  patientSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  patientIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  paymentLabel: {
    fontSize: 13,
    color: '#475569',
  },
  paymentValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    borderStyle: 'dashed',
    marginVertical: Spacing.three,
  },
  summaryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  paymentStatusLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  paymentStatusValue: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '800',
  },
  totalCol: {
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  footerRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    paddingTop: Spacing.two,
    backgroundColor: '#F5F7FB',
    gap: Spacing.three,
  },
  cancelBookingButton: {
    flex: 1,
    backgroundColor: '#fef3f2',
    borderRadius: 8,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#b91c1c',
  },
  cancelBookingText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '700',
  },
  callClinicButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1.5,
    borderColor: BRAND,
  },
  callClinicText: {
    color: BRAND,
    fontSize: 14,
    fontWeight: '700',
  },
});
