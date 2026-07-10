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
  Modal,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';
import { useState } from 'react';

export default function TokenDetailsScreen() {
  const router = useRouter();
  const [isSkipModalVisible, setSkipModalVisible] = useState(false);
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader
        title="Token Details"
        leftIcon="back"
        rightElement="icon"
        rightIconName="ellipsis-vertical"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Patient Summary Card */}
        <View style={styles.patientCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>JH</Text>
          </View>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>Jonathan Henderson</Text>
            <View style={styles.patientMetaRow}>
              <View style={styles.pidBadge}>
                <Text style={styles.pidText}>PID-8821</Text>
              </View>
              <Text style={styles.phoneText}>+1 (555) 012-3456</Text>
            </View>
          </View>
        </View>

        {/* Current Token Card */}
        <View style={styles.tokenCard}>
          <View style={styles.tokenCardHeader}>
            <Text style={styles.tokenCardTitle}>CURRENT TOKEN</Text>
            <View style={styles.inQueueBadge}>
              <View style={styles.inQueueDot} />
              <Text style={styles.inQueueText}>In Queue</Text>
            </View>
          </View>

          <View style={styles.tokenNumberRow}>
            <Text style={styles.tokenNumber}>GP-402</Text>
            <Text style={styles.estTimeText}>Est: 12 mins left</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Doctor</Text>
              <Text style={styles.detailValue}>Dr. Sarah Jenkins</Text>
            </View>
            <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.detailLabel}>Session</Text>
              <Text style={styles.detailValue}>Morning</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Booking Type</Text>
              <Text style={styles.detailValue}>Walk-in</Text>
            </View>
            <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: '#059669' }]}>Priority</Text>
            </View>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.progressContainer}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleCompleted}>
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextCompleted}>Check-in</Text>
          </View>

          <View style={styles.stepLineCompleted} />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircleActive}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>
            <Text style={styles.stepTextActive}>Waiting</Text>
          </View>

          <View style={styles.stepLinePending} />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepCirclePending}>
              <Text style={styles.stepNumberPending}>3</Text>
            </View>
            <Text style={styles.stepTextPending}>Consulting</Text>
          </View>
        </View>

        {/* Action Center */}
        <Text style={styles.actionCenterTitle}>ACTION CENTER</Text>

        <Pressable style={styles.btnPrimary}>
          <Ionicons name="play" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnPrimaryText}>Start Consultation</Text>
        </Pressable>

        <Pressable style={styles.btnSecondary}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#059669" style={{ marginRight: 8 }} />
          <Text style={styles.btnSecondaryText}>Complete Appointment</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable style={styles.btnTertiary} onPress={() => setSkipModalVisible(true)}>
            <Ionicons name="arrow-redo-outline" size={20} color="#475569" style={{ marginBottom: 4 }} />
            <Text style={styles.btnTertiaryText}>Skip</Text>
          </Pressable>
          <Pressable 
            style={[styles.btnTertiary, { borderColor: '#FECACA', backgroundColor: '#FEF2F2' }]}
            onPress={() => setCancelModalVisible(true)}
          >
            <Ionicons name="close-circle-outline" size={20} color="#DC2626" style={{ marginBottom: 4 }} />
            <Text style={[styles.btnTertiaryText, { color: '#DC2626' }]}>Cancel</Text>
          </Pressable>
        </View>

      </ScrollView>

      {/* Skip Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSkipModalVisible}
        onRequestClose={() => setSkipModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconBox}>
              <Ionicons name="arrow-redo" size={32} color="#D97706" />
            </View>
            
            <Text style={styles.modalTitle}>Skip Patient</Text>
            <Text style={styles.modalSubtitle}>
              How would you like to handle Jonathan Henderson (GP-402)?
            </Text>

            <View style={styles.modalActionStack}>
              <Pressable 
                style={styles.btnModalOption}
                onPress={() => setSkipModalVisible(false)}
              >
                <Ionicons name="time-outline" size={20} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.btnModalOptionText}>Call after 3-5 patients</Text>
              </Pressable>
              
              <Pressable 
                style={styles.btnModalOption}
                onPress={() => setSkipModalVisible(false)}
              >
                <Ionicons name="arrow-down-circle-outline" size={20} color="#D97706" style={{ marginRight: 8 }} />
                <Text style={styles.btnModalOptionText}>Send to end of queue</Text>
              </Pressable>

              <Pressable 
                style={styles.btnModalCancel}
                onPress={() => setSkipModalVisible(false)}
              >
                <Text style={styles.btnModalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isCancelModalVisible}
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>
            
            <Text style={styles.modalTitle}>Cancel Appointment?</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to cancel the appointment for Jonathan Henderson (GP-402)? This action cannot be undone.
            </Text>

            <View style={styles.modalActionRow}>
              <Pressable 
                style={styles.btnModalCancelRow}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.btnModalCancelRowText}>No, Keep</Text>
              </Pressable>
              
              <Pressable 
                style={styles.btnModalConfirmRow}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.btnModalConfirmRowText}>Yes, Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  // Patient Card
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  patientMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pidBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  pidText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  phoneText: {
    fontSize: 13,
    color: '#64748B',
  },

  // Token Card
  tokenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tokenCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tokenCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  inQueueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inQueueDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
  },
  inQueueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tokenNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  tokenNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#2563EB',
  },
  estTimeText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Progress Tracker
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  stepItem: {
    alignItems: 'center',
    width: 80,
  },
  stepCircleCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#BFDBFE',
    marginBottom: 8,
  },
  stepCirclePending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  stepNumberActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepNumberPending: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepTextCompleted: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  stepTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  stepTextPending: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  stepLineCompleted: {
    flex: 1,
    height: 2,
    backgroundColor: '#059669',
    marginHorizontal: -10,
    marginBottom: 20,
  },
  stepLinePending: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -10,
    marginBottom: 20,
  },

  // Action Center
  actionCenterTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 16,
  },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  btnPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnSecondary: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  btnSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnTertiary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  btnTertiaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  modalActionStack: {
    width: '100%',
  },
  btnModalOption: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnModalOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B45309',
  },
  btnModalCancel: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  btnModalCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btnModalCancelRow: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  btnModalCancelRowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  btnModalConfirmRow: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  btnModalConfirmRowText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
