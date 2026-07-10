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

export default function PendingVerificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="document-text" size={24} color="#0052CC" />
          <Text style={styles.headerTitle}>Verification Pending</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.iconArea}>
             <Ionicons name="time" size={80} color="#F59E0B" />
          </View>

          <Text style={styles.title}>Under Review</Text>
          <Text style={styles.subtitle}>
            Your registration details and documents have been submitted successfully. A super admin is currently verifying your clinic's information. Once verified, you will be fully onboarded.
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#0052CC" style={{ marginRight: 12 }} />
          <Text style={styles.infoText}>
            This process typically takes 24-48 hours. You will receive an email notification once your account is approved.
          </Text>
        </View>

        {/* Action Button */}
        <Pressable style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Return to Home</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>

        {/* Development Only: Auto Approve */}
        {process.env.NODE_ENV === 'development' && (
          <Pressable 
            style={[styles.button, { backgroundColor: '#10B981', marginTop: 16 }]} 
            onPress={async () => {
              const { MockDB } = await import('@/utils/storage');
              const session = await MockDB.getCurrentSession();
              if (session) {
                await MockDB.updateUserStatus(session.phone, 'APPROVED');
                const updatedSession = { ...session, status: 'APPROVED' as const };
                await MockDB.setCurrentSession(updatedSession);
                router.replace('/(doctor)/dashboard');
              }
            }}
          >
            <Text style={styles.buttonText}>Auto-Approve (Dev Only)</Text>
            <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </Pressable>
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
    paddingBottom: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0052CC',
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  iconArea: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 40,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  button: {
    height: 56,
    backgroundColor: '#0052CC',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0052CC',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
