import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Spacing } from '@/constants/theme';
import { Storage } from '@/utils/storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Reusable inline SVG Icons for cross-platform reliability (fixes boxed 'X' glyphs)
const SearchIcon = ({ size = 14, color = '#0066FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

const FilterIcon = ({ size = 14, color = '#90949C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 6h16M6 12h12M10 18h4"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  </Svg>
);

const VerifiedIcon = ({ size = 16, color = '#0066FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
      fill={color}
    />
  </Svg>
);

const CalendarIcon = ({ size = 14, color = '#00CC66' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const TicketIcon = ({ size = 18, color = '#0066FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
    <Path d="M12 9v6" strokeDasharray="2 2" />
  </Svg>
);

const CheckIcon = ({ size = 10, color = '#00CC66' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
);

const ChevronLeftIcon = ({ size = 14, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const BellIcon = ({ size = 14, color = '#0066FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const ClockIcon = ({ size = 16, color = '#0066FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const ArrowRightIcon = ({ size = 16, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M12 5l7 7-7 7" />
  </Svg>
);

export default function OnboardingScreen() {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(0);

  const handleNext = async () => {
    if (pageIndex < 2) {
      setPageIndex(pageIndex + 1);
    } else {
      await Storage.setItem('hasOnboarded', 'true');
      router.replace('/login' as any);
    }
  };

  const handleSkip = async () => {
    await Storage.setItem('hasOnboarded', 'true');
    router.replace('/login' as any);
  };

  // Content for each onboarding step
  const onboardingData = [
    {
      title: 'Find Your Doctor',
      description: 'Search for specialists and book appointments in just a few taps.',
      // Coded Illustration for Page 1
      renderIllustration: () => (
        <View style={styles.illustrationContainer}>
          {/* Background Doctor Photo */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80' }}
            style={styles.doctorImage}
            contentFit="cover"
          />
          {/* Overlay 1: Search Bar Mockup */}
          <View style={[styles.overlayCard, styles.searchOverlay]}>
            <View style={styles.searchIconContainer}>
              <SearchIcon size={14} color="#0066FF" />
            </View>
            <View style={styles.searchSkeletonContainer}>
              <View style={styles.skeletonLineLong} />
              <View style={styles.skeletonLineShort} />
            </View>
            <FilterIcon size={14} color="#90949C" />
          </View>

          {/* Overlay 2: Top Rated Specialists Badge */}
          <View style={[styles.overlayCard, styles.specialistsOverlay]}>
            <View style={styles.verifiedRow}>
              <VerifiedIcon size={16} color="#0066FF" />
              <Text style={styles.specialistsText}>Top Rated Specialists</Text>
            </View>
            <View style={[styles.skeletonLineLong, { marginTop: Spacing.one }]} />
            <View style={styles.pillRow}>
              <View style={styles.skeletonPill} />
              <View style={styles.skeletonPill} />
            </View>
          </View>

          {/* Overlay 3: Available Now Badge */}
          <View style={[styles.overlayCard, styles.availableBadge]}>
            <View style={styles.availableIconBg}>
              <CalendarIcon size={14} color="#00CC66" />
            </View>
            <Text style={styles.availableText}>Available Now</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Get Your Token',
      description: 'Skip the physical queue. Receive a digital token immediately after booking your appointment.',
      // Coded Illustration for Page 2
      renderIllustration: () => (
        <View style={styles.illustrationContainer}>
          {/* Decorative background cards to create depth */}
          <View style={styles.tokenBgCard} />
          
          {/* Main Token Card */}
          <View style={styles.tokenCard}>
            <View style={styles.tokenHeader}>
              <View style={styles.tokenIconContainer}>
                <TicketIcon size={18} color="#0066FF" />
              </View>
              <View style={styles.tokenHeaderRight}>
                <Text style={styles.tokenLabel}>TOKEN</Text>
                <Text style={styles.tokenNumber}>#A24</Text>
              </View>
              <View style={styles.instantBadge}>
                <CheckIcon size={10} color="#00CC66" />
                <Text style={styles.instantText}>Instant</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '50%' }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelLeft}>Booking Confirmed</Text>
              <Text style={styles.progressLabelRight}>Active</Text>
            </View>

            {/* Dashed Line */}
            <View style={styles.dividerDashed} />

            {/* Assigned Doctor */}
            <View style={styles.doctorRow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=100&q=80' }}
                style={styles.doctorAvatar}
              />
              <View style={styles.doctorDetails}>
                <Text style={styles.assignedLabel}>Assigned to</Text>
                <Text style={styles.doctorName}>Dr. Mitchell</Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      title: 'Track Live Queue',
      description: 'Monitor your turn in real-time from anywhere. We will notify you when it is time for your consultation.',
      // Coded Illustration for Page 3
      renderIllustration: () => (
        <View style={styles.illustrationContainer}>
          {/* Phone Frame wrapper */}
          <View style={styles.phoneFrame}>
            {/* Phone notch */}
            <View style={styles.phoneNotch} />
            
            {/* Inner Phone Screen Content */}
            <View style={styles.phoneScreen}>
              {/* Phone Header */}
              <View style={styles.phoneHeaderRow}>
                <View style={styles.phoneIconButton}>
                  <ChevronLeftIcon size={14} color="#60646C" />
                </View>
                <Text style={styles.phoneHeaderTitle}>Live Status</Text>
                <View style={styles.phoneIconButton}>
                  <BellIcon size={14} color="#0066FF" />
                </View>
              </View>

              {/* Card 1: Queue Position */}
              <View style={styles.phoneCard}>
                {/* Floating "You're Checked In" Badge */}
                <View style={styles.checkedInBadge}>
                  <View style={styles.checkCircleBg}>
                    <CheckIcon size={10} color="#00CC66" />
                  </View>
                  <Text style={styles.checkedInText}>{"You're Checked In"}</Text>
                </View>

                <Text style={styles.phoneCardLabel}>QUEUE POSITION</Text>
                <View style={styles.positionRow}>
                  <Text style={styles.positionNumber}>#04</Text>
                  <Text style={styles.positionSuffix}> in line</Text>
                </View>
                <View style={[styles.progressBarBg, { marginTop: Spacing.two }]}>
                  <View style={[styles.progressBarFill, { width: '70%' }]} />
                </View>
              </View>

              {/* Card 2: Estimated Wait */}
              <View style={styles.waitCard}>
                <ClockIcon size={16} color="#0066FF" />
                <Text style={styles.waitText}>
                  Estimated wait <Text style={styles.waitTextBold}>~12 minutes</Text>
                </Text>
              </View>

              {/* Card 3: Hospital/Clinic Details */}
              <View style={styles.clinicRow}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1587351021355-a479b299d2f9?auto=format&fit=crop&w=100&q=80' }}
                  style={styles.clinicImage}
                />
                <View style={styles.clinicDetails}>
                  <Text style={styles.clinicName}>City General Clinic</Text>
                  <Text style={styles.clinicDepartment}>General Practice • Room 3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={pageIndex === 0 ? styles.headerCenter : styles.headerRow}>
        <View style={styles.brandingRow}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoSquareText}>+</Text>
          </View>
          <Text style={styles.brandingText}>MedQueue</Text>
        </View>
        {pageIndex > 0 && (
          <Pressable onPress={handleSkip} hitSlop={15} style={styles.skipCapsule}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        )}
      </View>

      {/* Main Swipeable Content wrapped in Animated container */}
      <Animated.View 
        key={pageIndex}
        entering={FadeIn.duration(400)}
        style={styles.contentContainer}
      >
        {/* Dynamic Illustration */}
        {onboardingData[pageIndex].renderIllustration()}

        {/* Text Details */}
        <View style={styles.textDetails}>
          <Text style={styles.title}>{onboardingData[pageIndex].title}</Text>
          <Text style={styles.description}>{onboardingData[pageIndex].description}</Text>
        </View>
      </Animated.View>

      {/* Pagination & Button Layout */}
      <View style={styles.footerContainer}>
        {/* Page Dots */}
        <View style={styles.dotsRow}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                pageIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Button */}
        <Pressable style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {pageIndex === 2 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRightIcon size={16} color="#ffffff" />
        </Pressable>

        {/* Skip Intro link (Only on Page 1) */}
        {pageIndex === 0 && (
          <Pressable style={styles.skipIntroLink} onPress={handleSkip}>
            <Text style={styles.skipIntroText}>Skip Intro</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  headerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logoSquare: {
    width: 26,
    height: 26,
    backgroundColor: '#0052FF',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSquareText: {
    color: '#ffffff',
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    lineHeight: 19,
  },
  brandingText: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: '#0052FF',
    letterSpacing: -0.5,
  },
  skipCapsule: {
    backgroundColor: '#F0F2F6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#60646C',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  illustrationContainer: {
    width: '100%',
    maxWidth: 360,
    height: SCREEN_HEIGHT * 0.38,
    maxHeight: 330,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  // PAGE 1 ILLUSTRATION STYLES (Glassmorphic)
  doctorImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  overlayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: Spacing.two,
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 6px 16px rgba(0,0,0,0.04)',
      },
    }),
  },
  searchOverlay: {
    top: '52%',
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    height: 52,
    borderRadius: 14,
    gap: Spacing.two,
  },
  searchIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSkeletonContainer: {
    flex: 1,
    gap: 4,
  },
  skeletonLineLong: {
    height: 6,
    width: '60%',
    backgroundColor: '#E0E1E6',
    borderRadius: 3,
  },
  skeletonLineShort: {
    height: 6,
    width: '35%',
    backgroundColor: '#F0F0F3',
    borderRadius: 3,
  },
  specialistsOverlay: {
    top: '73%',
    left: Spacing.four,
    right: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  specialistsText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.one,
  },
  skeletonPill: {
    height: 16,
    width: 48,
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
  },
  availableBadge: {
    top: '58%',
    right: -8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  availableIconBg: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E6F9F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },

  // PAGE 2 ILLUSTRATION STYLES
  tokenBgCard: {
    width: '84%',
    height: '82%',
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#E2E7F3',
    borderRadius: 24,
    position: 'absolute',
    transform: [{ rotate: '-3deg' }],
    opacity: 0.8,
  },
  tokenCard: {
    width: '84%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#EBF0F6',
    ...Platform.select({
      ios: {
        shadowColor: '#0052FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 8px 24px rgba(0, 82, 255, 0.05)',
      },
    }),
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  tokenIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.two,
  },
  tokenHeaderRight: {
    flex: 1,
  },
  tokenLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#90949C',
    letterSpacing: 0.8,
  },
  tokenNumber: {
    fontSize: 22,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#0052FF',
  },
  instantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  instantText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#00CC66',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#F0F2F6',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0052FF',
    borderRadius: 3.5,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  progressLabelLeft: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#90949C',
  },
  progressLabelRight: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  dividerDashed: {
    borderWidth: 0.5,
    borderColor: '#EBF0F6',
    borderStyle: 'dashed',
    marginVertical: Spacing.three,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F6FA',
  },
  doctorDetails: {
    flex: 1,
  },
  assignedLabel: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: '#90949C',
  },
  doctorName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },

  // PAGE 3 ILLUSTRATION STYLES
  phoneFrame: {
    width: 210,
    height: '95%',
    backgroundColor: '#111215',
    borderRadius: 36,
    padding: 6,
    borderWidth: 3,
    borderColor: '#23252A',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 12px 32px rgba(0,0,0,0.12)',
      },
    }),
  },
  phoneNotch: {
    width: 80,
    height: 16,
    backgroundColor: '#111215',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    zIndex: 10,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 30,
    padding: Spacing.three,
    paddingTop: Spacing.five,
    gap: Spacing.two,
  },
  phoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: Spacing.one,
  },
  phoneIconButton: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#EBF0F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneHeaderTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  phoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: Spacing.three,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EBF0F6',
  },
  checkedInBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F9F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    position: 'absolute',
    top: -8,
    right: 8,
  },
  checkCircleBg: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedInText: {
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    color: '#00CC66',
  },
  phoneCardLabel: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: '#90949C',
    letterSpacing: 0.6,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  positionNumber: {
    fontSize: 28,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#0052FF',
  },
  positionSuffix: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#60646C',
  },
  waitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: Spacing.two,
    gap: 6,
  },
  waitText: {
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    color: '#60646C',
  },
  waitTextBold: {
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 'auto',
    marginBottom: Spacing.one,
  },
  clinicImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EBF0F6',
  },
  clinicDetails: {
    flex: 1,
  },
  clinicName: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#1A1C1F',
  },
  clinicDepartment: {
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
    color: '#90949C',
  },

  // DETAILS STYLES
  textDetails: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#1A1C1F',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#60646C',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.three,
  },

  // FOOTER STYLES
  footerContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    width: '100%',
    gap: Spacing.three,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#0052FF',
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#EBF0F6',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#0052FF',
    width: '100%',
    maxWidth: 320,
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#0052FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.22,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 6px 16px rgba(0, 82, 255, 0.25)',
      },
    }),
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  skipIntroLink: {
    paddingVertical: 4,
  },
  skipIntroText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#60646C',
  },
});
