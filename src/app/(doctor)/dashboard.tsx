import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';
import { MockDB, UserData } from '@/utils/storage';

export default function DashboardScreen() {
  const router = useRouter();
  const [session, setSession] = useState<UserData | null>(null);

  useEffect(() => {
    MockDB.getCurrentSession().then(setSession);
  }, []);

  const hasPermission = (perm: string) => {
    if (!session) return false;
    if (session.role === 'DOCTOR' || session.role === 'SUPER_ADMIN') return true;
    return session.permissions?.includes(perm) ?? false;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader 
        leftIcon="logo" 
        rightElement={hasPermission('records') ? "icon" : "none"}
        rightIconName="person-add-outline" 
        onRightPress={() => router.push('/add-patient')} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Context */}
        <Text style={styles.sectionContextTitle}>PRACTITIONER DASHBOARD</Text>
        
        <View style={styles.doctorSelector}>
          <View style={styles.doctorSelectorLeft}>
            <Ionicons name="medkit" size={18} color="#2563EB" />
            <Text style={styles.doctorName}>Dr. Sarah Jenkins</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#475569" />
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE: Morning Session</Text>
        </View>

        {/* Currently Serving Card */}
        <View style={styles.servingCard}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.servingHeader}>
            <Ionicons name="search-outline" size={14} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.servingTitle}>CURRENTLY SERVING</Text>
          </View>
          
          <Text style={styles.servingToken}>GP-402</Text>
          <Text style={styles.servingPatient}>Patient: Jonathan Henderson</Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.callNextButton}>
              <Ionicons name="play-skip-forward" size={16} color="#FFFFFF" />
              <Text style={styles.callNextText}>Call Next</Text>
            </Pressable>
            <Pressable style={styles.pauseButton}>
              <Ionicons name="pause" size={18} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Today's Patients */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Today's Patients</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>42</Text>
              <Ionicons name="trending-up" size={16} color="#16A34A" style={{ marginLeft: 4 }} />
            </View>
          </View>
          
          {/* Waiting Patients */}
          <View style={[styles.statBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <Text style={[styles.statLabel, { color: '#1D4ED8' }]}>Waiting Patients</Text>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>08</Text>
          </View>

          {/* Completed */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>32</Text>
          </View>

          {/* Missed/Skipped */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Missed/Skipped</Text>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>02</Text>
          </View>
        </View>

        {/* Next in Queue */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleBlack}>Next in Queue</Text>
          <Text style={styles.viewAllText}>View All</Text>
        </View>

        {/* Queue Item 1 */}
        <Pressable style={styles.queueItem} onPress={() => router.push('/token-details')}>
          <View style={[styles.tokenPill, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.tokenPillText, { color: '#2563EB' }]}>GP-{'\n'}403</Text>
          </View>
          <View style={styles.queueInfo}>
            <Text style={styles.queueName}>Clara Oswald</Text>
            <Text style={styles.queueDetails}>General Checkup • 4 mins wait</Text>
          </View>
        </Pressable>

        {/* Queue Item 2 */}
        <Pressable style={styles.queueItem} onPress={() => router.push('/token-details')}>
          <View style={styles.tokenPill}>
            <Text style={styles.tokenPillText}>GP-{'\n'}404</Text>
          </View>
          <View style={styles.queueInfo}>
            <Text style={styles.queueName}>Arthur Williams</Text>
            <Text style={styles.queueDetails}>Follow-up • 12 mins wait</Text>
          </View>
        </Pressable>

        {/* Queue Item 3 */}
        <Pressable style={styles.queueItem} onPress={() => router.push('/token-details')}>
          <View style={styles.tokenPill}>
            <Text style={styles.tokenPillText}>GP-{'\n'}405</Text>
          </View>
          <View style={styles.queueInfo}>
            <Text style={styles.queueName}>Martha Jones</Text>
            <Text style={styles.queueDetails}>Vaccination • 18 mins wait</Text>
          </View>
        </Pressable>

        {/* Operations */}
        <Text style={styles.operationsTitle}>OPERATIONS</Text>
        
        <View style={styles.operationsContainer}>
          {/* Issue Manual Token */}
          {/* <View style={styles.operationItem}>
            <View style={[styles.opIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="add-circle" size={22} color="#2563EB" />
            </View>
            <View style={styles.opTextContent}>
              <Text style={styles.opTitle}>Issue Manual Token</Text>
              <Text style={styles.opSubtitle}>For walk-in patients</Text>
            </View>
          </View> */}

          {/* Priority Override */}
          {hasPermission('queue') && (
            <Pressable style={styles.operationItem} onPress={() => router.push('/priority-override')}>
              <View style={[styles.opIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="alert-circle" size={22} color="#DC2626" />
              </View>
              <View style={styles.opTextContent}>
                <Text style={styles.opTitle}>Priority Override</Text>
                <Text style={styles.opSubtitle}>Emergency insertion</Text>
              </View>
            </Pressable>
          )}

          {/* Session Logs */}
          {hasPermission('records') && (
            <Pressable style={styles.operationItem} onPress={() => router.push('/session-logs')}>
              <View style={[styles.opIconBox, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="time-outline" size={22} color="#475569" />
              </View>
              <View style={styles.opTextContent}>
                <Text style={styles.opTitle}>Session Logs</Text>
                <Text style={styles.opSubtitle}>Review today's activity</Text>
              </View>
            </Pressable>
          )}
        </View>

      </ScrollView>

      {/* Common Bottom Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Context & Doctor Selector
  sectionContextTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  doctorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  doctorSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },

  // Serving Card
  servingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  cardBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#2563EB',
  },
  servingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  servingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  servingToken: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 8,
  },
  servingPatient: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 8,
  },
  callNextButton: {
    flex: 1,
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  callNextText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
  pauseButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  // Next in Queue
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleBlack: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tokenPill: {
    backgroundColor: '#F1F5F9',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tokenPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
  },
  queueInfo: {
    flex: 1,
  },
  queueName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  queueDetails: {
    fontSize: 12,
    color: '#64748B',
  },

  // Operations
  operationsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111827',
    marginTop: 24,
    marginBottom: 16,
  },
  operationsContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
  },
  operationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  opIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  opTextContent: {
    flex: 1,
  },
  opTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  opSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
});
