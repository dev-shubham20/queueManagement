import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { Storage } from '@/utils/storage';
import Svg, { Circle, Path, Rect, Polyline, Line } from 'react-native-svg';
import { Image } from 'expo-image';

// --- Icons ---
const EditBadgeIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx="14" cy="14" r="14" fill="#0052FF" />
    <Path d="M18.71 10.71a1 1 0 0 0-1.42-1.42l-5.58 5.59-2-2a1 1 0 0 0-1.42 1.42l2.71 2.7a1 1 0 0 0 1.42 0l6.29-6.29z" fill="#fff" />
    <Path d="M17.5 9.5l-5 5-2-2 5-5 2 2z" fill="#fff"/>
  </Svg>
);
// A better pencil icon for edit badge
const PencilIcon = () => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="12" fill="#0052FF" />
    <Path d="M15.5 6.5a1.414 1.414 0 0 1 2 2l-7.5 7.5-3 1 1-3 7.5-7.5z" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const UserIcon = ({ color = '#0052FF' }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);
const EmergencyIcon = ({ color = '#D32F2F' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
    <Circle cx="9" cy="10" r="3" />
    <Line x1="16" y1="10" x2="16" y2="10" />
    <Line x1="16" y1="14" x2="16" y2="14" />
    <Path d="M6 16c0-2 2-3 3-3s3 1 3 3" />
  </Svg>
); 
const FamilyIcon = ({ color = '#475569' }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);
const GlobeIcon = ({ color = '#64748B' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Circle cx="12" cy="12" r="10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </Svg>
);
const BellIcon = ({ color = '#64748B' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);
const ShieldIcon = ({ color = '#64748B' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);
const ShieldCheckIcon = ({ color = '#64748B' }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);
const ChevronRightIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);
const ChevronDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="6 9 12 15 18 9" />
  </Svg>
);
const LogOutIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Svg>
);

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await Storage.removeItem('isLoggedIn');
    await Storage.removeItem('hasOnboarded');
    await Storage.removeItem('hasActiveToken');
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.editBadge}>
              <PencilIcon />
            </View>
          </View>
          <Text style={styles.name}>Michael Stevens</Text>
          <View style={styles.patientIdContainer}>
            <Text style={styles.patientId}>Patient ID: #8821</Text>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY ACCOUNT</Text>
            </View>
          </View>
        </View>

        {/* Personal Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <UserIcon color="#0052FF" />
              <Text style={styles.cardTitleBlue}>Personal Info</Text>
            </View>
            <Text style={styles.editLink}>Edit</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>FULL NAME</Text>
            <Text style={styles.infoValue}>Michael Stevens</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>+1 (555) 902-1144</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>m.stevens@healthcare.me</Text>
          </View>
        </View>

        {/* Lists */}
        <View style={styles.listCard}>
          <View style={styles.listIconRed}>
            <EmergencyIcon color="#D32F2F" />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listTitle}>Emergency Contacts</Text>
            <Text style={styles.listSubtitle}>2 Contacts Saved</Text>
          </View>
          <ChevronRightIcon />
        </View>

        <Pressable 
          style={styles.listCard}
          onPress={() => router.push('/family-members' as any)}
        >
          <View style={styles.listIconBlue}>
            <FamilyIcon color="#475569" />
          </View>
          <View style={styles.listContent}>
            <Text style={styles.listTitle}>Family Members</Text>
            <Text style={styles.listSubtitle}>3 Linked Profiles</Text>
          </View>
          <ChevronRightIcon />
        </Pressable>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.multiCard}>
          <View style={styles.multiCardRow}>
            <GlobeIcon />
            <Text style={styles.multiCardText}>Language</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.languageText}>English</Text>
            <ChevronDownIcon />
          </View>
          <View style={styles.divider} />
          <View style={styles.multiCardRow}>
            <BellIcon />
            <Text style={styles.multiCardText}>Push Notifications</Text>
            <View style={{ flex: 1 }} />
            <Switch value={true} onValueChange={() => {}} trackColor={{ true: '#0052FF', false: '#E2E8F0' }} />
          </View>
        </View>

        {/* Account & Security */}
        <Text style={styles.sectionTitle}>Account & Security</Text>
        <View style={styles.multiCard}>
          <Pressable style={styles.multiCardRow} onPress={() => router.push('/settings' as any)}>
            <ShieldIcon />
            <Text style={styles.multiCardText}>Security & Settings</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </Pressable>
          <View style={styles.divider} />
          <View style={styles.multiCardRow}>
            <ShieldCheckIcon />
            <Text style={styles.multiCardText}>Privacy Policy</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightIcon />
          </View>
        </View>

        {/* Logout */}
        <Pressable 
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed
          ]}
          onPress={handleLogout}
        >
          <LogOutIcon />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Smart Clinic v2.4.1 (Stable)</Text>
          <Text style={styles.footerText}>Secured by HIPAA compliant cloud systems.</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0052FF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 2,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Outfit_700Bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  patientIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patientId: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_500Medium',
  },
  primaryBadge: {
    backgroundColor: '#0052FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitleBlue: {
    color: '#0052FF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  editLink: {
    color: '#0052FF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#334155',
    fontFamily: 'Inter_500Medium',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  listIconRed: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listIconBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    color: '#1E293B',
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Inter_500Medium',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_700Bold',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  multiCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  multiCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  multiCardText: {
    fontSize: 15,
    color: '#334155',
    fontFamily: 'Inter_500Medium',
  },
  languageText: {
    fontSize: 14,
    color: '#0052FF',
    fontFamily: 'Inter_600SemiBold',
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 48,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonPressed: {
    backgroundColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 15,
    color: '#D32F2F',
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
});
