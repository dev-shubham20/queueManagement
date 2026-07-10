import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import BottomTabBar from '../components/BottomTabBar';
import { Ionicons } from '@expo/vector-icons';

// Icons
const ArrowLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const BellIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const UserIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const MegaphoneIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 11.082l-7.79 3.12A1.921 1.921 0 0 1 1 12.392V6.608c0-1.285 1.258-2.19 2.454-1.742L11 7.918" />
    <Path d="M11 7.918V11.08m0-3.162h5c2.3 0 5 1 5 3 0 2-2.7 3-5 3h-5v-6.162z" />
    <Path d="M14 14l-2 5a2 2 0 0 1-3.8-1l2-4" />
  </Svg>
);

const GlobeIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);

const ShieldIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const LockIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

const DocumentIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

const HelpIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const MailIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Polyline points="22,6 12,13 2,6" />
  </Svg>
);

const InfoIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="16" x2="12" y2="12" />
    <Line x1="12" y1="8" x2="12.01" y2="8" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

export default function SettingsScreen() {
  const router = useRouter();

  const [queueAlerts, setQueueAlerts] = useState(true);
  const [aptReminders, setAptReminders] = useState(true);
  const [promoUpdates, setPromoUpdates] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeftIcon />
          </Pressable>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80' }}
          style={styles.headerAvatar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow} onPress={() => router.push('/profile' as any)}>
            <View style={styles.iconContainer}>
              <UserIcon />
            </View>
            <Text style={styles.rowText}>Doctor & Clinic Profile</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.cardGroup}>
          <View style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <BellIcon />
            </View>
            <Text style={styles.rowText}>Queue Alerts</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={queueAlerts}
              onValueChange={setQueueAlerts}
              trackColor={{ true: '#0052FF', false: '#CBD5E1' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <CalendarIcon />
            </View>
            <Text style={styles.rowText}>Appointment Reminders</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={aptReminders}
              onValueChange={setAptReminders}
              trackColor={{ true: '#0052FF', false: '#CBD5E1' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <MegaphoneIcon />
            </View>
            <Text style={styles.rowText}>Promotional Updates</Text>
            <View style={{ flex: 1 }} />
            <Switch
              value={promoUpdates}
              onValueChange={setPromoUpdates}
              trackColor={{ true: '#0052FF', false: '#CBD5E1' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <GlobeIcon />
            </View>
            <Text style={styles.rowText}>Language</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.valueText}>English</Text>
            <ChevronRightIcon />
          </Pressable>
        </View>

        {/* Privacy & Security */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <ShieldIcon />
            </View>
            <Text style={styles.rowText}>Privacy Policy</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <LockIcon />
            </View>
            <Text style={styles.rowText}>Data Security</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <DocumentIcon />
            </View>
            <Text style={styles.rowText}>Terms of Service</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow} onPress={() => router.push('/help-support' as any)}>
            <View style={styles.iconContainer}>
              <HelpIcon />
            </View>
            <Text style={styles.rowText}>Help Center</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <MailIcon />
            </View>
            <Text style={styles.rowText}>Contact Us</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.cardRow}>
            <View style={styles.iconContainer}>
              <InfoIcon />
            </View>
            <Text style={styles.rowText}>About Smart Clinic</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
        </View>

        {/* Log Out */}
        <View style={[styles.cardGroup, { marginBottom: 40 }]}>
          <Pressable style={styles.cardRow} onPress={() => router.replace('/login')}>
            <View style={styles.iconContainer}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            </View>
            <Text style={[styles.rowText, { color: '#EF4444', fontFamily: 'Inter_600SemiBold' }]}>Log Out</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: '#0052FF',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
    marginTop: 24,
    marginBottom: 12,
  },
  cardGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1E293B',
  },
  valueText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#0052FF',
    marginRight: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 54, // Aligned with the text
  },
});
