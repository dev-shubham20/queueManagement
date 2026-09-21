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
import ReceptionistCommandCenter from '../../components/ReceptionistCommandCenter';
import { MockDB, UserData } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';
import { SocketClient } from '@/utils/socket';

export default function DashboardScreen() {
  const router = useRouter();
  const [session, setSession] = useState<UserData | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const sess = await MockDB.getCurrentSession();
      setSession(sess);
      const doctorId = sess?.doctorId || sess?.id || 'doc-1';

      const res = await RemoteAPI.getDoctorActiveQueue(doctorId);
      if (res && res.queue) {
        setActiveQueue(res.queue);
        if (Array.isArray(res.tokens)) {
          setPatients(res.tokens.map((t: any) => ({
            id: t._id || t.id,
            tokenNumber: t.tokenNumber,
            name: t.patientName,
            phone: t.patientPhone,
            condition: t.condition,
            priority: t.priority,
            status: t.status,
            treatmentStatus: t.status === 'SERVING' ? 'IN_CONSULTATION' : t.status,
            createdAt: t.createdAt,
          })));
          return;
        }
      }

      const pats = await MockDB.getPatients();
      setPatients(pats || []);
    } catch (e) {
      console.warn('Dashboard loadData error:', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const queueId = activeQueue?.id || activeQueue?._id || (session ? `queue-${session.id || session.doctorId}` : 'queue-doc-1');

  useEffect(() => {
    if (!queueId) return;

    SocketClient.joinQueue(queueId);

    const unsubCreated = SocketClient.onTokenCreated(() => loadData());
    const unsubCalled = SocketClient.onTokenCalled(() => loadData());
    const unsubServing = SocketClient.onTokenServing(() => loadData());
    const unsubCompleted = SocketClient.onTokenCompleted(() => loadData());
    const unsubSkipped = SocketClient.onTokenSkipped(() => loadData());
    const unsubCancelled = SocketClient.onTokenCancelled(() => loadData());
    const unsubStatus = SocketClient.onQueueStatusChanged(() => loadData());

    return () => {
      unsubCreated();
      unsubCalled();
      unsubServing();
      unsubCompleted();
      unsubSkipped();
      unsubCancelled();
      unsubStatus();
      SocketClient.leaveQueue(queueId);
    };
  }, [queueId]);

  const currentlyServing = patients.find(p => p.status === 'SERVING' || p.treatmentStatus === 'IN_CONSULTATION') ||
    patients.find(p => p.status === 'CALLED');

  const waitingPatients = patients.filter(
    p => (p.status === 'WAITING' || p.treatmentStatus === 'WAITING') && p.id !== currentlyServing?.id
  );

  const completedCount = activeQueue?.totalTokensCompleted ?? patients.filter(p => p.status === 'COMPLETED' || p.treatmentStatus === 'COMPLETED').length;
  const waitingCount = waitingPatients.length;
  const totalCount = activeQueue?.totalTokensIssued ?? (completedCount + waitingCount + (currentlyServing ? 1 : 0));

  const handleCallNext = async () => {
    try {
      await RemoteAPI.callNextToken(queueId);
      await loadData();
    } catch (e) {
      console.warn('Dashboard handleCallNext error:', e);
    }
  };

  const hasPermission = (perm: string) => {
    if (!session) return false;
    if (session.role === 'DOCTOR' || session.role === 'SUPER_ADMIN') return true;
    return session.permissions?.includes(perm) ?? false;
  };

  const isReceptionistRole = session?.role === 'RECEPTIONIST' || session?.role === 'STAFF';
  const [viewMode, setViewMode] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');

  // If user is receptionist or staff, default to receptionist view mode
  useEffect(() => {
    if (isReceptionistRole) {
      setViewMode('RECEPTIONIST');
    }
  }, [isReceptionistRole]);

  if (session && (isReceptionistRole || viewMode === 'RECEPTIONIST')) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {session.role === 'DOCTOR' && (
          <View style={styles.modeSwitchBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="desktop-outline" size={16} color="#1E40AF" style={{ marginRight: 6 }} />
              <Text style={styles.modeSwitchBannerText}>Front-Desk Reception Mode Active</Text>
            </View>
            <Pressable
              style={styles.modeSwitchBackBtn}
              onPress={() => setViewMode('DOCTOR')}
            >
              <Ionicons name="arrow-back" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.modeSwitchBackBtnText}>Doctor View</Text>
            </Pressable>
          </View>
        )}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <ReceptionistCommandCenter
            session={session}
            onLogout={async () => {
              await MockDB.clearSession();
              router.replace('/(auth)/doctor-login');
            }}
          />
        </ScrollView>
        <BottomTabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader 
        leftIcon="logo" 
        rightElement={hasPermission('records') ? "icon" : "none"}
        rightIconName="person-add-outline" 
        onRightPress={() => router.push('/add-patient')} 
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Context & Switch to Reception */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={styles.sectionContextTitle}>PRACTITIONER DASHBOARD</Text>
          <Pressable
            style={styles.receptionSwitchBtn}
            onPress={() => setViewMode('RECEPTIONIST')}
          >
            <Ionicons name="receipt-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.receptionSwitchBtnText}>Front-Desk Console</Text>
          </Pressable>
        </View>
        
        <View style={styles.doctorSelector}>
          <View style={styles.doctorSelectorLeft}>
            <Ionicons name="medkit" size={18} color="#2563EB" />
            <Text style={styles.doctorName}>{session?.name || 'Practitioner'}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#475569" />
        </View>

        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE: Active Queue Session</Text>
        </View>

        {/* Currently Serving Card */}
        <View style={styles.servingCard}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.servingHeader}>
            <Ionicons name="search-outline" size={14} color="#475569" style={{ marginRight: 6 }} />
            <Text style={styles.servingTitle}>CURRENTLY SERVING</Text>
          </View>
          
          <Text style={styles.servingToken}>{currentlyServing?.tokenNumber || '--'}</Text>
          <Text style={styles.servingPatient}>Patient: {currentlyServing?.name || 'No active patient in room'}</Text>

          <View style={styles.actionRow}>
            <Pressable style={styles.callNextButton} onPress={handleCallNext}>
              <Ionicons name="play-skip-forward" size={16} color="#FFFFFF" />
              <Text style={styles.callNextText}>Call Next</Text>
            </Pressable>
            <Pressable style={styles.pauseButton} onPress={() => router.push('/queue')}>
              <Ionicons name="list" size={18} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Today's Patients */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Patients</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Ionicons name="trending-up" size={16} color="#16A34A" style={{ marginLeft: 4 }} />
            </View>
          </View>
          
          {/* Waiting Patients */}
          <View style={[styles.statBox, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
            <Text style={[styles.statLabel, { color: '#1D4ED8' }]}>Waiting Queue</Text>
            <Text style={[styles.statValue, { color: '#2563EB' }]}>{String(waitingCount).padStart(2, '0')}</Text>
          </View>

          {/* Completed */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedCount}</Text>
          </View>

          {/* Active Serving */}
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>In Treatment</Text>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {currentlyServing && currentlyServing.treatmentStatus === 'IN_CONSULTATION' ? '01' : '00'}
            </Text>
          </View>
        </View>

        {/* Next in Queue */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleBlack}>Next in Queue</Text>
          <Pressable onPress={() => router.push('/queue')}>
            <Text style={styles.viewAllText}>View All ({waitingPatients.length})</Text>
          </Pressable>
        </View>

        {waitingPatients.length === 0 ? (
          <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
            <Text style={{ color: '#64748B', fontSize: 13 }}>No waiting patients in queue</Text>
          </View>
        ) : (
          waitingPatients.slice(0, 3).map((pat, idx) => (
            <Pressable key={pat.id} style={styles.queueItem} onPress={() => router.push('/token-details')}>
              <View style={[styles.tokenPill, idx === 0 && { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.tokenPillText, idx === 0 && { color: '#2563EB' }]}>{pat.tokenNumber || `TK-${idx + 1}`}</Text>
              </View>
              <View style={styles.queueInfo}>
                <Text style={styles.queueName}>{pat.name}</Text>
                <Text style={styles.queueDetails}>{pat.condition || 'General'} • {(idx + 1) * 8} mins wait</Text>
              </View>
            </Pressable>
          ))
        )}

        {/* Operations */}
        <Text style={styles.operationsTitle}>OPERATIONS</Text>
        
        <View style={styles.operationsContainer}>
          {/* Switch to Front-Desk Reception Console */}
          <Pressable style={styles.operationItem} onPress={() => setViewMode('RECEPTIONIST')}>
            <View style={[styles.opIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="receipt" size={22} color="#2563EB" />
            </View>
            <View style={styles.opTextContent}>
              <Text style={styles.opTitle}>Reception Desk Flow</Text>
              <Text style={styles.opSubtitle}>Search patients, issue tokens & manage queue</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          {/* Issue Walk-in Patient */}
          <Pressable style={styles.operationItem} onPress={() => router.push('/add-patient')}>
            <View style={[styles.opIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="person-add" size={22} color="#059669" />
            </View>
            <View style={styles.opTextContent}>
              <Text style={styles.opTitle}>Add Walk-in Patient</Text>
              <Text style={styles.opSubtitle}>Issue regular token for walk-in</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>

          {/* Priority Override */}
          {hasPermission('queue') && (
            <Pressable style={styles.operationItem} onPress={() => router.push('/priority-override')}>
              <View style={[styles.opIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="alert-circle" size={22} color="#DC2626" />
              </View>
              <View style={styles.opTextContent}>
                <Text style={styles.opTitle}>Priority Override</Text>
                <Text style={styles.opSubtitle}>Emergency insertion (EM-XX)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
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
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
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
  modeSwitchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  modeSwitchBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  modeSwitchBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modeSwitchBackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  receptionSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  receptionSwitchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
});
