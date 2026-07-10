import { SmartClinicLogo } from '@/components/ui/logo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SelectAccountTypeScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'individual' | 'clinic' | null>(null);

  const handleContinue = () => {
    if (selectedType === 'individual') {
      router.push('/doctor-info');
    } else if (selectedType === 'clinic') {
      router.push('/owner-info');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
          <View style={styles.progressDot} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <View style={styles.logoWrapper}>
             <SmartClinicLogo size={36} color="#2563EB" hideText />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Text style={[styles.brand, { color: '#2563EB', fontWeight: '800' }]}>
              CareQueue
            </Text>
            <Text style={[styles.brand, { color: '#111827', fontWeight: '400', marginLeft: 4 }]}>
              Clinic
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Select Account Type</Text>
        <Text style={styles.subtitle}>
          Choose the option that best describes your practice.{'\n'}
          You can always upgrade or add more later.
        </Text>

        <View style={styles.cardsContainer}>
          {/* Individual Doctor */}
          <Pressable
            style={[
              styles.card,
              styles.cardBlue,
              selectedType === 'individual' ? styles.cardSelectedBlue : null
            ]}
            onPress={() => setSelectedType('individual')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconCircleBlue}>
                <Ionicons name="person" size={20} color="#2563EB" />
              </View>
              <View style={[styles.radio, styles.radioBlue, selectedType === 'individual' ? styles.radioSelectedBlue : null]}>
                {selectedType === 'individual' && <View style={styles.radioInnerSelectedBlue} />}
              </View>
            </View>

            {/* Placeholder for Illustration */}
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="medkit" size={60} color="#DBEAFE" />
            </View>

            <Text style={styles.cardTitleBlue}>Individual Doctor</Text>
            <Text style={styles.cardSubtitle}>
              For doctors managing their own clinic and queue.
            </Text>

            <View style={styles.divider} />

            <View style={styles.featureList}>
              <FeatureItem text="One doctor" color="#2563EB" />
              <FeatureItem text="Single queue" color="#2563EB" />
              <FeatureItem text="Add staff later" color="#2563EB" />
            </View>
          </Pressable>

          {/* Clinic / Hospital */}
          <Pressable
            style={[
              styles.card,
              styles.cardGreen,
              selectedType === 'clinic' ? styles.cardSelectedGreen : null
            ]}
            onPress={() => setSelectedType('clinic')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconCircleGreen}>
                <Ionicons name="business" size={20} color="#16A34A" />
              </View>
              <View style={[styles.radio, styles.radioGreen, selectedType === 'clinic' ? styles.radioSelectedGreen : null]}>
                {selectedType === 'clinic' && <View style={styles.radioInnerSelectedGreen} />}
              </View>
            </View>

            {/* Placeholder for Illustration */}
            <View style={styles.illustrationPlaceholder}>
              <Ionicons name="business-outline" size={60} color="#DCFCE7" />
            </View>

            <Text style={styles.cardTitleGreen}>Clinic / Hospital</Text>
            <Text style={styles.cardSubtitle}>
              For clinics or hospitals with multiple doctors.
            </Text>

            <View style={styles.divider} />

            <View style={styles.featureList}>
              <FeatureItem text="Multiple doctors" color="#16A34A" />
              <FeatureItem text="Separate queue for each doctor" color="#16A34A" />
              <FeatureItem text="Manage receptionists & staff" color="#16A34A" />
              <FeatureItem text="Centralized management" color="#16A34A" />
            </View>
          </Pressable>
        </View>

        <View style={styles.securityNote}>
          <View style={styles.securityIconBox}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#2563EB" />
          </View>
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityTitle}>Secure & Reliable</Text>
            <Text style={styles.securitySubtitle}>
              Your data is encrypted and secure.{'\n'}
              We follow industry-leading security standards.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !selectedType && styles.buttonDisabled]}
          disabled={!selectedType}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name="checkmark-circle-outline" size={16} color={color} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
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
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressDot: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoWrapper: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  brand: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardBlue: {
    borderColor: '#BFDBFE', // Light blue
  },
  cardGreen: {
    borderColor: '#BBF7D0', // Light green
  },
  cardSelectedBlue: {
    borderColor: '#60A5FA', // Stronger blue
    backgroundColor: '#EFF6FF',
  },
  cardSelectedGreen: {
    borderColor: '#4ADE80', // Stronger green
    backgroundColor: '#F0FDF4',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBlue: {
    borderColor: '#60A5FA',
  },
  radioGreen: {
    borderColor: '#4ADE80',
  },
  radioInnerSelectedBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  radioInnerSelectedGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16A34A',
  },
  radioSelectedBlue: {
    borderColor: '#2563EB',
  },
  radioSelectedGreen: {
    borderColor: '#16A34A',
  },
  illustrationPlaceholder: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  cardTitleBlue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 6,
  },
  cardTitleGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  featureText: {
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
    marginTop: 1, // Align with icon visually
  },
  securityNote: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
    alignItems: 'center',
  },
  securityIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB', 
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  button: {
    height: 56,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
