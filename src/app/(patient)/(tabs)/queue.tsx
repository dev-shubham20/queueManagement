import React, { useState } from 'react';
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

import { ActiveTokenData, DoctorRecord, MockDB } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';
import { SocketClient } from '@/utils/socket';
import { useFocusEffect } from 'expo-router';

export default function QueueScreen() {
  const router = useRouter();
  const [activeToken, setActiveToken] = useState<ActiveTokenData | null>(null);
  const [doctor, setDoctor] = useState<DoctorRecord | null>(null);
  const [liveCurrentToken, setLiveCurrentToken] = useState<string>('None');
  const [queueStatus, setQueueStatus] = useState<'ACTIVE' | 'PAUSED' | 'COMPLETED'>('ACTIVE');
  const [pauseReason, setPauseReason] = useState<string>('');
  const [tokenStatus, setTokenStatus] = useState<string>('WAITING');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  const [recentEvents, setRecentEvents] = useState<Array<{ id: string; title: string; subtitle: string; active?: boolean }>>([]);

  const connectSocket = (tok: ActiveTokenData) => {
    try {
      SocketClient.connect();
      const qId = tok.queueId || `queue-${tok.doctorId}`;
      SocketClient.joinQueue(qId);
      if (tok.patientPhone) {
        SocketClient.joinPatient(tok.patientPhone);
      }

      // Listen for token called
      SocketClient.on('queue:token_called', (data: any) => {
        setLiveCurrentToken(data.currentTokenNumber || 'None');
        if (data.tokenId === tok.id || data.currentTokenNumber === tok.token) {
          setTokenStatus('CALLED');
          setRefreshMessage('🔔 YOUR TOKEN HAS BEEN CALLED! Please proceed to doctor consultation room.');
        } else {
          setActiveToken((prev) => (prev ? { ...prev, positionAhead: Math.max(0, prev.positionAhead - 1) } : null));
        }
        setRecentEvents((prev) => [
          { id: `call-${Date.now()}`, title: `Token ${data.currentTokenNumber} called`, subtitle: `Consultation Room • Just now`, active: true },
          ...prev.slice(0, 4)
        ]);
      });

      // Listen for token serving
      SocketClient.on('queue:token_serving', (data: any) => {
        if (data.tokenId === tok.id || data.tokenNumber === tok.token) {
          setTokenStatus('SERVING');
        }
      });

      // Listen for token completed
      SocketClient.on('queue:token_completed', (data: any) => {
        if (data.tokenId === tok.id || data.tokenNumber === tok.token) {
          setTokenStatus('COMPLETED');
          setRefreshMessage('✅ Consultation completed. Thank you!');
          setTimeout(() => {
            MockDB.clearActiveToken();
            setActiveToken(null);
          }, 2500);
        }
        setRecentEvents((prev) => [
          { id: `comp-${Date.now()}`, title: `Token ${data.tokenNumber} completed`, subtitle: `Consultation finished`, active: false },
          ...prev.slice(0, 4)
        ]);
      });

      // Listen for token skipped
      SocketClient.on('queue:token_skipped', (data: any) => {
        if (data.tokenId === tok.id || data.tokenNumber === tok.token) {
          setTokenStatus('SKIPPED');
          setRefreshMessage('⚠️ Your token was skipped by the doctor.');
        }
      });

      // Listen for queue pause/resume
      SocketClient.on('queue:status_changed', (data: any) => {
        if (data.status) setQueueStatus(data.status);
        if (data.status === 'PAUSED') {
          setPauseReason(data.reason || 'Doctor in surgery / Queue paused');
        } else {
          setPauseReason('');
        }
      });

      // Listen for emergency alerts
      SocketClient.on('queue:emergency_alert', (data: any) => {
        setRecentEvents((prev) => [
          { id: `em-${Date.now()}`, title: `🚨 Emergency Token ${data.tokenNumber} issued`, subtitle: 'Priority triage at head of queue', active: true },
          ...prev.slice(0, 4)
        ]);
      });
    } catch (err) {
      console.warn('Socket connection error in queue screen:', err);
    }
  };

  const loadQueueData = async () => {
    try {
      const sessionUser = await MockDB.getCurrentSession();
      const userPhone = sessionUser?.phone || '';

      const localToken = await MockDB.getActiveToken();
      let currentTokenData = localToken;

      if (userPhone) {
        const serverTokenRes = await RemoteAPI.getMyToken(userPhone);
        if (serverTokenRes && serverTokenRes.activeToken) {
          const sTok = serverTokenRes.activeToken;
          currentTokenData = {
            id: sTok.id || sTok._id,
            token: sTok.tokenNumber,
            queueId: sTok.queueId,
            doctorId: sTok.doctorId,
            doctorName: localToken?.doctorName || 'Dr. Practitioner',
            clinicName: localToken?.clinicName || 'Care Clinic',
            specialty: localToken?.specialty,
            image: localToken?.image,
            fee: localToken?.fee,
            appointmentDate: localToken?.appointmentDate || 'Today',
            session: localToken?.session || 'Morning',
            patientName: sTok.patientName,
            patientPhone: sTok.patientPhone,
            condition: sTok.condition,
            positionAhead: sTok.positionAhead !== undefined ? sTok.positionAhead : 0,
            expectedTime: localToken?.expectedTime || `${sTok.estimatedWaitMinutes || 10} mins`,
            createdAt: sTok.createdAt,
            status: sTok.status,
          };
          await MockDB.setActiveToken(currentTokenData);
          setLiveCurrentToken(sTok.currentTokenNumber || 'None');
          setQueueStatus(sTok.queueStatus || 'ACTIVE');
          setTokenStatus(sTok.status);
        } else if (serverTokenRes && serverTokenRes.activeToken === null && localToken) {
          await MockDB.clearActiveToken();
          currentTokenData = null;
        }
      }

      setActiveToken(currentTokenData);
      if (currentTokenData) {
        setTokenStatus(currentTokenData.status);
        connectSocket(currentTokenData);
      }

      if (currentTokenData?.doctorId) {
        const doctors = await MockDB.getDoctors();
        const found = doctors.find((d) => d.id === currentTokenData.doctorId);
        if (found) setDoctor(found);
      }
    } catch (e) {
      console.error('Error fetching queue details', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadQueueData();
      return () => {
        SocketClient.off('queue:token_called');
        SocketClient.off('queue:token_serving');
        SocketClient.off('queue:token_completed');
        SocketClient.off('queue:token_skipped');
        SocketClient.off('queue:status_changed');
        SocketClient.off('queue:emergency_alert');
      };
    }, [])
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage('Syncing live queue from clinic server...');
    await loadQueueData();
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage('Live queue updated!');
      setTimeout(() => setRefreshMessage(null), 2500);
    }, 500);
  };

  const handleCancelQueue = async () => {
    if (isCancelling) return;
    setIsCancelling(true);
    try {
      if (activeToken?.id) {
        await MockDB.cancelActiveToken(activeToken.id);
      } else {
        await MockDB.clearActiveToken();
      }
      setActiveToken(null);
      setDoctor(null);
      setRefreshMessage('You have exited the queue.');
      setTimeout(() => setRefreshMessage(null), 3000);
    } catch (e) {
      console.error('Error exiting queue', e);
    } finally {
      setIsCancelling(false);
    }
  };

  const currentAhead = activeToken?.positionAhead !== undefined ? activeToken.positionAhead : 0;
  const waitMinutes = currentAhead * 10;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Queue</Text>
        {refreshMessage && (
          <Text style={{ fontSize: 12, color: '#0052FF', fontFamily: 'Inter_600SemiBold', marginTop: 4 }}>
            {refreshMessage}
          </Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {activeToken ? (
          <>
            {/* Pause Banner if Queue is Paused */}
            {queueStatus === 'PAUSED' && (
              <View style={{ backgroundColor: '#FEF2F2', borderColor: '#F87171', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 13, color: '#B91C1C', fontWeight: '700', flex: 1 }}>
                  ⏸️ Queue is Paused: {pauseReason || 'Doctor attending emergency case'}
                </Text>
              </View>
            )}

            {/* Ticket Card */}
            <View style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View style={[
                  styles.servingBadge,
                  tokenStatus === 'CALLED' ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', borderWidth: 1 } :
                  tokenStatus === 'SERVING' ? { backgroundColor: '#DCFCE7', borderColor: '#22C55E', borderWidth: 1 } :
                  tokenStatus === 'SKIPPED' ? { backgroundColor: '#FEE2E2', borderColor: '#EF4444', borderWidth: 1 } : null
                ]}>
                  <View style={[
                    styles.pulseDot,
                    tokenStatus === 'CALLED' ? { backgroundColor: '#F59E0B' } :
                    tokenStatus === 'SERVING' ? { backgroundColor: '#16A34A' } :
                    tokenStatus === 'SKIPPED' ? { backgroundColor: '#DC2626' } : null
                  ]} />
                  <Text style={[
                    styles.servingBadgeText,
                    tokenStatus === 'CALLED' ? { color: '#B45309', fontWeight: '700' } :
                    tokenStatus === 'SERVING' ? { color: '#15803D', fontWeight: '700' } :
                    tokenStatus === 'SKIPPED' ? { color: '#B91C1C', fontWeight: '700' } : null
                  ]}>
                    {tokenStatus === 'CALLED' ? 'CALLED - ENTER ROOM NOW' :
                     tokenStatus === 'SERVING' ? 'IN CONSULTATION' :
                     tokenStatus === 'SKIPPED' ? 'TOKEN SKIPPED' : 'In Waiting Line'}
                  </Text>
                </View>
                <View style={styles.myTokenBadge}>
                  <Text style={styles.myTokenLabel}>MY TOKEN</Text>
                  <Text style={styles.myTokenValue}>{activeToken.token}</Text>
                </View>
              </View>

              <View style={styles.ticketBody}>
                <Text style={styles.servingTokenLabel}>Currently in Consultation Room</Text>
                <Text style={styles.servingTokenValue}>
                  {liveCurrentToken && liveCurrentToken !== 'None' ? `Token #${liveCurrentToken}` : 'Doctor Ready / Calling Next'}
                </Text>
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
                  <Text style={styles.progressPercent}>
                    {tokenStatus === 'SERVING' ? '100%' : tokenStatus === 'CALLED' ? '95%' : `${Math.min(90, Math.max(10, 100 - (currentAhead * 15)))}%`}
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: tokenStatus === 'SERVING' ? '100%' : tokenStatus === 'CALLED' ? '95%' : `${Math.min(90, Math.max(10, 100 - (currentAhead * 15)))}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: '#EEF2FF' }]}>
                  <UsersIcon color="#4F46E5" />
                </View>
                <Text style={styles.statValue}>{currentAhead}</Text>
                <Text style={styles.statLabel}>Ahead of you</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: '#FFF7ED' }]}>
                  <ClockIcon color="#EA580C" />
                </View>
                <Text style={styles.statValue}>{currentAhead === 0 ? 'Now' : `~${waitMinutes}m`}</Text>
                <Text style={styles.statLabel}>Est. wait time</Text>
              </View>

              <View style={styles.statCard}>
                <View style={[styles.statIconBox, { backgroundColor: '#F0FDF4' }]}>
                  <CalendarIcon color="#16A34A" />
                </View>
                <Text style={styles.statValue}>{tokenStatus === 'CALLED' ? 'NOW' : activeToken.expectedTime || '10:30'}</Text>
                <Text style={styles.statLabel}>Expected time</Text>
              </View>
            </View>

            {/* Doctor Info */}
            <View style={styles.doctorCard}>
              <Image
                source={{ 
                  uri: activeToken.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80' 
                }}
                style={styles.doctorAvatar}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{activeToken.doctorName}</Text>
                <Text style={styles.doctorClinic}>
                  {activeToken.clinicName || 'Care Speciality Clinic'} • Consultation Room
                </Text>
              </View>
              <Pressable 
                style={styles.viewButton} 
                onPress={() => {
                  router.push({
                    pathname: '/doctor-details',
                    params: {
                      id: activeToken.doctorId,
                      name: activeToken.doctorName,
                      clinicName: activeToken.clinicName,
                      specialty: activeToken.specialty,
                      fee: activeToken.fee,
                      image: activeToken.image,
                    }
                  } as any);
                }}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </Pressable>
            </View>

            {/* Live Updates */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Live Timeline</Text>
              <Text style={styles.lastUpdated}>Synced with clinic desk</Text>
            </View>

            <View style={styles.timelineCard}>
              {recentEvents.length > 0 ? (
                recentEvents.map((evt, idx) => (
                  <View key={evt.id || idx} style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, evt.active ? styles.timelineDotActive : null]} />
                      {idx < recentEvents.length - 1 && <View style={styles.timelineLine} />}
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, evt.active ? styles.timelineTitleActive : null]}>
                        {evt.title}
                      </Text>
                      <Text style={styles.timelineSubtitle}>{evt.subtitle}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, styles.timelineDotActive]} />
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineTitle, styles.timelineTitleActive]}>
                        Token {activeToken.token} confirmed
                      </Text>
                      <Text style={styles.timelineSubtitle}>
                        Patient: {activeToken.patientName} • {currentAhead === 0 ? 'Your turn is up!' : `${currentAhead} patients ahead`}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeft}>
                      <View style={styles.timelineDot} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>
                        {liveCurrentToken !== 'None' ? `Room Active: Token #${liveCurrentToken} in room` : 'Practitioner ready for next token'}
                      </Text>
                      <Text style={styles.timelineSubtitle}>
                        Estimated pace: ~10 mins per consultation
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Action Buttons */}
            <Pressable 
              style={[styles.refreshButton, isRefreshing && { opacity: 0.7 }]} 
              onPress={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshIcon />
              <Text style={styles.refreshButtonText}>
                {isRefreshing ? 'Checking clinic status...' : 'Refresh Status'}
              </Text>
            </Pressable>

            <View style={styles.secondaryActionsRow}>
              <Pressable 
                style={[styles.directionButton, { flex: 1 }]}
                onPress={() => router.push('/explore' as any)}
              >
                <NavigateIcon />
                <Text style={styles.directionButtonText}>Find Clinics</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.callButton, { flex: 1, backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1 }]}
                onPress={handleCancelQueue}
              >
                <CallIcon />
                <Text style={[styles.callButtonText, { color: '#DC2626' }]}>
                  {isCancelling ? 'Cancelling...' : 'Cancel Token'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          /* Empty Queue State */
          <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 28, alignItems: 'center', marginTop: 24, shadowColor: '#0052FF', shadowOpacity: 0.06, shadowRadius: 20, elevation: 4 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <UsersIcon color="#0052FF" />
            </View>
            <Text style={{ fontSize: 20, fontFamily: 'Outfit_700Bold', color: '#0F172A', marginBottom: 6, textAlign: 'center' }}>
              No Active Queue Token
            </Text>
            <Text style={{ fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
              You do not have any pending consultation tokens right now. Explore available doctors and clinics to join a live queue.
            </Text>
            <Pressable 
              style={[styles.refreshButton, { width: '100%', backgroundColor: '#0052FF' }]}
              onPress={() => router.push('/explore' as any)}
            >
              <Text style={styles.refreshButtonText}>Browse Doctors & Join Queue</Text>
            </Pressable>
          </View>
        )}

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
