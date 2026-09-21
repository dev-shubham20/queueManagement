import React, { useEffect, useState, useCallback } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';
import { MockDB, UserData } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';
import { SocketClient } from '@/utils/socket';

export default function QueueScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [session, setSession] = useState<UserData | null>(null);

  const loadQueue = useCallback(async () => {
    try {
      const sess = await MockDB.getCurrentSession();
      setSession(sess);
      const doctorId = sess?.doctorId || sess?.id || 'doc-1';

      const res = await RemoteAPI.getDoctorActiveQueue(doctorId);
      if (res && res.queue) {
        setActiveQueue(res.queue);
        if (Array.isArray(res.tokens)) {
          const mapped = res.tokens.map((t: any) => ({
            id: t._id || t.id,
            tokenNumber: t.tokenNumber,
            name: t.patientName,
            phone: t.patientPhone,
            condition: t.condition,
            priority: t.priority,
            status: t.status,
            treatmentStatus: t.status === 'SERVING' ? 'IN_CONSULTATION' : t.status,
            createdAt: t.createdAt,
          }));
          setPatients(mapped);
          return;
        }
      }

      // Fallback to local
      const data = await MockDB.getPatients();
      setPatients(data || []);
    } catch (e) {
      console.warn('loadQueue warning:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, [loadQueue]);

  const queueId = activeQueue?.id || activeQueue?._id || (session ? `queue-${session.id || session.doctorId}` : 'queue-doc-1');

  // Real-time Socket.IO subscriptions
  useEffect(() => {
    if (!queueId) return;

    SocketClient.joinQueue(queueId);

    const unsubCreated = SocketClient.onTokenCreated(() => loadQueue());
    const unsubCalled = SocketClient.onTokenCalled(() => loadQueue());
    const unsubServing = SocketClient.onTokenServing(() => loadQueue());
    const unsubCompleted = SocketClient.onTokenCompleted(() => loadQueue());
    const unsubSkipped = SocketClient.onTokenSkipped(() => loadQueue());
    const unsubCancelled = SocketClient.onTokenCancelled(() => loadQueue());
    const unsubStatus = SocketClient.onQueueStatusChanged(() => loadQueue());
    const unsubEmergency = SocketClient.onEmergencyAlert((data) => {
      Alert.alert('EMERGENCY ALERT', `Emergency Patient Added: ${data.patientName} (${data.tokenNumber})`);
      loadQueue();
    });

    return () => {
      unsubCreated();
      unsubCalled();
      unsubServing();
      unsubCompleted();
      unsubSkipped();
      unsubCancelled();
      unsubStatus();
      unsubEmergency();
      SocketClient.leaveQueue(queueId);
    };
  }, [queueId, loadQueue]);

  const currentlyServing = patients.find(p => p.status === 'SERVING' || p.treatmentStatus === 'IN_CONSULTATION') ||
    patients.find(p => p.status === 'CALLED');

  const waitingPatients = patients.filter(
    p => (p.status === 'WAITING' || p.treatmentStatus === 'WAITING') && p.id !== currentlyServing?.id
  );

  const isPaused = activeQueue?.status === 'PAUSED' || activeQueue?.isPaused === true;

  const hasPermission = (perm: string) => {
    if (!session) return false;
    const role = (session.role || '').toUpperCase();
    if (role === 'DOCTOR' || role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'CLINIC') return true;
    const perms = session.permissions || [];
    if (perms.includes(perm)) return true;
    if (perm === 'token:create' && perms.includes('token_issue')) return true;
    if (perm === 'token:create_emergency' && perms.includes('token_issue')) return true;
    if (perm === 'token:cancel' && perms.includes('token_cancel')) return true;
    if (perm === 'queue:pause' && perms.includes('queue_manage')) return true;
    if (perm === 'queue:resume' && perms.includes('queue_manage')) return true;
    if (perm === 'queue:view' && perms.includes('queue_manage')) return true;
    return false;
  };

  const handleCallNext = async () => {
    try {
      setActionLoading(true);
      await RemoteAPI.callNextToken(queueId);
      await loadQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not call next patient');
    } finally {
      setActionLoading(false);
    }
  };

  const handleServe = async () => {
    if (!currentlyServing) return;
    try {
      setActionLoading(true);
      await RemoteAPI.serveToken(queueId, currentlyServing.id);
      await loadQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not start consultation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!currentlyServing) return;
    try {
      setActionLoading(true);
      await RemoteAPI.completeToken(queueId, currentlyServing.id);
      await loadQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not complete consultation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSkip = async () => {
    if (!currentlyServing) return;
    try {
      setActionLoading(true);
      await RemoteAPI.skipToken(queueId, currentlyServing.id, 'Patient skipped by practitioner');
      await loadQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not skip patient');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelToken = async (tokenId: string, patientName: string) => {
    Alert.alert(
      'Cancel Token?',
      `Are you sure you want to cancel the token for ${patientName}?`,
      [
        { text: 'Keep Token', style: 'cancel' },
        {
          text: 'Cancel Token',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await RemoteAPI.cancelToken(queueId, tokenId, 'Cancelled by staff');
              await loadQueue();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Could not cancel token');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleTogglePause = async () => {
    try {
      setActionLoading(true);
      if (isPaused) {
        await RemoteAPI.resumeQueue(queueId);
      } else {
        await RemoteAPI.pauseQueue(queueId, 'Practitioner consultation break');
      }
      await loadQueue();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not toggle queue status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Pause Banner if Paused */}
        {isPaused && (
          <View style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="pause-circle" size={22} color="#DC2626" style={{ marginRight: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#991B1B' }}>Queue is currently paused</Text>
              <Text style={{ fontSize: 12, color: '#B91C1C', marginTop: 2 }}>{activeQueue?.pauseReason || 'Practitioner is temporarily unavailable'}</Text>
            </View>
          </View>
        )}

        <Text style={styles.sectionHeader}>CURRENTLY SERVING</Text>

        {/* Serving Card */}
        <View style={styles.servingCardContainer}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.servingCard}>
            
            <View style={styles.servingHeaderRow}>
              <View style={styles.tokenPill}>
                <Text style={styles.tokenText}>{currentlyServing?.tokenNumber || '--'}</Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>Status</Text>
                <Text style={styles.timeValue}>
                  {currentlyServing 
                    ? (currentlyServing.status === 'SERVING' || currentlyServing.treatmentStatus === 'IN_CONSULTATION' 
                        ? 'In Consultation' 
                        : 'Called (Waiting in room)') 
                    : 'Idle'}
                </Text>
              </View>
            </View>

            <Text style={styles.patientName}>{currentlyServing ? currentlyServing.name : 'No Patient in Consultation'}</Text>
            {currentlyServing?.condition ? (
              <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>{currentlyServing.condition}</Text>
            ) : null}

            {currentlyServing?.status === 'CALLED' && (
              <Pressable 
                style={[styles.completeButton, { backgroundColor: '#2563EB', marginBottom: 8 }]} 
                onPress={handleServe}
                disabled={actionLoading}
              >
                <Ionicons name="medical" size={20} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>Start Consultation (Serve)</Text>
              </Pressable>
            )}

            <Pressable 
              style={styles.completeButton} 
              onPress={handleComplete}
              disabled={actionLoading || !currentlyServing}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>Complete Consultation</Text>
            </Pressable>

            <Pressable 
              style={styles.skipButton} 
              onPress={handleSkip}
              disabled={actionLoading || !currentlyServing}
            >
              <Ionicons name="play-skip-forward" size={18} color="#475569" />
              <Text style={styles.skipButtonText}>Skip to Next</Text>
            </Pressable>

          </View>
        </View>

        {/* Next in Line */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeader}>NEXT IN LINE</Text>
          <Text style={styles.linkText}>{waitingPatients.length} Waiting</Text>
        </View>

        {waitingPatients.length === 0 ? (
          <View style={{ padding: 24, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' }}>
            <Ionicons name="checkmark-done-circle" size={36} color="#16A34A" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1E293B' }}>Queue is Clear</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>No pending patients waiting at this time</Text>
          </View>
        ) : (
          waitingPatients.map((pat, idx) => (
            <View key={pat.id} style={styles.waitingItem}>
              <Pressable style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }} onPress={() => router.push('/token-details')}>
                <View style={[styles.waitingPill, pat.priority === 0 && { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.waitingPillText, pat.priority === 0 && { color: '#DC2626' }]}>
                    {pat.tokenNumber || `TK-${idx + 1}`}
                  </Text>
                </View>
                <View style={styles.waitingInfo}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.waitingName}>{pat.name}</Text>
                    {pat.priority === 0 && (
                      <View style={{ backgroundColor: '#DC2626', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 }}>
                        <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>EMERGENCY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.waitingReason}>{pat.condition || 'General Consultation'}</Text>
                </View>
                <View style={styles.waitingTimeBlock}>
                  <Text style={styles.waitingTimeLabel}>Est. Wait</Text>
                  <Text style={styles.waitingTimeValue}>{`${(idx + 1) * 10} mins`}</Text>
                </View>
              </Pressable>

              {hasPermission('token:cancel') && (
                <Pressable
                  style={{ padding: 8, marginLeft: 6 }}
                  onPress={() => handleCancelToken(pat.id, pat.name)}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
                </Pressable>
              )}
            </View>
          ))
        )}

        {/* Action Center */}
        <View style={[styles.sectionTitleRow, { marginTop: 8 }]}>
          <Text style={styles.sectionHeader}>ACTION CENTER</Text>
          <Pressable style={styles.actionSettingsLink}>
            <Ionicons name="settings-outline" size={14} color="#2563EB" style={{ marginRight: 4 }} />
            <Text style={styles.linkText}>Queue Settings</Text>
          </Pressable>
        </View>

        <View style={styles.actionGrid}>
          
          <View style={styles.actionRow}>
            <Pressable style={[styles.actionBox, styles.actionBoxBlue]} onPress={handleCallNext} disabled={actionLoading}>
              <Ionicons name="person-add" size={32} color="#FFFFFF" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxBlueText}>Call Next</Text>
            </Pressable>
            
            {hasPermission('token:create_emergency') ? (
              <Pressable style={[styles.actionBox, styles.actionBoxRed]} onPress={() => router.push('/priority-override')}>
                <Ionicons name="medical" size={32} color="#DC2626" style={{ marginBottom: 12 }} />
                <Text style={styles.actionBoxRedText}>Emergency{'\n'}Insert</Text>
              </Pressable>
            ) : (
              <View style={[styles.actionBox, styles.actionBoxOutline, { opacity: 0.5 }]}>
                <Ionicons name="lock-closed-outline" size={28} color="#94A3B8" style={{ marginBottom: 8 }} />
                <Text style={[styles.actionBoxOutlineText, { color: '#94A3B8', textAlign: 'center' }]}>Emergency{'\n'}(No Permission)</Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            {(hasPermission('queue:pause') || hasPermission('queue:resume')) ? (
              <Pressable style={styles.actionBoxOutline} onPress={handleTogglePause} disabled={actionLoading}>
                <Ionicons 
                  name={isPaused ? "play-circle-outline" : "pause-circle-outline"} 
                  size={32} 
                  color={isPaused ? "#16A34A" : "#475569"} 
                  style={{ marginBottom: 12 }} 
                />
                <Text style={[styles.actionBoxOutlineText, isPaused && { color: '#16A34A' }]}>
                  {isPaused ? 'Resume Queue' : 'Pause Queue'}
                </Text>
              </Pressable>
            ) : (
              <View style={[styles.actionBoxOutline, { opacity: 0.5 }]}>
                <Ionicons name="lock-closed-outline" size={28} color="#94A3B8" style={{ marginBottom: 8 }} />
                <Text style={[styles.actionBoxOutlineText, { color: '#94A3B8' }]}>Queue Control (Locked)</Text>
              </View>
            )}

            <Pressable style={styles.actionBoxOutline} onPress={() => loadQueue()}>
              <Ionicons name="reload-circle-outline" size={32} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxOutlineText}>Refresh Queue</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            {hasPermission('token:create') && (
              <Pressable style={[styles.actionBoxOutline, { flex: 0.48 }]} onPress={() => router.push('/add-patient')}>
                <Ionicons name="person-add-outline" size={32} color="#475569" style={{ marginBottom: 12 }} />
                <Text style={styles.actionBoxOutlineText}>Add Walk-in</Text>
              </Pressable>
            )}
            <View style={{ flex: 0.48 }} />
          </View>

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
  menuButton: {
    padding: 4,
    marginLeft: -4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A8A', // Deep blue for time
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatarImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
  },
  
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  actionSettingsLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Serving Card
  servingCardContainer: {
    position: 'relative',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#0052CC',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    zIndex: 1,
  },
  servingCard: {
    padding: 24,
    paddingLeft: 28,
  },
  servingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tokenPill: {
    backgroundColor: '#0052CC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tokenText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0052CC',
    marginTop: 2,
  },
  patientName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 38,
    marginBottom: 24,
  },
  completeButton: {
    backgroundColor: '#065F46', // Dark green
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 8,
    marginBottom: 12,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  skipButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  skipButtonText: {
    color: '#475569',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Next in Line
  waitingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  waitingPill: {
    backgroundColor: '#DBEAFE',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  waitingPillText: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 16,
  },
  waitingInfo: {
    flex: 1,
  },
  waitingName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  waitingReason: {
    fontSize: 12,
    color: '#64748B',
  },
  waitingTimeBlock: {
    alignItems: 'flex-end',
  },
  waitingTimeLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  waitingTimeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },

  // Action Center
  actionGrid: {
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionBox: {
    flex: 0.48,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionBoxBlue: {
    backgroundColor: '#0052CC',
  },
  actionBoxBlueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionBoxRed: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626',
  },
  actionBoxRedText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionBoxOutline: {
    flex: 0.48,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  actionBoxOutlineText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
});
