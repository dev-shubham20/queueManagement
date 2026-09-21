import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserData } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';
import { SocketClient } from '@/utils/socket';

interface ReceptionistProps {
  session: UserData;
  onLogout?: () => void;
}

export default function ReceptionistCommandCenter({ session, onLogout }: ReceptionistProps) {
  // Queue State
  const [activeQueue, setActiveQueue] = useState<any | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  // Search Drawer State
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchError, setSearchError] = useState('');
  const [showCreatePatientInline, setShowCreatePatientInline] = useState(false);

  // New Patient Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [creatingPatient, setCreatingPatient] = useState(false);
  const [createPatientError, setCreatePatientError] = useState('');

  // Token Issuance State
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [tokenType, setTokenType] = useState<'REGULAR' | 'EMERGENCY'>('REGULAR');
  const [targetPatient, setTargetPatient] = useState<any | null>(null);
  const [issuingToken, setIssuingToken] = useState(false);
  const [issueError, setIssueError] = useState('');

  // Token Success Receipt State
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [issuedReceipt, setIssuedReceipt] = useState<any | null>(null);

  // Cancellation Modal State
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancellingToken, setCancellingToken] = useState<any | null>(null);
  const [cancellingAction, setCancellingAction] = useState(false);
  const [cancelReason, setCancelReason] = useState('Cancelled at front desk');

  // Queue Pause / Resume Action
  const [queueActionLoading, setQueueActionLoading] = useState(false);

  // Permissions Helper
  const hasPerm = useCallback((perm: string) => {
    if (!session) return false;
    const role = (session.role || '').toUpperCase();
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'DOCTOR' || role === 'CLINIC') return true;
    const perms = session.permissions || [];
    if (perms.includes(perm)) return true;
    // Map aliases
    if (perm === 'token:create' && perms.includes('token_issue')) return true;
    if (perm === 'token:create_emergency' && perms.includes('token_issue')) return true;
    if (perm === 'token:cancel' && perms.includes('token_cancel')) return true;
    if (perm === 'queue:pause' && perms.includes('queue_manage')) return true;
    if (perm === 'queue:resume' && perms.includes('queue_manage')) return true;
    if (perm === 'queue:view' && perms.includes('queue_manage')) return true;
    if (perm === 'patient:search' && perms.includes('patient_records')) return true;
    if (perm === 'patient:create' && perms.includes('patient_records')) return true;
    return false;
  }, [session]);

  const doctorId = session.doctorId || session.clinicId || session.id || 'doc-1';

  // Load Active Queue from Backend
  const loadQueueData = useCallback(async () => {
    try {
      const res = await RemoteAPI.getDoctorActiveQueue(doctorId);
      if (res && res.queue) {
        setActiveQueue(res.queue);
        if (Array.isArray(res.tokens)) {
          setTokens(res.tokens);
        }
      }
    } catch (err) {
      console.warn('Receptionist loadQueueData error:', err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadQueueData();
    const interval = setInterval(loadQueueData, 5000);
    return () => clearInterval(interval);
  }, [loadQueueData]);

  // Real-Time Socket.IO Synchronization
  const queueId = activeQueue?.id || activeQueue?._id || `queue-${doctorId}`;

  useEffect(() => {
    if (!queueId) return;

    SocketClient.joinQueue(queueId);

    const unsubCreated = SocketClient.onTokenCreated(() => loadQueueData());
    const unsubCalled = SocketClient.onTokenCalled(() => loadQueueData());
    const unsubServing = SocketClient.onTokenServing(() => loadQueueData());
    const unsubCompleted = SocketClient.onTokenCompleted(() => loadQueueData());
    const unsubSkipped = SocketClient.onTokenSkipped(() => loadQueueData());
    const unsubCancelled = SocketClient.onTokenCancelled(() => loadQueueData());
    const unsubStatus = SocketClient.onQueueStatusChanged(() => loadQueueData());
    const unsubEmergency = SocketClient.onEmergencyAlert((data) => {
      Alert.alert('EMERGENCY ALERT', `🚨 Emergency patient added: ${data.patientName} (${data.tokenNumber})`);
      loadQueueData();
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
  }, [queueId, loadQueueData]);

  // Current Patient Status Metrics
  const waitingTokens = tokens.filter(t => t.status === 'WAITING');
  const calledTokens = tokens.filter(t => t.status === 'CALLED');
  const servingTokens = tokens.filter(t => t.status === 'SERVING' || t.status === 'IN_CONSULTATION');
  const completedTokens = tokens.filter(t => t.status === 'COMPLETED');
  const skippedTokens = tokens.filter(t => t.status === 'SKIPPED');
  const cancelledTokens = tokens.filter(t => t.status === 'CANCELLED');

  const currentlyServing = servingTokens[0] || calledTokens[0] || null;
  const nextInLine = waitingTokens[0] || null;
  const isPaused = activeQueue?.status === 'PAUSED' || activeQueue?.isPaused === true;

  // Filter Tokens for Today's Activity Table
  const filteredTokens = tokens.filter((t) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'WAITING') return t.status === 'WAITING';
    if (activeFilter === 'CALLED') return t.status === 'CALLED';
    if (activeFilter === 'IN_CONSULTATION') return t.status === 'SERVING' || t.status === 'IN_CONSULTATION';
    if (activeFilter === 'COMPLETED') return t.status === 'COMPLETED';
    if (activeFilter === 'SKIPPED') return t.status === 'SKIPPED';
    if (activeFilter === 'CANCELLED') return t.status === 'CANCELLED';
    if (activeFilter === 'EMERGENCY') return t.tokenType === 'EMERGENCY' || t.priority === 0;
    return true;
  });

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // --- ACTIONS ---

  // 1. Patient Search
  const handleSearchPatient = async () => {
    const cleanPhone = searchPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setSearchError('Please enter a valid 10-digit mobile number');
      setSearchResult(null);
      return;
    }

    setSearching(true);
    setSearchError('');
    setSearchResult(null);
    setShowCreatePatientInline(false);

    try {
      const res = await RemoteAPI.searchPatientByPhone(cleanPhone);
      if (res.patient) {
        setSearchResult({
          patient: res.patient,
          activeToken: res.activeToken,
        });
      } else if (res.notFound) {
        setSearchError('Patient not found in clinic records');
        setShowCreatePatientInline(true);
        setNewPhone(cleanPhone);
      } else if (res.forbidden) {
        setSearchError('Access denied: Patient is registered with an external practice.');
      } else {
        setSearchError(res.error || 'Patient not found');
        setShowCreatePatientInline(true);
        setNewPhone(cleanPhone);
      }
    } catch (err: any) {
      setSearchError(err.message || 'Error searching patient');
    } finally {
      setSearching(false);
    }
  };

  // 2. Create Patient via Real API
  const handleCreatePatient = async () => {
    if (!newName.trim()) {
      setCreatePatientError('Patient full name is required');
      return;
    }
    const cleanPhone = newPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setCreatePatientError('Valid 10-digit mobile number is required');
      return;
    }

    setCreatingPatient(true);
    setCreatePatientError('');

    try {
      const res = await RemoteAPI.patientRegister({
        name: newName.trim(),
        phone: cleanPhone,
        age: newAge ? parseInt(newAge, 10) : 30,
        gender: newGender,
        condition: 'General Walk-in',
      });

      const patientCreated = res.patient || res.user || {
        name: newName.trim(),
        phone: cleanPhone,
        age: newAge ? parseInt(newAge, 10) : 30,
        gender: newGender,
      };

      setSearchResult({
        patient: patientCreated,
        activeToken: null,
      });
      setShowCreatePatientInline(false);
      setNewName('');
      setNewAge('');
    } catch (err: any) {
      setCreatePatientError(err.message || 'Failed to register patient');
    } finally {
      setCreatingPatient(false);
    }
  };

  // 3. Initiate Token Issuance
  const initiateTokenIssue = (patient: any, type: 'REGULAR' | 'EMERGENCY') => {
    setTargetPatient(patient);
    setTokenType(type);
    setIssueError('');
    setConfirmModalVisible(true);
  };

  // 4. Confirm & Issue Token (Strict Double-Click Prevention)
  const handleConfirmIssueToken = async () => {
    if (!targetPatient || issuingToken) return;

    setIssuingToken(true);
    setIssueError('');

    try {
      let res;
      if (tokenType === 'EMERGENCY') {
        res = await RemoteAPI.bookEmergencyToken({
          doctorId,
          patientName: targetPatient.name,
          patientPhone: targetPatient.phone,
          condition: 'Emergency Reception Walk-in',
        });
      } else {
        res = await RemoteAPI.bookRegularToken({
          doctorId,
          patientName: targetPatient.name,
          patientPhone: targetPatient.phone,
          patientAge: targetPatient.age,
          patientGender: targetPatient.gender,
          condition: 'General Walk-in',
          source: 'WALK_IN_RECEPTIONIST',
        });
      }

      const createdToken = res.token;
      setIssuedReceipt({
        tokenNumber: createdToken.tokenNumber,
        tokenType: createdToken.tokenType,
        patientName: createdToken.patientName,
        patientPhone: createdToken.patientPhone,
        positionAhead: createdToken.positionAhead ?? 0,
        estimatedWaitMinutes: createdToken.estimatedWaitMinutes ?? (tokenType === 'EMERGENCY' ? 0 : 15),
      });

      setConfirmModalVisible(false);
      setSearchModalVisible(false);
      setSuccessModalVisible(true);
      await loadQueueData();
    } catch (err: any) {
      setIssueError(err.message || 'Could not issue token. Please check capacity limits.');
    } finally {
      setIssuingToken(false);
    }
  };

  // 5. Token Cancellation
  const handleConfirmCancelToken = async () => {
    if (!cancellingToken || cancellingAction) return;

    setCancellingAction(true);
    try {
      const tokenId = cancellingToken._id || cancellingToken.id;
      await RemoteAPI.cancelToken(queueId, tokenId, cancelReason);
      setCancelModalVisible(false);
      setCancellingToken(null);
      await loadQueueData();
    } catch (err: any) {
      Alert.alert('Cancellation Error', err.message || 'Failed to cancel token');
    } finally {
      setCancellingAction(false);
    }
  };

  // 6. Queue Pause / Resume
  const handleToggleQueuePause = async () => {
    if (queueActionLoading) return;
    setQueueActionLoading(true);
    try {
      if (isPaused) {
        await RemoteAPI.resumeQueue(queueId);
      } else {
        await RemoteAPI.pauseQueue(queueId, 'Front-desk scheduled recess');
      }
      await loadQueueData();
    } catch (err: any) {
      Alert.alert('Queue Error', err.message || 'Could not update queue status');
    } finally {
      setQueueActionLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingText}>{getGreeting()}, {session.name || 'Staff'}</Text>
            <Text style={styles.clinicTitle}>{session.clinicName || activeQueue?.clinicName || 'Care Clinic Desk'}</Text>
            <Text style={styles.dateSubText}>Today, {todayFormatted}</Text>
          </View>
          <View style={styles.badgeColumn}>
            <View style={[styles.statusPill, isPaused ? styles.statusPillPaused : styles.statusPillActive]}>
              <View style={[styles.statusDot, isPaused ? styles.statusDotPaused : styles.statusDotActive]} />
              <Text style={[styles.statusPillText, isPaused ? styles.statusTextPaused : styles.statusTextActive]}>
                {isPaused ? '⏸ PAUSED' : '● ACTIVE'}
              </Text>
            </View>
            {onLogout && (
              <Pressable style={styles.logoutBtn} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={16} color="#64748B" />
                <Text style={styles.logoutBtnText}>Exit</Text>
              </Pressable>
            )}
          </View>
        </View>

        {isPaused && (
          <View style={styles.pausedAlertBanner}>
            <Ionicons name="pause-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.pausedAlertText}>
              Queue is currently paused. New patient admissions may be restricted per clinic policy.
            </Text>
          </View>
        )}
      </View>

      {/* 2. Primary Action Bar */}
      <View style={styles.actionBar}>
        {hasPerm('patient:search') && (
          <Pressable
            style={[styles.primaryActionBtn, styles.searchBtn]}
            onPress={() => {
              setSearchPhone('');
              setSearchResult(null);
              setSearchError('');
              setShowCreatePatientInline(false);
              setSearchModalVisible(true);
            }}
          >
            <Ionicons name="search" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionBtnText}>Search Patient</Text>
          </Pressable>
        )}

        {hasPerm('patient:create') && (
          <Pressable
            style={[styles.primaryActionBtn, styles.newPatientBtn]}
            onPress={() => {
              setSearchPhone('');
              setSearchResult(null);
              setSearchError('');
              setShowCreatePatientInline(true);
              setSearchModalVisible(true);
            }}
          >
            <Ionicons name="person-add" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionBtnText}>+ New Patient</Text>
          </Pressable>
        )}

        {hasPerm('token:create_emergency') && (
          <Pressable
            style={[styles.primaryActionBtn, styles.emergencyBtn]}
            onPress={() => {
              setSearchPhone('');
              setSearchResult(null);
              setSearchError('');
              setShowCreatePatientInline(true);
              setSearchModalVisible(true);
            }}
          >
            <Ionicons name="alert-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.primaryActionBtnText}>Emergency Token</Text>
          </Pressable>
        )}

        {(hasPerm('queue:pause') || hasPerm('queue:resume')) && (
          <Pressable
            style={[styles.togglePauseBtn, isPaused ? styles.resumeBtnBg : styles.pauseBtnBg]}
            onPress={handleToggleQueuePause}
            disabled={queueActionLoading}
          >
            {queueActionLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name={isPaused ? "play" : "pause"} size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.togglePauseBtnText}>
                  {isPaused ? 'Resume' : 'Pause'}
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {/* 3. Live Queue Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { borderLeftColor: '#2563EB' }]}>
          <Text style={styles.summaryCardLabel}>WAITING</Text>
          <Text style={[styles.summaryCardVal, { color: '#2563EB' }]}>{waitingTokens.length}</Text>
          <Text style={styles.summaryCardSub}>In Waiting Area</Text>
        </View>

        <View style={[styles.summaryCard, { borderLeftColor: '#F59E0B' }]}>
          <Text style={styles.summaryCardLabel}>CALLED</Text>
          <Text style={[styles.summaryCardVal, { color: '#D97706' }]}>{calledTokens.length}</Text>
          <Text style={styles.summaryCardSub}>Waiting Room Entry</Text>
        </View>

        <View style={[styles.summaryCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.summaryCardLabel}>CONSULTING</Text>
          <Text style={[styles.summaryCardVal, { color: '#059669' }]}>{servingTokens.length}</Text>
          <Text style={styles.summaryCardSub}>With Doctor</Text>
        </View>

        <View style={[styles.summaryCard, { borderLeftColor: '#6B7280' }]}>
          <Text style={styles.summaryCardLabel}>COMPLETED</Text>
          <Text style={[styles.summaryCardVal, { color: '#4B5563' }]}>
            {activeQueue?.totalTokensCompleted ?? completedTokens.length}
          </Text>
          <Text style={styles.summaryCardSub}>Finished Today</Text>
        </View>

        <View style={[styles.summaryCard, { borderLeftColor: '#9CA3AF' }]}>
          <Text style={styles.summaryCardLabel}>SKIPPED</Text>
          <Text style={[styles.summaryCardVal, { color: '#6B7280' }]}>{skippedTokens.length}</Text>
          <Text style={styles.summaryCardSub}>No-Shows</Text>
        </View>
      </View>

      {/* 4. Live Focus Board (Current Serving vs Next in Line) */}
      <View style={styles.focusBoard}>
        <View style={styles.focusCard}>
          <Text style={styles.focusHeader}>CURRENT TOKEN</Text>
          <Text style={styles.focusTokenNum}>
            {currentlyServing?.tokenNumber || activeQueue?.currentTokenNumber || 'None'}
          </Text>
          <Text style={styles.focusPatientName} numberOfLines={1}>
            {currentlyServing ? currentlyServing.patientName : 'No patient in room'}
          </Text>
          <View style={styles.focusStatusBadge}>
            <Text style={styles.focusStatusText}>
              {currentlyServing ? currentlyServing.status : 'IDLE'}
            </Text>
          </View>
        </View>

        <View style={styles.focusCard}>
          <Text style={styles.focusHeader}>NEXT TOKEN</Text>
          <Text style={[styles.focusTokenNum, { color: '#2563EB' }]}>
            {nextInLine?.tokenNumber || activeQueue?.nextTokenNumber || 'None'}
          </Text>
          <Text style={styles.focusPatientName} numberOfLines={1}>
            {nextInLine ? nextInLine.patientName : 'Queue is Clear'}
          </Text>
          <Text style={styles.focusWaitText}>
            Est. Wait: {nextInLine ? `${nextInLine.estimatedWaitMinutes || 10} mins` : '0 mins'}
          </Text>
        </View>
      </View>

      {/* 5. Filter Chips */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['ALL', 'WAITING', 'CALLED', 'IN_CONSULTATION', 'COMPLETED', 'SKIPPED', 'CANCELLED', 'EMERGENCY'].map((f) => (
            <Pressable
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f.replace('_', ' ')}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 6. Today's Activity Live Table */}
      <View style={styles.tableCard}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableTitle}>Live Queue Activity ({filteredTokens.length})</Text>
          <Pressable onPress={() => loadQueueData()} style={styles.refreshBtn}>
            <Ionicons name="refresh" size={16} color="#2563EB" />
            <Text style={styles.refreshBtnText}>Refresh</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="small" color="#2563EB" />
            <Text style={styles.emptySub}>Loading active queue...</Text>
          </View>
        ) : filteredTokens.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={36} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptySub}>
              {activeFilter === 'ALL'
                ? 'Queue is currently empty. Issue a token to get started.'
                : `No patients matching filter "${activeFilter}".`}
            </Text>
            {hasPerm('token:create') && (
              <Pressable
                style={styles.emptyActionBtn}
                onPress={() => {
                  setSearchPhone('');
                  setSearchResult(null);
                  setSearchModalVisible(true);
                }}
              >
                <Text style={styles.emptyActionBtnText}>Issue New Token</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.queueList}>
            {filteredTokens.map((t, idx) => {
              const isEmg = t.tokenType === 'EMERGENCY' || t.priority === 0;
              return (
                <View key={t._id || t.id || idx} style={styles.queueRow}>
                  {/* Token Badge */}
                  <View style={[styles.tokenCol, isEmg && styles.tokenColEmergency]}>
                    <Text style={[styles.tokenRowText, isEmg && styles.tokenRowTextEmergency]}>
                      {t.tokenNumber || `TK-${idx + 1}`}
                    </Text>
                    {isEmg && (
                      <View style={styles.emergencyTag}>
                        <Text style={styles.emergencyTagText}>EMERGENCY</Text>
                      </View>
                    )}
                  </View>

                  {/* Patient Info */}
                  <View style={styles.patientCol}>
                    <Text style={styles.patientRowName}>{t.patientName}</Text>
                    <Text style={styles.patientRowPhone}>
                      {t.patientPhone ? `+91 ${t.patientPhone}` : 'Walk-in'}
                    </Text>
                  </View>

                  {/* Status */}
                  <View style={styles.statusCol}>
                    <View
                      style={[
                        styles.statusRowBadge,
                        t.status === 'CALLED' && styles.badgeCalled,
                        (t.status === 'SERVING' || t.status === 'IN_CONSULTATION') && styles.badgeServing,
                        t.status === 'COMPLETED' && styles.badgeCompleted,
                        t.status === 'SKIPPED' && styles.badgeSkipped,
                        t.status === 'CANCELLED' && styles.badgeCancelled,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusRowText,
                          t.status === 'CALLED' && styles.textCalled,
                          (t.status === 'SERVING' || t.status === 'IN_CONSULTATION') && styles.textServing,
                          t.status === 'COMPLETED' && styles.textCompleted,
                          t.status === 'SKIPPED' && styles.textSkipped,
                          t.status === 'CANCELLED' && styles.textCancelled,
                        ]}
                      >
                        {t.status === 'SERVING' ? 'IN CONSULTATION' : t.status}
                      </Text>
                    </View>
                    <Text style={styles.waitRowText}>
                      {t.status === 'WAITING' ? `${t.estimatedWaitMinutes || 10}m wait` : ''}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.actionCol}>
                    {hasPerm('token:cancel') && ['WAITING', 'CALLED'].includes(t.status) ? (
                      <Pressable
                        style={styles.cancelTokenBtn}
                        onPress={() => {
                          setCancellingToken(t);
                          setCancelReason('Cancelled by patient request');
                          setCancelModalVisible(true);
                        }}
                      >
                        <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
                        <Text style={styles.cancelTokenBtnText}>Cancel</Text>
                      </Pressable>
                    ) : (
                      <Text style={styles.actionColDisabled}>--</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ========================================================================= */}
      {/* MODAL 1: PATIENT SEARCH & REGISTRATION DRAWER                             */}
      {/* ========================================================================= */}
      <Modal
        visible={searchModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search / Create Patient</Text>
              <Pressable onPress={() => setSearchModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
              {/* Phone Search Input */}
              <Text style={styles.inputLabel}>PATIENT MOBILE NUMBER (10 DIGITS)</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={searchPhone}
                  onChangeText={(t) => {
                    setSearchPhone(t);
                    setSearchError('');
                  }}
                  maxLength={10}
                />
                <Pressable
                  style={[styles.modalSearchBtn, searching && { opacity: 0.6 }]}
                  onPress={handleSearchPatient}
                  disabled={searching}
                >
                  {searching ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSearchBtnText}>Search</Text>
                  )}
                </Pressable>
              </View>

              {searchError !== '' && (
                <View style={styles.searchAlertBox}>
                  <Ionicons name="information-circle" size={16} color="#DC2626" />
                  <Text style={styles.searchAlertText}>{searchError}</Text>
                </View>
              )}

              {/* Patient Found Card */}
              {searchResult?.patient && (
                <View style={styles.patientFoundCard}>
                  <View style={styles.patientFoundHeader}>
                    <View style={styles.avatarFound}>
                      <Ionicons name="person" size={20} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.foundName}>{searchResult.patient.name}</Text>
                      <Text style={styles.foundSub}>
                        +91 {searchResult.patient.phone} • {searchResult.patient.gender || 'OTHER'} • {searchResult.patient.age || '30'} yrs
                      </Text>
                    </View>
                  </View>

                  {searchResult.activeToken ? (
                    <View style={styles.activeTokenNotice}>
                      <Ionicons name="alert-circle" size={16} color="#D97706" />
                      <Text style={styles.activeTokenNoticeText}>
                        Patient already has active Token {searchResult.activeToken.tokenNumber} ({searchResult.activeToken.status}).
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.foundActionRow}>
                      {hasPerm('token:create') && (
                        <Pressable
                          style={styles.issueRegBtn}
                          onPress={() => initiateTokenIssue(searchResult.patient, 'REGULAR')}
                        >
                          <Ionicons name="ticket-outline" size={16} color="#FFFFFF" />
                          <Text style={styles.issueRegBtnText}>Issue Regular Token</Text>
                        </Pressable>
                      )}

                      {hasPerm('token:create_emergency') && (
                        <Pressable
                          style={styles.issueEmgBtn}
                          onPress={() => initiateTokenIssue(searchResult.patient, 'EMERGENCY')}
                        >
                          <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
                          <Text style={styles.issueEmgBtnText}>Emergency Token</Text>
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* Inline Create Patient Form */}
              {showCreatePatientInline && (
                <View style={styles.createPatientCard}>
                  <Text style={styles.createFormTitle}>Create New Patient Record</Text>
                  <Text style={styles.createFormSub}>Patient will be registered into clinic database</Text>

                  {createPatientError !== '' && (
                    <View style={styles.searchAlertBox}>
                      <Ionicons name="alert-circle" size={16} color="#DC2626" />
                      <Text style={styles.searchAlertText}>{createPatientError}</Text>
                    </View>
                  )}

                  <Text style={styles.inputLabel}>FULL NAME *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="E.g. Rahul Verma"
                    placeholderTextColor="#94A3B8"
                    value={newName}
                    onChangeText={setNewName}
                  />

                  <Text style={styles.inputLabel}>MOBILE NUMBER (10 DIGITS) *</Text>
                  <TextInput
                    style={styles.modalTextInput}
                    placeholder="10-digit mobile"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={newPhone}
                    onChangeText={setNewPhone}
                    maxLength={10}
                  />

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>AGE</Text>
                      <TextInput
                        style={styles.modalTextInput}
                        placeholder="E.g. 32"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        value={newAge}
                        onChangeText={setNewAge}
                        maxLength={3}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inputLabel}>GENDER</Text>
                      <View style={styles.genderRow}>
                        {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                          <Pressable
                            key={g}
                            style={[styles.genderBtn, newGender === g && styles.genderBtnActive]}
                            onPress={() => setNewGender(g)}
                          >
                            <Text style={[styles.genderBtnText, newGender === g && styles.genderBtnTextActive]}>
                              {g[0]}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  </View>

                  <Pressable
                    style={[styles.createPatientSubmitBtn, creatingPatient && { opacity: 0.6 }]}
                    onPress={handleCreatePatient}
                    disabled={creatingPatient}
                  >
                    {creatingPatient ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.createPatientSubmitBtnText}>Save Patient Record</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: TOKEN CONFIRMATION MODAL                                         */}
      {/* ========================================================================= */}
      <Modal
        visible={confirmModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => !issuingToken && setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={[styles.confirmTypeHeader, tokenType === 'EMERGENCY' && styles.confirmTypeHeaderEmg]}>
              <Ionicons
                name={tokenType === 'EMERGENCY' ? "flash" : "ticket"}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.confirmTypeTitle}>
                Issue {tokenType === 'EMERGENCY' ? 'EMERGENCY' : 'REGULAR'} Token
              </Text>
            </View>

            <View style={styles.confirmBody}>
              {issueError !== '' && (
                <View style={styles.issueAlertBox}>
                  <Ionicons name="alert-circle" size={16} color="#DC2626" />
                  <Text style={styles.issueAlertText}>{issueError}</Text>
                </View>
              )}

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Patient:</Text>
                <Text style={styles.confirmDetailVal}>{targetPatient?.name}</Text>
              </View>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Phone:</Text>
                <Text style={styles.confirmDetailVal}>+91 {targetPatient?.phone}</Text>
              </View>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Clinic:</Text>
                <Text style={styles.confirmDetailVal}>{session.clinicName || 'Care Clinic'}</Text>
              </View>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Queue:</Text>
                <Text style={styles.confirmDetailVal}>{activeQueue?.doctorName || 'General Queue'}</Text>
              </View>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Token Type:</Text>
                <Text style={[styles.confirmDetailVal, tokenType === 'EMERGENCY' ? { color: '#DC2626', fontWeight: '800' } : { color: '#2563EB' }]}>
                  {tokenType}
                </Text>
              </View>

              {tokenType === 'EMERGENCY' && (
                <View style={styles.emergencyWarningBox}>
                  <Ionicons name="warning-outline" size={16} color="#B91C1C" />
                  <Text style={styles.emergencyWarningText}>
                    This patient will be prioritized to the front of the queue ahead of regular tokens.
                  </Text>
                </View>
              )}

              <View style={styles.confirmBtnRow}>
                <Pressable
                  style={styles.confirmCancelBtn}
                  onPress={() => setConfirmModalVisible(false)}
                  disabled={issuingToken}
                >
                  <Text style={styles.confirmCancelBtnText}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.confirmActionBtn,
                    tokenType === 'EMERGENCY' ? styles.confirmActionBtnEmg : styles.confirmActionBtnReg,
                    issuingToken && { opacity: 0.6 }
                  ]}
                  onPress={handleConfirmIssueToken}
                  disabled={issuingToken}
                >
                  {issuingToken ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmActionBtnText}>
                      {tokenType === 'EMERGENCY' ? 'Confirm Emergency' : 'Confirm & Issue Token'}
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: TOKEN SUCCESS RECEIPT MODAL                                      */}
      {/* ========================================================================= */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.receiptCard}>
            <View style={styles.receiptHeader}>
              <Ionicons name="checkmark-circle" size={44} color="#16A34A" />
              <Text style={styles.receiptSuccessTitle}>Token Issued Successfully</Text>
              <Text style={styles.receiptSuccessSub}>Patient is added to live clinic queue</Text>
            </View>

            <View style={styles.receiptTicketBox}>
              <Text style={styles.receiptTokenLabel}>TOKEN NUMBER</Text>
              <Text style={styles.receiptTokenNumber}>{issuedReceipt?.tokenNumber || 'TK-01'}</Text>
              <Text style={styles.receiptTypeBadge}>{issuedReceipt?.tokenType || 'REGULAR'}</Text>
            </View>

            <View style={styles.receiptInfoGrid}>
              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>Patient Name:</Text>
                <Text style={styles.receiptInfoVal}>{issuedReceipt?.patientName}</Text>
              </View>

              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>Queue Position:</Text>
                <Text style={styles.receiptInfoVal}>
                  {issuedReceipt?.positionAhead === 0 ? 'Next in Room' : `#${(issuedReceipt?.positionAhead ?? 0) + 1}`}
                </Text>
              </View>

              <View style={styles.receiptInfoRow}>
                <Text style={styles.receiptInfoLabel}>Estimated Wait:</Text>
                <Text style={styles.receiptInfoVal}>{issuedReceipt?.estimatedWaitMinutes || 0} minutes</Text>
              </View>
            </View>

            <View style={styles.receiptActionColumn}>
              <Pressable
                style={styles.printBtn}
                onPress={() => Alert.alert('Thermal Print', 'Sent print job to local clinic thermal printer.')}
              >
                <Ionicons name="print-outline" size={18} color="#1E293B" />
                <Text style={styles.printBtnText}>Print Token Slip</Text>
              </Pressable>

              <Pressable
                style={styles.issueAnotherBtn}
                onPress={() => {
                  setSuccessModalVisible(false);
                  setSearchPhone('');
                  setSearchResult(null);
                  setSearchModalVisible(true);
                }}
              >
                <Ionicons name="add-circle-outline" size={18} color="#2563EB" />
                <Text style={styles.issueAnotherBtnText}>Issue Another Token</Text>
              </Pressable>

              <Pressable
                style={styles.backToQueueBtn}
                onPress={() => setSuccessModalVisible(false)}
              >
                <Text style={styles.backToQueueBtnText}>Back to Live Queue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: TOKEN CANCELLATION CONFIRMATION                                  */}
      {/* ========================================================================= */}
      <Modal
        visible={cancelModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => !cancellingAction && setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmCard}>
            <View style={[styles.confirmTypeHeader, { backgroundColor: '#DC2626' }]}>
              <Ionicons name="close-circle" size={24} color="#FFFFFF" />
              <Text style={styles.confirmTypeTitle}>Cancel Token Confirmation</Text>
            </View>

            <View style={styles.confirmBody}>
              <Text style={styles.cancelWarningText}>
                Are you sure you want to cancel this active patient token? This cannot be undone.
              </Text>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Token:</Text>
                <Text style={[styles.confirmDetailVal, { color: '#DC2626', fontWeight: '800' }]}>
                  {cancellingToken?.tokenNumber}
                </Text>
              </View>

              <View style={styles.confirmDetailRow}>
                <Text style={styles.confirmDetailLabel}>Patient:</Text>
                <Text style={styles.confirmDetailVal}>{cancellingToken?.patientName}</Text>
              </View>

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>CANCELLATION REASON</Text>
              <TextInput
                style={styles.modalTextInput}
                value={cancelReason}
                onChangeText={setCancelReason}
                placeholder="Reason for cancellation"
              />

              <View style={styles.confirmBtnRow}>
                <Pressable
                  style={styles.confirmCancelBtn}
                  onPress={() => setCancelModalVisible(false)}
                  disabled={cancellingAction}
                >
                  <Text style={styles.confirmCancelBtnText}>Keep Token</Text>
                </Pressable>

                <Pressable
                  style={[styles.confirmActionBtn, { backgroundColor: '#DC2626' }, cancellingAction && { opacity: 0.6 }]}
                  onPress={handleConfirmCancelToken}
                  disabled={cancellingAction}
                >
                  {cancellingAction ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmActionBtnText}>Confirm Cancel</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  clinicTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 2,
  },
  dateSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillActive: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  statusPillPaused: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#16A34A',
  },
  statusDotPaused: {
    backgroundColor: '#DC2626',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextActive: {
    color: '#15803D',
  },
  statusTextPaused: {
    color: '#B91C1C',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  logoutBtnText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  pausedAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  pausedAlertText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  searchBtn: {
    backgroundColor: '#2563EB',
  },
  newPatientBtn: {
    backgroundColor: '#059669',
  },
  emergencyBtn: {
    backgroundColor: '#DC2626',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  togglePauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  pauseBtnBg: {
    backgroundColor: '#475569',
  },
  resumeBtnBg: {
    backgroundColor: '#16A34A',
  },
  togglePauseBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    minWidth: 95,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  summaryCardLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  summaryCardVal: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryCardSub: {
    fontSize: 9,
    color: '#94A3B8',
    marginTop: 2,
  },
  focusBoard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  focusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  focusHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  focusTokenNum: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginVertical: 4,
  },
  focusPatientName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  focusStatusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  focusStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
  },
  focusWaitText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  filterRow: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  tableCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refreshBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 240,
  },
  emptyActionBtn: {
    marginTop: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  emptyActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  queueList: {
    gap: 8,
  },
  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  tokenCol: {
    width: 68,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenColEmergency: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  tokenRowText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E40AF',
  },
  tokenRowTextEmergency: {
    color: '#DC2626',
  },
  emergencyTag: {
    backgroundColor: '#DC2626',
    borderRadius: 2,
    paddingHorizontal: 3,
    marginTop: 2,
  },
  emergencyTagText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  patientCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  patientRowName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientRowPhone: {
    fontSize: 11,
    color: '#64748B',
  },
  statusCol: {
    alignItems: 'flex-end',
    width: 100,
  },
  statusRowBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#EFF6FF',
  },
  statusRowText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  badgeCalled: {
    backgroundColor: '#FEF3C7',
  },
  textCalled: {
    color: '#B45309',
  },
  badgeServing: {
    backgroundColor: '#DCFCE7',
  },
  textServing: {
    color: '#15803D',
  },
  badgeCompleted: {
    backgroundColor: '#F1F5F9',
  },
  textCompleted: {
    color: '#475569',
  },
  badgeSkipped: {
    backgroundColor: '#F3F4F6',
  },
  textSkipped: {
    color: '#6B7280',
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
  },
  textCancelled: {
    color: '#DC2626',
  },
  waitRowText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  actionCol: {
    width: 60,
    alignItems: 'flex-end',
  },
  cancelTokenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  cancelTokenBtnText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '700',
  },
  actionColDisabled: {
    color: '#CBD5E1',
    fontSize: 12,
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  modalSearchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  modalSearchBtn: {
    height: 44,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  searchAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  searchAlertText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '600',
  },
  patientFoundCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 12,
  },
  patientFoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarFound: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foundName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  foundSub: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
  },
  foundActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  issueRegBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
  },
  issueRegBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  issueEmgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 8,
  },
  issueEmgBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTokenNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
  },
  activeTokenNoticeText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  createPatientCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
  },
  createFormTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  createFormSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  modalTextInput: {
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 4,
    height: 42,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  genderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  genderBtnTextActive: {
    color: '#FFFFFF',
  },
  createPatientSubmitBtn: {
    backgroundColor: '#059669',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  createPatientSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Confirm Modal
  confirmCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    padding: 16,
  },
  confirmTypeHeaderEmg: {
    backgroundColor: '#DC2626',
  },
  confirmTypeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  confirmBody: {
    padding: 20,
  },
  issueAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
  issueAlertText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  confirmDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  confirmDetailLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  confirmDetailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  emergencyWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 14,
  },
  emergencyWarningText: {
    fontSize: 12,
    color: '#991B1B',
    flex: 1,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  confirmCancelBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmCancelBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmActionBtn: {
    flex: 1.6,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmActionBtnReg: {
    backgroundColor: '#2563EB',
  },
  confirmActionBtnEmg: {
    backgroundColor: '#DC2626',
  },
  confirmActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  cancelWarningText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 12,
    lineHeight: 18,
  },

  // Receipt Modal
  receiptCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptSuccessTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  receiptSuccessSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  receiptTicketBox: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTokenLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  receiptTokenNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1E3A8A',
    marginVertical: 4,
  },
  receiptTypeBadge: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  receiptInfoGrid: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    paddingVertical: 10,
    marginBottom: 16,
  },
  receiptInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  receiptInfoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  receiptInfoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  receiptActionColumn: {
    width: '100%',
    gap: 8,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
  },
  printBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  issueAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  issueAnotherBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  backToQueueBtn: {
    height: 42,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToQueueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
