import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import Svg, { Path, Circle } from 'react-native-svg';
import { Spacing } from '@/constants/theme';

const ArrowLeftIcon = ({ size = 20, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const CalendarIcon = ({ size = 16, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 4H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const StarIcon = ({ size = 14, color = '#FFB000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Svg>
);

export default function DoctorDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const name = (params.name as string) || 'Dr. Elena Rodriguez';
  const specialty = (params.specialty as string) || 'Pediatrician • City Health Center';
  const image = (params.image as string) || 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300';
  const fee = (params.fee as string) || '$50';

  const handleBookAppointment = () => {
    router.push({
      pathname: '/confirm-booking',
      params: { name, specialty, image, fee },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Doctor Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Info Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: image }} style={styles.avatar} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{specialty}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <StarIcon />
              <Text style={styles.metaText}>4.9 (120 reviews)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>1.2 km away</Text>
            </View>
          </View>
        </View>

        {/* Details / About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Doctor</Text>
          <Text style={styles.sectionBody}>
            Experienced specialist dedicated to providing comprehensive and compassionate care. 
            Dr. Rodriguez leverages state-of-the-art diagnostic tools to simplify treatments 
            and improve patient outcomes.
          </Text>
        </View>

        {/* Schedule & Fees */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrapper}>
              <CalendarIcon color="#0052FF" />
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Working Hours</Text>
              <Text style={styles.detailValue}>Mon - Fri, 09:00 AM - 05:00 PM</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIconWrapper}>
              <Text style={styles.feeCurrency}>$</Text>
            </View>
            <View style={styles.detailTextWrapper}>
              <Text style={styles.detailLabel}>Consultation Fee</Text>
              <Text style={styles.detailValue}>$50.00</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Booking Action */}
      <View style={styles.footer}>
        <Pressable 
          style={({ pressed }) => [
            styles.bookButton,
            pressed && styles.bookButtonPressed,
          ]}
          onPress={handleBookAppointment}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </Pressable>
      </View>
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
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1C1F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: Spacing.five,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: Spacing.three,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1C1F',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
    textAlign: 'center',
  },
  specialty: {
    fontSize: 14,
    color: '#0052FF',
    fontWeight: '600',
    marginTop: Spacing.one,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#60646C',
    marginLeft: Spacing.one,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_500Medium',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#CBD5E1',
    marginHorizontal: Spacing.three,
  },
  section: {
    marginTop: Spacing.four,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1C1F',
    marginBottom: Spacing.two,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_700Bold',
  },
  sectionBody: {
    fontSize: 14,
    color: '#60646C',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_400Regular',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeCurrency: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0052FF',
  },
  detailTextWrapper: {
    marginLeft: Spacing.three,
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#8E9AA8',
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
  },
  detailValue: {
    fontSize: 14,
    color: '#1A1C1F',
    fontWeight: '600',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Inter_600SemiBold',
  },
  footer: {
    padding: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bookButton: {
    height: 54,
    backgroundColor: '#0052FF',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0052FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonPressed: {
    opacity: 0.85,
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
