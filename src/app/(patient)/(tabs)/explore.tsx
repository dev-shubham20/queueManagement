import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { DoctorRecord, MockDB } from '@/utils/storage';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const DOCTOR_AVATARS: Record<string, string> = {};
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80';

// SVG Icons matching reference screen
const SearchIcon = ({ size = 18, color = '#90949C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const FilterSettingsIcon = ({ size = 14, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 12h6" />
  </Svg>
);

const ClockIcon = ({ size = 12, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const CalendarIcon = ({ size = 12, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

export default function TabExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Filter');
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const filterOptions = ['Filter', 'Distance', 'Fee: Low-High'];

  const loadDoctors = async () => {
    try {
      const all = await MockDB.getDoctors();
      // Show only ACTIVE practitioners in patient app
      setDoctors(all.filter(d => d.status === 'ACTIVE'));
    } catch (err) {
      console.error('Failed to load doctors', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadDoctors();
    }, [])
  );

  const displayedDoctors = useMemo(() => {
    let list = [...doctors];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.clinicName && d.clinicName.toLowerCase().includes(q)) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.city && d.city.toLowerCase().includes(q))
      );
    }

    if (selectedFilter === 'Fee: Low-High') {
      list.sort((a, b) => {
        const feeA = Number.parseFloat((a.consultationFee || '500').replace(/[^0-9.]/g, '')) || 0;
        const feeB = Number.parseFloat((b.consultationFee || '500').replace(/[^0-9.]/g, '')) || 0;
        return feeA - feeB;
      });
    } else if (selectedFilter === 'Distance') {
      // Mock distance sorting
      list.sort((a, b) => (a.waitingQueueCount || 0) - (b.waitingQueueCount || 0));
    }

    return list;
  }, [doctors, searchQuery, selectedFilter]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <View style={styles.searchBarContainer}>
            <SearchIcon size={18} color="#90949C" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search doctors, clinics or specialties"
              placeholderTextColor="#90949C"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Horizontal Filters Slider */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersScroll}
        >
          {filterOptions.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <Pressable 
                key={filter} 
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterPill,
                  isActive ? styles.filterPillActive : styles.filterPillInactive
                ]}
              >
                {filter === 'Filter' && (
                  <View style={styles.filterIconPad}>
                    <FilterSettingsIcon size={13} color={isActive ? '#ffffff' : '#1A1C1F'} />
                  </View>
                )}
                <ThemedText 
                  style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive
                  ]}
                >
                  {filter}
                </ThemedText>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Available Doctors Section Title */}
        <View style={styles.resultsHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ThemedText style={styles.resultsTitle}>Available Doctors ({displayedDoctors.length})</ThemedText>
            {loading && <ActivityIndicator size="small" color="#0052FF" />}
          </View>
          <ThemedText style={styles.resultsSub}>Verified & active practitioners open for consultations</ThemedText>
        </View>

        {/* Doctor List Cards */}
        <View style={styles.doctorsList}>
          {displayedDoctors.length === 0 && !loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, marginVertical: 8 }}>
              <ThemedText style={{ fontSize: 16, fontWeight: '700', color: '#1A1C1F' }}>No Doctors Found</ThemedText>
              <ThemedText style={{ fontSize: 13, color: '#90949C', marginTop: 4 }}>Try adjusting your search terms or filters</ThemedText>
            </View>
          ) : (
            displayedDoctors.map((doc, idx) => {
              const avatarUrl = DOCTOR_AVATARS[doc.name] || DEFAULT_AVATAR;
              const hasQueue = (doc.waitingQueueCount || 0) > 0;
              const specialtySubtitle = doc.clinicName 
                ? `${doc.specialization} • ${doc.clinicName}`
                : doc.specialization;
              const isFirst = idx === 0;

              return (
                <Pressable 
                  key={doc.id || idx} 
                  onPress={() => router.push({
                    pathname: '/doctor-details',
                    params: {
                      id: doc.id,
                      name: doc.name,
                      specialty: specialtySubtitle,
                      clinicName: doc.clinicName || '',
                      image: avatarUrl,
                      fee: doc.consultationFee || '₹500',
                      waitingQueueCount: String(doc.waitingQueueCount || 0),
                      experience: doc.experience || '8 years',
                      rating: String(doc.rating || 4.8),
                    }
                  } as any)}
                  style={[
                    styles.doctorCard,
                    isFirst ? styles.doctorCardHighlighted : styles.doctorCardDefault
                  ]}
                >
                  {/* Doctor Avatar */}
                  <Image source={{ uri: avatarUrl }} style={styles.doctorAvatar} />

                  {/* Info Column */}
                  <View style={styles.doctorInfo}>
                    {/* Distance and Name Row */}
                    <View style={styles.doctorNameRow}>
                      <ThemedText style={styles.doctorName} numberOfLines={1}>{doc.name}</ThemedText>
                      <ThemedText style={styles.distanceText}>{doc.city || 'Nearby'}</ThemedText>
                    </View>

                    {/* Specialty */}
                    <ThemedText style={styles.doctorSpecialty} numberOfLines={1}>{specialtySubtitle}</ThemedText>

                    {/* Status indicator row */}
                    <View style={styles.queueStatusRow}>
                      {hasQueue ? (
                        <View style={styles.liveQueueBadge}>
                          <View style={styles.liveDot} />
                          <ThemedText style={styles.liveQueueText}>LIVE QUEUE</ThemedText>
                        </View>
                      ) : (
                        <View style={styles.waitTimeBadge}>
                          <ClockIcon size={12} color="#60646C" />
                          <ThemedText style={styles.waitTimeBadgeText}>OPEN NOW</ThemedText>
                        </View>
                      )}

                      <ThemedText style={styles.queueInfoText}>
                        {hasQueue ? `${doc.waitingQueueCount} waiting (~${queueWaitMin}m wait)` : 'No wait time'}
                      </ThemedText>
                    </View>

                    {/* Consult Fee & Call-to-action button */}
                    <View style={styles.cardBottomRow}>
                      <View style={styles.feeGroup}>
                        <ThemedText style={styles.feeAmount}>{doc.consultationFee || '₹500'}</ThemedText>
                        <ThemedText style={styles.feeLabel}> / consult</ThemedText>
                      </View>
                      
                      <Pressable 
                        style={[styles.actionButton, styles.bookButton]}
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push({
                            pathname: '/confirm-booking',
                            params: {
                              doctorId: doc.id,
                              name: doc.name,
                              specialty: specialtySubtitle,
                              clinicName: doc.clinicName || '',
                              image: avatarUrl,
                              fee: doc.consultationFee || '₹500',
                              waitingQueueCount: String(doc.waitingQueueCount || 0),
                            }
                          } as any);
                        }}
                      >
                        <ThemedText style={[styles.actionButtonText, styles.bookButtonText]}>
                          Book Now
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Smart Match Banner */}
        <View style={styles.smartMatchBanner}>
          <View style={styles.smartMatchLeft}>
            <ThemedText style={styles.smartMatchTitle}>Smart Match Active</ThemedText>
            <ThemedText style={styles.smartMatchSubtitle}>Scanning for shortest queues...</ThemedText>
          </View>
          <View style={styles.waveContainer}>
            <View style={[styles.waveBar, { height: 12 }]} />
            <View style={[styles.waveBar, { height: 20 }]} />
            <View style={[styles.waveBar, { height: 24 }]} />
            <View style={[styles.waveBar, { height: 16 }]} />
            <View style={[styles.waveBar, { height: 8 }]} />
          </View>
        </View>

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
    paddingBottom: SCREEN_HEIGHT * 0.12,
    gap: Spacing.two,
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
  // SEARCH SECTION
  searchSection: {
    marginTop: Spacing.one,
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
  // HORIZONTAL FILTERS
  filtersScroll: {
    gap: 8,
    paddingRight: Spacing.four,
    marginVertical: Spacing.one,
  },
  filterPill: {
    flexDirection: 'row',
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
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
  filterPillInactive: {
    backgroundColor: '#E9ECF2',
  },
  filterIconPad: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  filterTextInactive: {
    color: '#1A1C1F',
  },
  // AVAILABLE DOCTORS SECTION TITLE
  resultsHeader: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    gap: 2,
  },
  resultsTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: '#1A1C1F',
    letterSpacing: -0.5,
  },
  resultsSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#90949C',
  },
  // DOCTOR LIST CARDS
  doctorsList: {
    gap: 12,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  doctorCardDefault: {
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
  },
  doctorCardHighlighted: {
    borderWidth: 1.2,
    borderColor: '#EBF0F6',
    borderLeftWidth: 4,
    borderLeftColor: '#0052FF',
  },
  doctorAvatar: {
    width: 82,
    height: 82,
    borderRadius: 16,
    backgroundColor: '#F5F6FA',
    alignSelf: 'flex-start',
  },
  doctorInfo: {
    flex: 1,
    gap: 6,
  },
  doctorNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
    flex: 1,
    marginRight: 6,
  },
  distanceText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#90949C',
  },
  doctorSpecialty: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#0052FF', // Styled in blue
  },
  queueStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveQueueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#00CC66',
  },
  liveQueueText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#00CC66',
  },
  waitTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F6',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  waitTimeBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#60646C',
  },
  nextTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F6',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  nextTimeBadgeText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#60646C',
  },
  queueInfoText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  // CARD BOTTOM ROW
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  feeGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  feeAmount: {
    fontSize: 15,
    fontFamily: 'Inter_800ExtraBold',
    color: '#1A1C1F',
  },
  feeLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#90949C',
  },
  actionButton: {
    height: 34,
    borderRadius: 10,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButton: {
    backgroundColor: '#0052FF',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  waitlistButton: {
    backgroundColor: '#E9ECF2',
  },
  waitlistButtonText: {
    color: '#8E9AA8',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  // SMART MATCH BANNER
  smartMatchBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#D0E0FF',
    padding: Spacing.three,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  smartMatchLeft: {
    gap: 2,
    flex: 1,
  },
  smartMatchTitle: {
    fontSize: 13,
    fontFamily: 'Outfit_700Bold',
    color: '#0052FF',
  },
  smartMatchSubtitle: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 24,
    paddingHorizontal: 4,
  },
  waveBar: {
    width: 3.5,
    backgroundColor: '#0052FF',
    borderRadius: 1.8,
  },
});
