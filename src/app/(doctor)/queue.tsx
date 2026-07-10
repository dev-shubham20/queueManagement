import React from 'react';
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

export default function QueueScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionHeader}>CURRENTLY SERVING</Text>

        {/* Serving Card */}
        <View style={styles.servingCardContainer}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.servingCard}>
            
            <View style={styles.servingHeaderRow}>
              <View style={styles.tokenPill}>
                <Text style={styles.tokenText}>GP-402</Text>
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>Consultation{'\n'}Time</Text>
                <Text style={styles.timeValue}>12:45</Text>
              </View>
            </View>

            <Text style={styles.patientName}>Jonathan{'\n'}Henderson</Text>

            <Pressable style={styles.completeButton}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>Complete Consultation</Text>
            </Pressable>

            <Pressable style={styles.skipButton}>
              <Ionicons name="play-skip-forward" size={18} color="#475569" />
              <Text style={styles.skipButtonText}>Skip</Text>
            </Pressable>

          </View>
        </View>

        {/* Next in Line */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeader}>NEXT IN LINE</Text>
          <Text style={styles.linkText}>3 Waiting</Text>
        </View>

        <Pressable style={styles.waitingItem} onPress={() => router.push('/token-details')}>
          <View style={styles.waitingPill}>
            <Text style={styles.waitingPillText}>GP-{'\n'}403</Text>
          </View>
          <View style={styles.waitingInfo}>
            <Text style={styles.waitingName}>Eleanor Shellstrop</Text>
            <Text style={styles.waitingReason}>General Checkup</Text>
          </View>
          <View style={styles.waitingTimeBlock}>
            <Text style={styles.waitingTimeLabel}>Est. Wait</Text>
            <Text style={styles.waitingTimeValue}>8 mins</Text>
          </View>
        </Pressable>

        <Pressable style={styles.waitingItem} onPress={() => router.push('/token-details')}>
          <View style={styles.waitingPill}>
            <Text style={styles.waitingPillText}>GP-{'\n'}404</Text>
          </View>
          <View style={styles.waitingInfo}>
            <Text style={styles.waitingName}>Chidi Anagonye</Text>
            <Text style={styles.waitingReason}>Prescription Renewal</Text>
          </View>
          <View style={styles.waitingTimeBlock}>
            <Text style={styles.waitingTimeLabel}>Est. Wait</Text>
            <Text style={styles.waitingTimeValue}>22 mins</Text>
          </View>
        </Pressable>

        <Pressable style={styles.waitingItem} onPress={() => router.push('/token-details')}>
          <View style={styles.waitingPill}>
            <Text style={styles.waitingPillText}>GP-{'\n'}405</Text>
          </View>
          <View style={styles.waitingInfo}>
            <Text style={styles.waitingName}>Tahani Al-Jamil</Text>
            <Text style={styles.waitingReason}>Consultation</Text>
          </View>
          <View style={styles.waitingTimeBlock}>
            <Text style={styles.waitingTimeLabel}>Est. Wait</Text>
            <Text style={styles.waitingTimeValue}>35 mins</Text>
          </View>
        </Pressable>

        {/* Future Schedule block removed or just leaving the end of block here */}

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
            <Pressable style={[styles.actionBox, styles.actionBoxBlue]}>
              <Ionicons name="person-add" size={32} color="#FFFFFF" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxBlueText}>Call Next</Text>
            </Pressable>
            
            <Pressable style={[styles.actionBox, styles.actionBoxRed]}>
              <Ionicons name="medical" size={32} color="#DC2626" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxRedText}>Emergency{'\n'}Insert</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={styles.actionBoxOutline}>
              <Ionicons name="pause-circle-outline" size={32} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxOutlineText}>Pause Queue</Text>
            </Pressable>

            <Pressable style={styles.actionBoxOutline}>
              <Ionicons name="reload-circle-outline" size={32} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxOutlineText}>Rejoin Missed</Text>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable style={[styles.actionBoxOutline, { flex: 0.48 }]} onPress={() => router.push('/add-patient')}>
              <Ionicons name="person-add-outline" size={32} color="#475569" style={{ marginBottom: 12 }} />
              <Text style={styles.actionBoxOutlineText}>Add Walk-in</Text>
            </Pressable>
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
