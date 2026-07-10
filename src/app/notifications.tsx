import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const BellIcon = ({ size = 18, color = '#1A1C1F' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const SettingsIcon = ({ size = 18, color = '#556987' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.7.14 1.36.4 1.95.8a1.65 1.65 0 0 1 .52 2.26Z" />
  </Svg>
);

const ArrowRightIcon = ({ size = 14, color = '#ffffff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 12h14M13 5l7 7-7 7" />
  </Svg>
);

const notifications = [
  {
    id: '1',
    title: "It's your Turn",
    subtitle: 'Please proceed to Station 4B. Dr. Sarah Mitchell is ready to see you.',
    time: 'Just now',
    accent: '#E5EDFF',
    button: 'Check In at Reception',
  },
  {
    id: '2',
    title: '2 Patients Ahead',
    subtitle: 'Your turn is approaching! Only 2 patients are ahead of you in the General Practice queue.',
    time: '5m ago',
    accent: '#F3F5F9',
    progress: 60,
  },
  {
    id: '3',
    title: 'Doctor Running Late',
    subtitle: 'Dr. Sarah Mitchell is running 15 minutes behind schedule. We apologize for the delay and appreciate your patience.',
    time: '12m ago',
    accent: '#FEF2F2',
  },
  {
    id: '4',
    title: 'Token Generated',
    subtitle: 'Your token A-24 has been successfully generated for 10:30 AM appointment.',
    time: '2h ago',
    accent: '#EFF7EE',
  },
];

function NotificationItem({ item }: { item: typeof notifications[number] }) {
  const hasAction = Boolean(item.button);

  return (
    <View style={[styles.notificationCard, { backgroundColor: item.accent }]}> 
      <View style={styles.notificationHeader}>
        <View style={styles.notificationStatus}>
          <View style={styles.statusDot} />
          <ThemedText style={styles.notificationTitle}>{item.title}</ThemedText>
        </View>
        <ThemedText style={styles.notificationTime}>{item.time}</ThemedText>
      </View>

      <ThemedText style={styles.notificationSubtitle}>{item.subtitle}</ThemedText>

      {hasAction ? (
        <Pressable style={styles.actionButton}>
          <ThemedText style={styles.actionButtonText}>{item.button}</ThemedText>
          <ArrowRightIcon />
        </Pressable>
      ) : item.progress ? (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
      ) : null}
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <ThemedText style={styles.brand}>ClinicQueue</ThemedText>
        <Pressable hitSlop={10} onPress={() => router.push('/notifications')}>
          <BellIcon size={20} color="#1A1C1F" />
        </Pressable>
      </View>

      <View style={styles.pageTitleRow}>
        <View>
          <ThemedText style={styles.screenTitle}>Notifications</ThemedText>
          <ThemedText style={styles.screenSubtitle}>Real-time status of your appointment</ThemedText>
        </View>
        <View style={styles.titleActions}>
          <Pressable style={styles.clearButton}>
            <ThemedText style={styles.clearText}>Clear All</ThemedText>
          </Pressable>
          {/* <Pressable style={styles.settingsButton}>
            <SettingsIcon />
          </Pressable> */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </ScrollView>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.two,
      backgroundColor: '#ffffff',
  },
  brand: { fontSize: 20, fontWeight: '800', color: '#0052FF' },
  pageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    backgroundColor: '#ffffff',
  },
  screenTitle: { fontSize: 24, fontWeight: '700', color: '#111827' },
  screenSubtitle: { fontSize: 13, lineHeight: 16, color: '#6B7280', marginTop: 6 },
  titleActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clearButton: { paddingHorizontal: 0, paddingVertical: 6 },
    clearText: { fontSize: 14, color: '#2563EB', fontWeight: '700' },
  settingsButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#F3F5F9', alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: Spacing.four, paddingBottom: 120 },
  notificationCard: { borderRadius: 20, padding: Spacing.four, marginBottom: Spacing.three, shadowColor: '#000', shadowOpacity: 0.04, marginTop: 5, shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 3 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.two },
  notificationStatus: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#DBEAFE' },
  notificationTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  notificationTime: { fontSize: 12, color: '#6B7280' },
  notificationSubtitle: { fontSize: 13, color: '#475569', marginBottom: Spacing.three, lineHeight: 20 },
  actionButton: { marginTop: Spacing.two, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0052FF', borderRadius: 14, paddingVertical: 14, gap: 8 },
  actionButtonText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700' },
  progressTrack: { height: 8, backgroundColor: '#E5E9F0', borderRadius: 8, overflow: 'hidden', marginTop: Spacing.two },
  progressFill: { height: '100%', backgroundColor: '#0052FF', borderRadius: 8 },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 78, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 14 },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabItemActive: { paddingVertical: 10 },
  tabLabel: { fontSize: 11, color: '#667085' },
  tabLabelActive: { color: '#0052FF', fontWeight: '700' },
  tabIconPlaceholder: { width: 20, height: 20, borderRadius: 6, backgroundColor: '#D1D5DB' },
  tabIconActive: { backgroundColor: '#0052FF' },
});
