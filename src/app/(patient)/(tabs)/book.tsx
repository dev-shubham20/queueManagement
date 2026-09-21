import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';
import { Image } from 'expo-image';

// Icons
const PlusIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const CalendarIcon = ({ color = '#64748B' }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
  </Svg>
);

const EmptyStateIcon = () => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="12" y1="16" x2="12.01" y2="16" />
  </Svg>
);

import { ActiveTokenData, MockDB, PatientRecord } from '@/utils/storage';
import { useFocusEffect } from 'expo-router';

type TabType = 'Upcoming' | 'Completed' | 'Cancelled';

export default function BookScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const [activeToken, setActiveToken] = useState<ActiveTokenData | null>(null);
  const [completedList, setCompletedList] = useState<PatientRecord[]>([]);
  const [cancelling, setCancelling] = useState(false);

  const loadData = async () => {
    try {
      const token = await MockDB.getActiveToken();
      setActiveToken(token);

      const allPatients = await MockDB.getPatients();
      setCompletedList(allPatients.filter(p => p.treatmentStatus === 'COMPLETED'));
    } catch (e) {
      console.error('Error loading bookings', e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleCancelBooking = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      if (activeToken?.id) {
        await MockDB.cancelActiveToken(activeToken.id);
      } else {
        await MockDB.clearActiveToken();
      }
      setActiveToken(null);
    } catch (e) {
      console.error('Error cancelling booking', e);
    } finally {
      setCancelling(false);
    }
  };

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBox}>
        <EmptyStateIcon />
      </View>
      <ThemedText style={styles.emptyTitle}>{message}</ThemedText>
      <Pressable 
        style={[styles.primaryButton, { marginTop: 16, paddingHorizontal: 20 }]} 
        onPress={() => router.push('/explore' as any)}
      >
        <ThemedText style={styles.primaryButtonText}>Find Doctor & Book</ThemedText>
      </Pressable>
    </View>
  );

  const renderUpcoming = () => {
    if (!activeToken) {
      return renderEmptyState('You have no active appointments right now');
    }

    return (
      <View style={styles.bookingCard}> 
        <View style={styles.bookingTagRow}>
          <View style={styles.tagWrapper}>
            <ThemedText style={styles.bookingTag}>
              {activeToken.specialty ? activeToken.specialty.toUpperCase() : 'GENERAL CONSULTATION'}
            </ThemedText>
          </View>
          <View style={styles.badgePillLive}>
            <View style={styles.liveDot} />
            <ThemedText style={styles.badgeTextLive}>Live Queue</ThemedText>
          </View>
        </View>

        <View style={styles.doctorRow}>
          <Image
            source={{ uri: activeToken.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80' }}
            style={styles.doctorAvatar}
            contentFit="cover"
          />
          <View style={styles.doctorInfo}>
            <ThemedText style={styles.doctorLabel}>{activeToken.doctorName}</ThemedText>
            <View style={styles.metaRow}>
              <CalendarIcon />
              <ThemedText style={styles.bookingMeta}>
                {activeToken.appointmentDate || 'Today'} • {activeToken.session === 'evening' ? 'Evening' : 'Morning'}
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.tokenRow}>
          <View style={styles.tokenBox}>
            <ThemedText style={styles.tokenLabel}>Queue Token</ThemedText>
            <ThemedText style={styles.tokenValue}>#{activeToken.token}</ThemedText>
          </View>
          <View style={styles.waitBox}>
            <ThemedText style={styles.waitLabel}>Estimated Wait</ThemedText>
            <ThemedText style={styles.waitValue}>~{Math.max(5, (activeToken.positionAhead || 1) * 5)} mins</ThemedText>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/(patient)/(tabs)/queue')}>
            <ThemedText style={styles.primaryButtonText}>Track Live</ThemedText>
          </Pressable>
          <Pressable 
            style={[styles.cancelButton, { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' }]} 
            onPress={handleCancelBooking}
          >
            <ThemedText style={[styles.cancelButtonText, { color: '#DC2626' }]}>
              {cancelling ? 'Cancelling...' : 'Cancel Token'}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderCompleted = () => {
    if (completedList.length === 0) {
      return renderEmptyState('You have no completed consultations yet');
    }

    return (
      <>
        {completedList.map((item) => (
          <View key={item.id} style={styles.bookingCard}> 
            <View style={styles.bookingTagRow}>
              <View style={styles.tagWrapper}>
                <ThemedText style={styles.bookingTag}>
                  {item.condition || 'GENERAL CONSULTATION'}
                </ThemedText>
              </View>
              <View style={styles.badgePillCompleted}>
                <ThemedText style={styles.badgeTextCompleted}>Completed</ThemedText>
              </View>
            </View>

            <View style={styles.doctorRow}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80' }}
                style={styles.doctorAvatar}
                contentFit="cover"
              />
              <View style={styles.doctorInfo}>
                <ThemedText style={styles.doctorLabel}>{item.assignedDoctorName || 'Practitioner'}</ThemedText>
                <View style={styles.metaRow}>
                  <CalendarIcon />
                  <ThemedText style={styles.bookingMeta}>
                    {item.lastVisitDate ? `Visit: ${item.lastVisitDate}` : 'Past Visit'}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <Pressable 
                style={styles.primaryButtonOutline}
                onPress={() => router.push('/explore' as any)}
              >
                <ThemedText style={styles.primaryButtonOutlineText}>Book Again</ThemedText>
              </Pressable>
              <View style={styles.secondaryButton}>
                <ThemedText style={styles.secondaryButtonText}>Token #{item.tokenNumber || '--'}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <ThemedText style={styles.pageTitle}>My Bookings</ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.statusTabs}>
          {(['Upcoming', 'Completed', 'Cancelled'] as TabType[]).map((tab) => (
            <Pressable 
              key={tab}
              style={[styles.statusTab, activeTab === tab && styles.statusTabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <ThemedText style={[styles.statusTabText, activeTab === tab && styles.statusTabTextActive]}>
                {tab}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {activeTab === 'Upcoming' && renderUpcoming()}
        {activeTab === 'Completed' && renderCompleted()}
        {activeTab === 'Cancelled' && renderEmptyState('You have no cancelled bookings')}

      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push('/explore' as any)}>
        <PlusIcon />
      </Pressable>
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
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#1E293B',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  statusTabs: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  statusTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusTabActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statusTabText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_600SemiBold',
  },
  statusTabTextActive: {
    color: '#0052FF',
    fontFamily: 'Inter_700Bold',
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  bookingTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tagWrapper: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bookingTag: {
    fontSize: 11,
    color: '#475569',
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  badgePillLive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  badgeTextLive: {
    fontSize: 12,
    color: '#DC2626',
    fontFamily: 'Inter_700Bold',
  },
  badgePillStandard: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextStandard: {
    fontSize: 12,
    color: '#0052FF',
    fontFamily: 'Inter_700Bold',
  },
  badgePillCompleted: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTextCompleted: {
    fontSize: 12,
    color: '#16A34A',
    fontFamily: 'Inter_700Bold',
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#F1F5F9',
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorLabel: {
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#1E293B',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingMeta: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Inter_500Medium',
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  tokenBox: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  waitBox: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tokenLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 24,
    color: '#1E293B',
    fontFamily: 'Outfit_700Bold',
  },
  waitLabel: {
    fontSize: 12,
    color: '#60A5FA',
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  waitValue: {
    fontSize: 18,
    color: '#1D4ED8',
    fontFamily: 'Outfit_700Bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#0052FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  primaryButtonOutline: {
    flex: 2,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#0052FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonOutlineText: {
    color: '#0052FF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  secondaryButton: {
    flex: 1.5,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#1E293B',
    fontFamily: 'Inter_700Bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontFamily: 'Inter_700Bold',
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Inter_500Medium',
  },
  fab: {
    position: 'fixed',
    right: 20,
    bottom: 88,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0052FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0052FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
});
