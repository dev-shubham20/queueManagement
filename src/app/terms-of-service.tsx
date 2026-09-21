import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Line, Polyline, Path, Rect } from 'react-native-svg';

const ArrowLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const DocumentTextIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <Polyline points="14 2 14 8 20 8" />
    <Line x1="16" y1="13" x2="8" y2="13" />
    <Line x1="16" y1="17" x2="8" y2="17" />
    <Polyline points="10 9 9 9 8 9" />
  </Svg>
);

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Hero Badge */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <DocumentTextIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Terms of Service</Text>
            <Text style={styles.heroSubtitle}>Effective Date: September 2026</Text>
          </View>
        </View>

        <Text style={styles.introParagraph}>
          Welcome to CareQueue. By accessing or using our queue management platform, mobile application, or front-desk receptionist modules, you agree to be bound by these Terms of Service.
        </Text>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Platform Purpose & Scope</Text>
          <Text style={styles.bodyText}>
            CareQueue provides digital queuing, token allocation, estimated wait-time tracking, and clinic workflow coordination between patients, receptionists, and licensed medical practitioners.
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>CareQueue is an operational queue platform and does not itself provide medical consultations or diagnostic prescriptions.</Text>
          </View>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Token Booking & Queue Rules</Text>
          <Text style={styles.bodyText}>
            To maintain equitable clinic workflow, users must adhere to the following queue policies:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Single Active Token Rule: </Text>
              A patient may hold only one active token per practitioner queue session at any given time.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Daily Capacity Limits: </Text>
              Practitioners establish daily maximum patient capacities. Once reached, regular token issuance closes automatically for that session.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Emergency Tokens (EM-XX): </Text>
              Emergency tokens with priority 0 are strictly reserved for urgent medical conditions and require clinical or receptionist validation.
            </Text>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. User Obligations & Conduct</Text>
          <Text style={styles.bodyText}>
            When utilizing CareQueue, you agree to:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Provide accurate phone number and identity information during registration.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Promptly cancel tokens if you cannot attend, allowing waiting patients to advance.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Refrain from attempting unauthorized API access or bypassing clinic authentication safeguards.</Text>
          </View>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Practitioner & Clinic Responsibilities</Text>
          <Text style={styles.bodyText}>
            Medical practitioners and clinic administrators represent that:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>They maintain active, valid medical licenses and regulatory approvals in their respective jurisdiction.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Staff accounts (receptionists/assistants) are provisioned with role-appropriate permissions.</Text>
          </View>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Estimated Wait Times Disclaimer</Text>
          <Text style={styles.bodyText}>
            Wait-time estimates provided by CareQueue are dynamic approximations based on average consultation durations and live queue velocity. Actual consultation lengths may vary depending on patient clinical complexity and unforeseen emergency interventions.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Termination & Suspension</Text>
          <Text style={styles.bodyText}>
            We reserve the right to suspend or terminate accounts that violate clinic policies, engage in fraudulent bookings, or attempt to compromise platform security.
          </Text>
        </View>

        {/* Section 7 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>7. Contact Us</Text>
          <Text style={styles.bodyText}>
            For questions or inquiries regarding these Terms of Service, please reach out to:
          </Text>
          <Text style={[styles.bodyText, { color: '#0052FF', fontWeight: '700', marginTop: 6 }]}>
            legal@carequeue.in
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 2,
    fontWeight: '600',
  },
  introParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    marginBottom: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  bulletItem: {
    flexDirection: 'row',
    marginTop: 8,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 16,
    lineHeight: 20,
    color: '#0052FF',
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#475569',
  },
  boldText: {
    fontWeight: '700',
    color: '#1E293B',
  },
});
