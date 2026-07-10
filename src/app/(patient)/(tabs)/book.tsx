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

type TabType = 'Upcoming' | 'Completed' | 'Cancelled';

export default function BookScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');

  const renderUpcoming = () => (
    <>
      <View style={styles.bookingCard}> 
        <View style={styles.bookingTagRow}>
          <View style={styles.tagWrapper}>
            <ThemedText style={styles.bookingTag}>GENERAL CONSULTATION</ThemedText>
          </View>
          <View style={styles.badgePillLive}>
            <View style={styles.liveDot} />
            <ThemedText style={styles.badgeTextLive}>Live</ThemedText>
          </View>
        </View>

        <View style={styles.doctorRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=200&q=80' }}
            style={styles.doctorAvatar}
            contentFit="cover"
          />
          <View style={styles.doctorInfo}>
            <ThemedText style={styles.doctorLabel}>Dr. Sarah Mitchell</ThemedText>
            <View style={styles.metaRow}>
              <CalendarIcon />
              <ThemedText style={styles.bookingMeta}>Today • 10:30 AM</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.tokenRow}>
          <View style={styles.tokenBox}>
            <ThemedText style={styles.tokenLabel}>Queue Token</ThemedText>
            <ThemedText style={styles.tokenValue}>#A24</ThemedText>
          </View>
          <View style={styles.waitBox}>
            <ThemedText style={styles.waitLabel}>Estimated Wait</ThemedText>
            <ThemedText style={styles.waitValue}>~12 mins</ThemedText>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.primaryButton} onPress={() => router.push('/queue')}>
            <ThemedText style={styles.primaryButtonText}>Track Live</ThemedText>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/booking-details')}>
            <ThemedText style={styles.secondaryButtonText}>Details</ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.bookingCard}> 
        <View style={styles.bookingTagRow}>
          <View style={styles.tagWrapper}>
            <ThemedText style={styles.bookingTag}>DERMATOLOGY</ThemedText>
          </View>
          <View style={styles.badgePillStandard}>
            <ThemedText style={styles.badgeTextStandard}>Upcoming</ThemedText>
          </View>
        </View>

        <View style={styles.doctorRow}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=200&q=80' }}
            style={styles.doctorAvatar}
            contentFit="cover"
          />
          <View style={styles.doctorInfo}>
            <ThemedText style={styles.doctorLabel}>Dr. James Chen</ThemedText>
            <View style={styles.metaRow}>
              <CalendarIcon />
              <ThemedText style={styles.bookingMeta}>Oct 27, 2023 • 02:15 PM</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/booking-details')}>
            <ThemedText style={styles.secondaryButtonText}>View Details</ThemedText>
          </Pressable>
          <Pressable style={styles.cancelButton}>
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </Pressable>
        </View>
      </View>
    </>
  );

  const renderCompleted = () => (
    <View style={styles.bookingCard}> 
      <View style={styles.bookingTagRow}>
        <View style={styles.tagWrapper}>
          <ThemedText style={styles.bookingTag}>CARDIOLOGY</ThemedText>
        </View>
        <View style={styles.badgePillCompleted}>
          <ThemedText style={styles.badgeTextCompleted}>Completed</ThemedText>
        </View>
      </View>

      <View style={styles.doctorRow}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1594824436998-dd40e4f2084c?auto=format&fit=crop&w=200&q=80' }}
          style={styles.doctorAvatar}
          contentFit="cover"
        />
        <View style={styles.doctorInfo}>
          <ThemedText style={styles.doctorLabel}>Dr. Emily Wong</ThemedText>
          <View style={styles.metaRow}>
            <CalendarIcon />
            <ThemedText style={styles.bookingMeta}>Sep 14, 2023 • 11:00 AM</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.primaryButtonOutline}>
          <ThemedText style={styles.primaryButtonOutlineText}>Book Again</ThemedText>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <ThemedText style={styles.secondaryButtonText}>E-Receipt</ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBox}>
        <EmptyStateIcon />
      </View>
      <ThemedText style={styles.emptyTitle}>{message}</ThemedText>
    </View>
  );

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
