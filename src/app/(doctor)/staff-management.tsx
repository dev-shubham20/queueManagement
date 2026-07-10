import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DashboardHeader from '../../components/DashboardHeader';
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

export default function StaffManagementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="Staff Management" leftIcon="menu" rightElement="avatar" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title & Add Button */}
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>Active Personnel</Text>
          <Text style={styles.subtitle}>Manage roles and clinic access permissions.</Text>
          <Pressable style={styles.addButton} onPress={() => router.push('/add-staff')}>
            <Ionicons name="person-add-outline" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Staff</Text>
          </Pressable>
        </View>

        {/* Staff List */}
        
        {/* Staff Card 1 */}
        <View style={styles.staffCard}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.cardHeaderRow}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.staffInfoContainer}>
              <Text style={styles.staffName}>Elena Rodriguez</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>RECEPTIONIST</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          
          <View style={styles.staffDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>elena.r@cityhealth.com</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>Mon - Fri, 08:00 - 16:00</Text>
            </View>
          </View>

          <Pressable style={styles.editButton} onPress={() => router.push('/staff-permissions')}>
            <Ionicons name="lock-closed-outline" size={16} color="#2563EB" />
            <Text style={styles.editButtonText}>Edit Permissions</Text>
          </Pressable>
        </View>

        {/* Staff Card 2 */}
        <View style={styles.staffCard}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.cardHeaderRow}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.staffInfoContainer}>
              <Text style={styles.staffName}>Marcus Chen</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>ASSISTANT</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          
          <View style={styles.staffDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>m.chen@cityhealth.com</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>Tue - Sat, 09:00 - 17:00</Text>
            </View>
          </View>
          <Pressable style={styles.editButton} onPress={() => router.push('/staff-permissions')}>
            <Ionicons name="lock-closed-outline" size={16} color="#2563EB" />
            <Text style={styles.editButtonText}>Edit Permissions</Text>
          </Pressable>
        </View>

        {/* Staff Card 3 */}
        <View style={styles.staffCard}>
          <View style={styles.cardBorderLeft} />
          <View style={styles.cardHeaderRow}>
            <View style={styles.avatarBox}>
              <Ionicons name="person" size={24} color="#9CA3AF" />
            </View>
            <View style={styles.staffInfoContainer}>
              <Text style={styles.staffName}>Sarah Jenkins</Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>RECEPTIONIST</Text>
              </View>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>
          
          <View style={styles.staffDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>s.jenkins@cityhealth.com</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color="#4B5563" style={styles.detailIcon} />
              <Text style={styles.detailText}>Mon - Thu, 10:00 - 18:00</Text>
            </View>
          </View>

          <Pressable style={styles.editButton} onPress={() => router.push('/staff-permissions')}>
            <Ionicons name="lock-closed-outline" size={16} color="#2563EB" />
            <Text style={styles.editButtonText}>Edit Permissions</Text>
          </Pressable>
        </View>

        {/* Summary Stats Cards */}
        <View style={styles.statsContainer}>
          {/* Total Staff */}
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="people-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.statTextContent}>
              <Text style={styles.statLabel}>TOTAL STAFF</Text>
              <Text style={styles.statValue}>24</Text>
            </View>
          </View>

          {/* On Duty Now */}
          <View style={[styles.statCard, { backgroundColor: '#E6F4EA' }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFFFFF' }]}>
              <Ionicons name="person-outline" size={20} color="#16A34A" />
              <View style={styles.dutyCheckBadge}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            </View>
            <View style={styles.statTextContent}>
              <Text style={[styles.statLabel, { color: '#166534' }]}>ON DUTY NOW</Text>
              <Text style={styles.statValue}>8</Text>
            </View>
          </View>

          {/* Admin Users */}
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF', marginBottom: 0 }]}>
            <View style={[styles.statIconBox, { backgroundColor: '#FFFFFF' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#2563EB" />
            </View>
            <View style={styles.statTextContent}>
              <Text style={[styles.statLabel, { color: '#4F46E5' }]}>ADMIN USERS</Text>
              <Text style={styles.statValue}>3</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* App Bottom Tab Bar */}
      <BottomTabBar />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },

  // Title Area
  titleArea: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#0052CC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Staff Cards
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    paddingLeft: 20,
    marginBottom: 16,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardBorderLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#0052CC',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  staffInfoContainer: {
    flex: 1,
    paddingTop: 2,
  },
  staffName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  staffDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#4B5563',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Stats Container
  statsContainer: {
    marginTop: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dutyCheckBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statTextContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },

  // Custom Bottom Tab Bar
  customTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 4,
  },
  tabTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    marginTop: 4,
  },
});
