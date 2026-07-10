import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';

// Custom Icons
const UsersIcon = ({ color = '#0052FF' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const ClockIcon = ({ color = '#0052FF' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const CalendarIcon = ({ color = '#0052FF' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const RefreshIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="23 4 23 10 17 10" />
    <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);

const NavigateIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="3 11 22 2 13 21 11 13 3 11" fill="none" />
  </Svg>
);

const CallIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const Polygon = ({ points, fill, ...props }: any) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" {...props}>
    <Path d="M3 11L22 2L13 21L11 13L3 11Z" fill={fill} stroke={props.stroke} strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const updates = [
  { id: '1', title: 'Token A-19 called', subtitle: 'Proceed to Station 4B • 10:05 AM', active: true },
  { id: '2', title: 'Token A-18 completed', subtitle: 'Consultation finished • 10:02 AM', active: false },
  { id: '3', title: 'Token A-17 completed', subtitle: 'Consultation finished • 09:55 AM', active: false },
];

export default function QueueScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Queue</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Ticket Card */}
        <View style={styles.ticketCard}>
          <View style={styles.ticketHeader}>
            <View style={styles.servingBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.servingBadgeText}>Serving Now</Text>
            </View>
            <View style={styles.myTokenBadge}>
              <Text style={styles.myTokenLabel}>MY TOKEN</Text>
              <Text style={styles.myTokenValue}>A-24</Text>
            </View>
          </View>

          <View style={styles.ticketBody}>
            <Text style={styles.servingTokenLabel}>Current Token</Text>
            <Text style={styles.servingTokenValue}>A-19</Text>
          </View>

          {/* Dotted Divider */}
          <View style={styles.dividerWrapper}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dottedLine} />
            <View style={styles.cutoutRight} />
          </View>

          <View style={styles.ticketFooter}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Queue Progress</Text>
              <Text style={styles.progressPercent}>78%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
              <UsersIcon color="#4F46E5" />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Ahead of you</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
              <ClockIcon color="#EA580C" />
            </View>
            <Text style={styles.statValue}>~25m</Text>
            <Text style={styles.statLabel}>Est. wait time</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
              <CalendarIcon color="#16A34A" />
            </View>
            <Text style={styles.statValue}>10:30</Text>
            <Text style={styles.statLabel}>Expected time</Text>
          </View>
        </View>

        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80' }}
            style={styles.doctorAvatar}
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Sarah Mitchell</Text>
            <Text style={styles.doctorClinic}>City Heart Clinic • Room 4B</Text>
          </View>
          <Pressable style={styles.viewButton} onPress={()=>{router.push('/doctor-details')}}>
            <Text style={styles.viewButtonText}>View</Text>
          </Pressable>
        </View>

        {/* Live Updates */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Live Updates</Text>
          <Text style={styles.lastUpdated}>Updated just now</Text>
        </View>

        <View style={styles.timelineCard}>
          {updates.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineDot, item.active && styles.timelineDotActive]} />
                {index !== updates.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineTitle, item.active && styles.timelineTitleActive]}>{item.title}</Text>
                <Text style={styles.timelineSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <Pressable style={styles.refreshButton}>
          <RefreshIcon />
          <Text style={styles.refreshButtonText}>Refresh Status</Text>
        </Pressable>

        <View style={styles.secondaryActionsRow}>
          <Pressable style={styles.directionButton}>
            <NavigateIcon />
            <Text style={styles.directionButtonText}>Directions</Text>
          </Pressable>
          <Pressable style={styles.callButton}>
            <CallIcon />
            <Text style={styles.callButtonText}>Call Clinic</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#0052FF',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 0,
  },
  servingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  servingBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#047857',
  },
  myTokenBadge: {
    alignItems: 'flex-end',
  },
  myTokenLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  myTokenValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  ticketBody: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  servingTokenLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginBottom: 4,
  },
  servingTokenValue: {
    fontSize: 56,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    lineHeight: 64,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 1,
    marginVertical: 10,
    position: 'relative',
  },
  cutoutLeft: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    zIndex: 2,
  },
  cutoutRight: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    zIndex: 2,
  },
  dottedLine: {
    flex: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  ticketFooter: {
    padding: 20,
    paddingTop: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  progressPercent: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0052FF',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  doctorClinic: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  viewButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#0052FF',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    color: '#0F172A',
  },
  lastUpdated: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
    marginRight: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#CBD5E1',
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: '#0052FF',
    shadowColor: '#0052FF',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
    minHeight: 24,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  timelineTitle: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  timelineTitleActive: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  timelineSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0052FF',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: '#0052FF',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  refreshButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  directionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  directionButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginLeft: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  callButtonText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#DC2626',
    marginLeft: 8,
  },
});
