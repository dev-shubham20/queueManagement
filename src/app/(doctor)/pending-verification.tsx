import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MockDB, DoctorRecord } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';

export default function PendingVerificationScreen() {
  const router = useRouter();
  const [provider, setProvider] = useState<Partial<DoctorRecord> | null>(null);
  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'>('PENDING');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const pollingRef = useRef<any>(null);

  const checkStatus = async () => {
    try {
      setIsChecking(true);
      const activeReg = await MockDB.getActiveRegistration();
      const session = await MockDB.getCurrentSession();
      const phoneOrId = activeReg?.id || activeReg?.phone || session?.phone;

      if (!phoneOrId) {
        setIsChecking(false);
        return;
      }

      // Check remote MongoDB status
      const remote = await RemoteAPI.getDoctorStatus(phoneOrId);
      const target = remote || activeReg;

      if (target) {
        setProvider(target);
        const currentApproval = (target.approvalStatus || 'PENDING') as 'PENDING' | 'APPROVED' | 'REJECTED';
        setStatus(currentApproval);
        if (target.rejectionReason) {
          setRejectionReason(target.rejectionReason);
        }

        if (currentApproval === 'APPROVED') {
          // Sync session
          if (session) {
            await MockDB.updateUserStatus(session.phone, 'APPROVED');
            await MockDB.setCurrentSession({
              ...session,
              status: 'APPROVED',
            });
          }
        }
      }
    } catch (e) {
      console.error('Error polling doctor status:', e);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();

    // Poll status every 3.5 seconds
    pollingRef.current = setInterval(() => {
      checkStatus();
    }, 3500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleEditAndResubmit = async () => {
    if (provider) {
      await MockDB.saveRegistrationDraft(provider);
    }
    router.push('/doctor-info');
  };

  const handleEnterDashboard = async () => {
    const session = await MockDB.getCurrentSession();
    if (session) {
      await MockDB.setCurrentSession({
        ...session,
        status: 'APPROVED',
      });
    }
    router.replace('/(doctor)/dashboard');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons
            name={status === 'APPROVED' ? 'checkmark-circle' : status === 'REJECTED' ? 'alert-circle' : 'shield-checkmark'}
            size={24}
            color={status === 'APPROVED' ? '#10B981' : status === 'REJECTED' ? '#EF4444' : '#2563EB'}
          />
          <Text style={styles.headerTitle}>
            {status === 'APPROVED' ? 'Account Verified' : status === 'REJECTED' ? 'Verification Alert' : 'Verification Status'}
          </Text>
        </View>

        <Pressable onPress={checkStatus} style={styles.refreshIconBtn} disabled={isChecking}>
          {isChecking ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Ionicons name="refresh" size={20} color="#2563EB" />
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* State: APPROVED */}
        {status === 'APPROVED' && (
          <View style={styles.stateWrapper}>
            <View style={[styles.iconArea, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="checkmark-done" size={72} color="#10B981" />
            </View>

            <View style={[styles.statusBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
              <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statusBadgeText, { color: '#047857' }]}>APPROVED & ACTIVATED</Text>
            </View>

            <Text style={styles.title}>Practice Verified! 🎉</Text>
            <Text style={styles.subtitle}>
              Congratulations! Super Admin has reviewed and approved <Text style={{ fontWeight: '700', color: '#111827' }}>{provider?.clinicName || provider?.name || 'your practice'}</Text>. Your queue, patient appointments, and live tokens are now fully active.
            </Text>

            <View style={[styles.infoCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Ionicons name="sparkles" size={22} color="#10B981" style={{ marginRight: 12 }} />
              <Text style={[styles.infoText, { color: '#166534' }]}>
                All doctor tools, waiting tokens, and real-time consultation consoles are now unlocked for your practice.
              </Text>
            </View>

            <Pressable style={[styles.button, { backgroundColor: '#10B981' }]} onPress={handleEnterDashboard}>
              <Text style={styles.buttonText}>Open Practice Dashboard</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
        )}

        {/* State: REJECTED */}
        {status === 'REJECTED' && (
          <View style={styles.stateWrapper}>
            <View style={[styles.iconArea, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="close-circle" size={72} color="#EF4444" />
            </View>

            <View style={[styles.statusBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.statusBadgeText, { color: '#991B1B' }]}>REVISION REQUIRED</Text>
            </View>

            <Text style={styles.title}>Application Needs Update</Text>
            <Text style={styles.subtitle}>
              The Super Admin reviewed your practice registration and requires changes or additional verification before approval.
            </Text>

            {/* Rejection Reason Card */}
            <View style={styles.rejectionCard}>
              <View style={styles.rejectionHeader}>
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#DC2626" />
                <Text style={styles.rejectionTitle}>Admin Feedback & Reason</Text>
              </View>
              <Text style={styles.rejectionBody}>
                {rejectionReason || 'Please check your registration number, clinic address, and qualifications.'}
              </Text>
            </View>

            {/* Resubmit Action */}
            <Pressable style={[styles.button, { backgroundColor: '#DC2626' }]} onPress={handleEditAndResubmit}>
              <Ionicons name="pencil-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Edit Details & Resubmit</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push('/')}>
              <Text style={styles.secondaryButtonText}>Return to Home</Text>
            </Pressable>
          </View>
        )}

        {/* State: SUSPENDED */}
        {status === 'SUSPENDED' && (
          <View style={styles.stateWrapper}>
            <View style={[styles.iconArea, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="shield-outline" size={72} color="#DC2626" />
            </View>

            <View style={[styles.statusBadge, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}>
              <View style={[styles.dot, { backgroundColor: '#DC2626' }]} />
              <Text style={[styles.statusBadgeText, { color: '#991B1B' }]}>ACCOUNT SUSPENDED</Text>
            </View>

            <Text style={styles.title}>Practice Temporarily Suspended</Text>
            <Text style={styles.subtitle}>
              This practice account has been suspended by the platform administrator. Access to patient queues, token issuance, and consultation consoles is currently restricted.
            </Text>

            <View style={[styles.infoCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <Ionicons name="help-circle-outline" size={22} color="#D97706" style={{ marginRight: 12 }} />
              <Text style={[styles.infoText, { color: '#92400E' }]}>
                To resolve this status or request reactivation, please contact support at support@carequeue.in with your practitioner license details.
              </Text>
            </View>

            <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/role-selection')}>
              <Text style={styles.secondaryButtonText}>Return to Welcome Portal</Text>
            </Pressable>
          </View>
        )}

        {/* State: PENDING */}
        {status === 'PENDING' && (
          <View style={styles.stateWrapper}>
            <View style={styles.iconArea}>
              <Ionicons name="time" size={72} color="#D97706" />
            </View>

            <View style={styles.statusBadge}>
              <View style={styles.dot} />
              <Text style={styles.statusBadgeText}>UNDER SUPER ADMIN REVIEW</Text>
            </View>

            <Text style={styles.title}>Review in Progress</Text>
            <Text style={styles.subtitle}>
              Your practice registration for <Text style={{ fontWeight: '700', color: '#111827' }}>{provider?.clinicName || provider?.name || 'your clinic'}</Text> has been submitted to Super Admin. As soon as the platform owner verifies your credentials, this screen will update automatically.
            </Text>

            {/* Registration Summary Box */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryHeader}>Application Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Doctor Name</Text>
                <Text style={styles.summaryValue}>{provider?.name || 'Practitioner'}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Registered Phone</Text>
                <Text style={styles.summaryValue}>{provider?.phone || '...'}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Specialization</Text>
                <Text style={styles.summaryValue}>{provider?.specialization || 'General Practice'}</Text>
              </View>

              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.summaryLabel}>Review Status</Text>
                <Text style={[styles.summaryValue, { color: '#D97706', fontWeight: '700' }]}>Awaiting Owner Approval</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" style={{ marginRight: 12 }} />
              <Text style={styles.infoText}>
                Live sync active: When Super Admin clicks Approve in the web console, this app transitions automatically.
              </Text>
            </View>

            {/* Manual Check */}
            <Pressable style={styles.button} onPress={checkStatus} disabled={isChecking}>
              {isChecking ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="sync-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Check Approval Status Now</Text>
                </>
              )}
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={() => router.push('/')}>
              <Text style={styles.secondaryButtonText}>Return to Home</Text>
            </Pressable>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 10,
  },
  refreshIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  stateWrapper: {
    alignItems: 'center',
    marginTop: 28,
  },
  iconArea: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFBEB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginRight: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  summaryHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  rejectionCard: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 24,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  rejectionBody: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
});
