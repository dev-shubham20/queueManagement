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
import BottomTabBar from '../components/BottomTabBar';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="medkit" size={24} color="#0052CC" />
          <Text style={styles.headerTitle}>Queue Registration</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Confetti Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.confettiArea}>
            {/* We simulate the floating dots from the mockup with absolutely positioned views */}
            <View style={[styles.dot, { top: 10, left: '30%', backgroundColor: '#60A5FA', width: 4, height: 4 }]} />
            <View style={[styles.dot, { top: 30, left: '45%', backgroundColor: '#A78BFA', width: 6, height: 6 }]} />
            <View style={[styles.dot, { top: 20, left: '60%', backgroundColor: '#34D399', width: 5, height: 5 }]} />
            <View style={[styles.dot, { top: 40, left: '55%', backgroundColor: '#3B82F6', width: 8, height: 8 }]} />
            <View style={[styles.dot, { top: 50, left: '25%', backgroundColor: '#34D399', width: 6, height: 6 }]} />
            <View style={[styles.dot, { top: 70, left: '40%', backgroundColor: '#34D399', width: 7, height: 7 }]} />
            <View style={[styles.dot, { top: 60, left: '70%', backgroundColor: '#A78BFA', width: 5, height: 5 }]} />
            <View style={[styles.dot, { top: 80, left: '60%', backgroundColor: '#3B82F6', width: 6, height: 6 }]} />
            <View style={[styles.dot, { top: 110, left: '50%', backgroundColor: '#3B82F6', width: 5, height: 5 }]} />
            <View style={[styles.dot, { top: 140, left: '52%', backgroundColor: '#60A5FA', width: 4, height: 4 }]} />
            <View style={[styles.dot, { top: 90, left: '75%', backgroundColor: '#60A5FA', width: 4, height: 4 }]} />
          </View>

          <Text style={styles.successTitle}>Registration{'\n'}Successful!</Text>
          <Text style={styles.successSubtitle}>
            Your practice profile has been created. You can now start managing your medical team and live patient queues with Clinical Flow Logic.
          </Text>
        </View>

        {/* Next Steps Card */}
        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsHeader}>NEXT STEPS</Text>
          
          <Pressable style={styles.stepItem} onPress={() => router.push('/queue-settings')}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Set up your first queue</Text>
              <Text style={styles.stepDesc}>Define departments and estimated wait times.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <Pressable style={styles.stepItem} onPress={() => router.push('/staff-management')}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Invite staff members</Text>
              <Text style={styles.stepDesc}>Add doctors and admin roles to your clinic.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <Pressable style={styles.stepItem} onPress={() => router.push('/dashboard')}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Start accepting tokens</Text>
              <Text style={styles.stepDesc}>Begin issuing patient tokens for live tracking.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Dashboard Button */}
        <Pressable style={styles.button} onPress={() => router.push('/dashboard')}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>
      </ScrollView>

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Slightly cooler off-white background
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
    color: '#0052CC', // Deep blue
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // Illustration Area
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  confettiArea: {
    width: '100%',
    height: 160,
    position: 'relative',
    marginBottom: -10,
  },
  dot: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  // Next Steps Card
  nextStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 30,
  },
  nextStepsHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0052CC',
    letterSpacing: 1,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: '500',
    color: '#94A3B8',
    width: 24,
  },
  stepTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },

  // Button
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
