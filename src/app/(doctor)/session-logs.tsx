import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';

export default function SessionLogsScreen() {
  const router = useRouter();

  // Mock data for session logs
  const logs = [
    { id: '1', type: 'emergency', title: 'Emergency Token E-001 Generated', time: '12:45 PM', detail: 'Patient: Michael Smith' },
    { id: '2', type: 'complete', title: 'Token 403 Completed', time: '12:30 PM', detail: 'Patient: Clara Oswald' },
    { id: '3', type: 'skip', title: 'Token 402 Skipped', time: '12:15 PM', detail: 'Patient: Jonathan Henderson' },
    { id: '4', type: 'checkin', title: 'Token 404 Checked-in', time: '11:50 AM', detail: 'Patient: Arthur Williams' },
    { id: '5', type: 'complete', title: 'Token 401 Completed', time: '10:15 AM', detail: 'Patient: Amelia Pond' },
    { id: '6', type: 'start', title: 'Morning Session Started', time: '09:00 AM', detail: 'Dr. Sarah Jenkins' },
  ];

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'emergency': return { name: 'alert-circle', color: '#DC2626', bg: '#FEF2F2' };
      case 'complete': return { name: 'checkmark-circle', color: '#059669', bg: '#ECFDF5' };
      case 'skip': return { name: 'play-forward-circle', color: '#D97706', bg: '#FEF3C7' };
      case 'checkin': return { name: 'log-in', color: '#2563EB', bg: '#EFF6FF' };
      case 'start': return { name: 'power', color: '#4F46E5', bg: '#EEF2FF' };
      default: return { name: 'information-circle', color: '#64748B', bg: '#F1F5F9' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Session Logs</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>Today, Oct 24</Text>
          <View style={styles.activityBadge}>
            <Text style={styles.activityBadgeText}>{logs.length} Activities</Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {logs.map((log, index) => {
            const isLast = index === logs.length - 1;
            const iconSettings = getLogIcon(log.type);

            return (
              <View key={log.id} style={styles.logItem}>
                
                {/* Timeline Line */}
                {!isLast && <View style={styles.timelineLine} />}
                
                {/* Timeline Icon */}
                <View style={[styles.iconBox, { backgroundColor: iconSettings.bg }]}>
                  <Ionicons name={iconSettings.name as any} size={20} color={iconSettings.color} />
                </View>

                {/* Content */}
                <View style={styles.logContent}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logTitle}>{log.title}</Text>
                    <Text style={styles.logTime}>{log.time}</Text>
                  </View>
                  <Text style={styles.logDetail}>{log.detail}</Text>
                </View>
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  activityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  timelineContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: 24,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: 36,
    left: 17,
    bottom: -24,
    width: 2,
    backgroundColor: '#F1F5F9',
    zIndex: 0,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    zIndex: 1,
  },
  logContent: {
    flex: 1,
    paddingTop: 6,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  logTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginRight: 8,
  },
  logTime: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  logDetail: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});
