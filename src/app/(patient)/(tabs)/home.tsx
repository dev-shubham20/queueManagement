import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Storage } from '@/utils/storage';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

// SVG Icons matching reference screens
const BellIcon = ({ size = 20, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const SearchIcon = ({ size = 18, color = '#90949C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const QueuePatientsIcon = ({ size = 18, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const CompassIcon = ({ size = 16, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </Svg>
);

const BookPlusIcon = ({ size = 20, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const ClockHistoryIcon = ({ size = 20, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <Path d="M3 3v5h5M12 7v5l4 2" />
  </Svg>
);

const MessageSquareIcon = ({ size = 20, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const HelpCircleIcon = ({ size = 20, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </Svg>
);

const StarIcon = ({ size = 11, color = '#FFB000' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#B0B4BA' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const MapPinIcon = ({ size = 12, color = '#90949C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const LogOutIcon = ({ size = 14, color = '#FF3B30' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Svg>
);

import { ActiveTokenData, DoctorRecord, MockDB } from '@/utils/storage';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToken, setActiveToken] = useState<ActiveTokenData | null>(null);
  const [clinics, setClinics] = useState<DoctorRecord[]>([]);
  const [cancelling, setCancelling] = useState(false);

  // Focus effect to load active token & live clinics from MockDB
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const loadData = async () => {
        try {
          const tokenData = await MockDB.getActiveToken();
          if (isMounted) setActiveToken(tokenData);

          const doctors = await MockDB.getDoctors();
          if (isMounted) {
            // Filter active doctors/clinics
            setClinics(doctors.filter(d => d.status === 'ACTIVE'));
          }
        } catch (e) {
          console.error('Error loading home data', e);
        }
      };
      loadData();
      return () => {
        isMounted = false;
      };
    }, [])
  );

  const handleCancelToken = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      if (activeToken?.id) {
        await MockDB.cancelActiveToken(activeToken.id);
      } else {
        await MockDB.clearActiveToken();
      }
      setActiveToken(null);
    } catch (e) {
      console.error('Error cancelling token', e);
    } finally {
      setCancelling(false);
    }
  };

  const hasActiveToken = !!activeToken;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>

        {/* Search Bar Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <SearchIcon size={18} color="#90949C" />
            <TextInput
              placeholder="Search for doctors, clinics, or specialties"
              placeholderTextColor="#90949C"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => {
                router.push({ pathname: '/explore', params: { q: searchQuery } } as any);
              }}
            />
          </View>
        </View>

        {/* Dynamic Queue Card depending on hasActiveToken */}
        {hasActiveToken && activeToken ? (
          /* Live Queue Active Consultation Panel */
          <View style={styles.liveQueueCard}>
            {/* Top Live Details Row */}
            <View style={styles.queueHeaderRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <ThemedText style={styles.liveText}>LIVE QUEUE</ThemedText>
              </View>
              
              <View style={styles.waitEstimation}>
                <ThemedText style={styles.estimateLabel}>Estimated Wait</ThemedText>
                <ThemedText style={styles.estimateValue}>~{Math.max(5, (activeToken.positionAhead || 1) * 5)} mins</ThemedText>
              </View>
            </View>

            {/* Consultation Token Number */}
            <ThemedText style={styles.tokenNumber}>#{activeToken.token}</ThemedText>

            {/* Doctor and Clinic Info */}
            <View style={{ marginBottom: 12 }}>
              <ThemedText style={{ fontSize: 16, fontWeight: '700', color: '#1A1C1F' }}>
                {activeToken.doctorName}
              </ThemedText>
              <ThemedText style={{ fontSize: 13, color: '#60646C', marginTop: 2 }}>
                {activeToken.clinicName || 'Speciality Consultation'} • {activeToken.session === 'evening' ? 'Evening' : 'Morning'} Session
              </ThemedText>
            </View>

            {/* Patients Ahead Info Bar */}
            <View style={styles.aheadBar}>
              <QueuePatientsIcon size={18} color="#0052FF" />
              <ThemedText style={styles.aheadText}>
                {activeToken.positionAhead > 0 ? `${activeToken.positionAhead} patients ahead of you` : 'You are next in queue!'}
              </ThemedText>
            </View>

            {/* Consultation Actions */}
            <View style={styles.cardActionsRow}>
              <Pressable style={styles.trackButton} onPress={() => router.push('/(patient)/(tabs)/queue')}>
                <CompassIcon size={16} color="#ffffff" />
                <ThemedText style={styles.trackButtonText}>Track Live</ThemedText>
              </Pressable>
              
              <Pressable style={styles.rescheduleButton} onPress={handleCancelToken}>
                <ThemedText style={styles.rescheduleButtonText}>
                  {cancelling ? 'Exiting...' : 'Exit Queue'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Live Queue Inactive/Empty Panel */
          <View style={styles.inactiveQueueCard}>
            <View style={styles.inactiveIconCircle}>
              <ClockHistoryIcon size={22} color="#90949C" />
            </View>
            <ThemedText style={styles.inactiveTitle}>No Active Consultation</ThemedText>
            <ThemedText style={styles.inactiveSubtitle}>
              You do not have any active queue tokens right now. Book an appointment to join a live doctor queue.
            </ThemedText>
            <Pressable style={styles.inactiveButton} onPress={() => router.push('/explore' as any)}>
              <BookPlusIcon size={14} color="#ffffff" />
              <ThemedText style={styles.inactiveButtonText}>Book New Token</ThemedText>
            </Pressable>
          </View>
        )}

        {/* Quick Horizontal Circle Actions */}
        <View style={styles.quickActionsContainer}>
          {/* Action 1: Book New */}
          <View style={styles.actionColumn}>
            <Pressable style={[styles.actionCircle, styles.actionCircleActive]} onPress={() => router.push('/explore' as any)}>
              <BookPlusIcon size={20} color="#ffffff" />
            </Pressable>
            <ThemedText style={styles.actionLabel}>Book New</ThemedText>
          </View>

          {/* Action 2: History */}
          <View style={styles.actionColumn}>
            <Pressable style={styles.actionCircle} onPress={() => router.push('/(patient)/(tabs)/book')}>
              <ClockHistoryIcon size={20} color="#60646C" />
            </Pressable>
            <ThemedText style={styles.actionLabel}>Bookings</ThemedText>
          </View>

          {/* Action 3: Live Queue */}
          <View style={styles.actionColumn}>
            <Pressable style={styles.actionCircle} onPress={() => router.push('/(patient)/(tabs)/queue')}>
              <CompassIcon size={20} color="#60646C" />
            </Pressable>
            <ThemedText style={styles.actionLabel}>Live Queue</ThemedText>
          </View>

          {/* Action 4: Help */}
          <View style={styles.actionColumn}>
            <Pressable style={styles.actionCircle} onPress={() => router.push('/(patient)/(tabs)/profile')}>
              <HelpCircleIcon size={20} color="#60646C" />
            </Pressable>
            <ThemedText style={styles.actionLabel}>Profile</ThemedText>
          </View>
        </View>

        {/* Upcoming Consultation Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>UPCOMING</ThemedText>
        </View>

        <Pressable 
          style={styles.upcomingCard}
          onPress={() => {
            if (hasActiveToken) {
              router.push('/(patient)/(tabs)/queue');
            } else {
              router.push('/explore' as any);
            }
          }}
        >
          <View style={styles.dateBadge}>
            <ThemedText style={styles.dateMonth}>TODAY</ThemedText>
            <ThemedText style={styles.dateDay}>{new Date().getDate()}</ThemedText>
          </View>
          
          <View style={styles.upcomingDetails}>
            <ThemedText style={styles.upcomingDoctor}>
              {activeToken ? activeToken.doctorName : 'No Active Appointment'}
            </ThemedText>
            <ThemedText style={styles.upcomingInfo}>
              {activeToken ? `${activeToken.specialty || 'General Consultation'} • Token #${activeToken.token}` : 'Tap to discover doctors & book a consultation'}
            </ThemedText>
          </View>

          <ChevronRightIcon size={16} color="#B0B4BA" />
        </Pressable>

        {/* Nearby Doctors Section */}
        <View style={styles.sectionHeaderRow}>
          <ThemedText style={styles.sectionTitle}>Nearby Doctors & Practices</ThemedText>
          <Pressable onPress={() => router.push('/explore' as any)}>
            <ThemedText style={styles.seeAllLink}>See All ({clinics.length})</ThemedText>
          </Pressable>
        </View>

        {clinics.length === 0 ? (
          <View style={{ padding: 24, backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9' }}>
            <ThemedText style={{ color: '#64748B', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>No Doctors Registered Yet</ThemedText>
            <ThemedText style={{ color: '#94A3B8', fontSize: 12, textAlign: 'center' }}>Once medical doctors register and get approved, they will appear here dynamically.</ThemedText>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clinicsScroll}
          >
            {clinics.map((clinic, idx) => {
              const clinicImg = idx % 2 === 0
                ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80'
                : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80';
              const waitTime = (clinic.waitingQueueCount || 0) > 0 
                ? `${(clinic.waitingQueueCount || 0) * 5} min wait`
                : 'No wait';

              return (
                <Pressable 
                  key={clinic.id || idx} 
                  style={styles.clinicCard}
                  onPress={() => {
                    router.push({
                      pathname: '/doctor-details',
                      params: {
                        id: clinic.id,
                        name: clinic.name,
                        clinicName: clinic.clinicName || '',
                        specialty: `${clinic.specialization} • ${clinic.clinicName || 'Clinic'}`,
                        fee: clinic.consultationFee || '₹500',
                        waitingQueueCount: String(clinic.waitingQueueCount || 0),
                        rating: String(clinic.rating || 4.8),
                      }
                    } as any);
                  }}
                >
                  <View style={styles.clinicImageContainer}>
                    <Image source={{ uri: clinicImg }} style={styles.clinicImage} />
                    <View style={styles.ratingBadge}>
                      <StarIcon size={11} color="#FFB000" />
                      <ThemedText style={styles.ratingValue}>{String(clinic.rating || 4.8)}</ThemedText>
                    </View>
                  </View>

                  <View style={styles.clinicInfo}>
                    <ThemedText style={styles.clinicName} numberOfLines={1}>
                      {clinic.clinicName || clinic.name}
                    </ThemedText>
                    <View style={styles.clinicMetaRow}>
                      <View style={styles.distanceGroup}>
                        <MapPinIcon size={12} color="#90949C" />
                        <ThemedText style={styles.distanceText}>{clinic.city || '0.8 km'}</ThemedText>
                      </View>
                      <View style={styles.waitPill}>
                        <ThemedText style={styles.waitPillText}>{waitTime}</ThemedText>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Reset App Trigger Link */}
        {/* <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOutIcon size={14} color="#FF3B30" />
          <ThemedText style={styles.logoutText}>Reset App & Logout</ThemedText>
        </Pressable> */}

      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFC',
  },
  safeArea: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.five,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginTop: Spacing.one,
  },
  brandingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logoSquare: {
    width: 28,
    height: 28,
    backgroundColor: '#0052FF',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquareText: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    lineHeight: 20,
  },
  brandName: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#0052FF',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGlowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  // SEARCH BAR
  searchSection: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 52,
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    gap: 10,
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0,0,0,0.01)',
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#1A1C1F',
    height: '100%',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any,
    }),
  },
  // LIVE QUEUE ACTIVE CONSULTATION
  liveQueueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    borderLeftWidth: 5,
    borderLeftColor: '#00CC66', // Live green color
    gap: Spacing.three,
    ...Platform.select({
      ios: {
        shadowColor: '#0052FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.04,
        shadowRadius: 20,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 10px 24px rgba(0, 82, 255, 0.03)',
      },
    }),
  },
  queueHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00CC66',
  },
  liveText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#00CC66',
    letterSpacing: 0.5,
  },
  waitEstimation: {
    alignItems: 'flex-end',
    gap: 2,
  },
  estimateLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#90949C',
  },
  estimateValue: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1C1F',
  },
  tokenNumber: {
    fontSize: 38,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#0052FF',
    lineHeight: 42,
    marginTop: -Spacing.one,
  },
  aheadBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    gap: 8,
  },
  aheadText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.one,
  },
  trackButton: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: '#0052FF',
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  trackButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: '#EBF0F6',
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButtonText: {
    color: '#60646C',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  // INACTIVE QUEUE CARD STYLE
  inactiveQueueCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1.5,
    borderColor: '#EBF0F6',
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  inactiveIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTitle: {
    fontSize: 15,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1C1F',
  },
  inactiveSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#90949C',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.two,
  },
  inactiveButton: {
    flexDirection: 'row',
    backgroundColor: '#0052FF',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: Spacing.four,
    marginTop: 4,
  },
  inactiveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  // QUICK HORIZONTAL CIRCLE ACTIONS
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.four,
    paddingHorizontal: Spacing.one,
  },
  actionColumn: {
    alignItems: 'center',
    gap: 6,
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0F2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCircleActive: {
    backgroundColor: '#0052FF',
    ...Platform.select({
      ios: {
        shadowColor: '#0052FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 82, 255, 0.18)',
      },
    }),
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#60646C',
  },
  // UPCOMING SECTION
  sectionHeader: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#90949C',
    letterSpacing: 0.8,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    padding: Spacing.three,
    gap: Spacing.three,
  },
  dateBadge: {
    width: 48,
    height: 48,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  dateMonth: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  dateDay: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#0052FF',
    lineHeight: 18,
  },
  upcomingDetails: {
    flex: 1,
    gap: 2,
  },
  upcomingDoctor: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  upcomingInfo: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  // NEARBY CLINICS
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  seeAllLink: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#0052FF',
  },
  clinicsScroll: {
    gap: 12,
    paddingRight: Spacing.four,
    paddingBottom: Spacing.one,
  },
  clinicCard: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    overflow: 'hidden',
  },
  clinicImageContainer: {
    width: '100%',
    height: 110,
    position: 'relative',
    backgroundColor: '#F5F6FA',
  },
  clinicImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingValue: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  clinicInfo: {
    padding: Spacing.three,
    gap: 8,
  },
  clinicName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  clinicMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#90949C',
  },
  waitPill: {
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  waitPillText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#00CC66',
  },
  // RESET APP
  logoutButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFEBEA',
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing.five,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
