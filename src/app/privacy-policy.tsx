import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Line, Polyline, Path, Rect, Circle } from 'react-native-svg';

const ArrowLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const ShieldCheckIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Badge */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <ShieldCheckIcon />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Your Privacy Matters</Text>
            <Text style={styles.heroSubtitle}>Last updated: September 2026</Text>
          </View>
        </View>

        <Text style={styles.introParagraph}>
          At CareQueue, we are committed to safeguarding the privacy, confidentiality, and integrity of your medical queue and personal information in accordance with Indian healthcare data standards and applicable privacy regulations.
        </Text>

        {/* Section 1 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.bodyText}>
            We only collect essential data required to facilitate real-time clinic queue management:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Patient Identity Details: </Text>
              Full name, mobile number, age, and gender provided during walk-in or digital registration.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Queue & Token Data: </Text>
              Token numbers (regular TK-XX, emergency EM-XX), doctor association, queue position, estimated wait times, and consultation timestamps.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Provider & Staff Credentials: </Text>
              Doctor/receptionist authentication data, clinic name, medical registration IDs, and role permissions.
            </Text>
          </View>
        </View>

        {/* Section 2 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.bodyText}>
            Your data is strictly utilized for the following healthcare operational purposes:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Generating and managing authentic clinic queue tokens.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Providing real-time WebSocket notifications regarding queue progress, delays, and doctor call-outs.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Enforcing clinic isolation and doctor patient scope security (zero cross-clinic leakage).</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>Optimizing clinic daily capacity and minimizing patient waiting times.</Text>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Data Protection & Security</Text>
          <Text style={styles.bodyText}>
            We enforce robust technical and operational measures to protect your healthcare information:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Encryption: </Text>
              All traffic between your device and CareQueue servers is encrypted using industry-standard TLS 1.3/HTTPS.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Role-Based Access Control (RBAC): </Text>
              Patients, Receptionists, Doctors, and Administrators have strictly segregated permission boundaries.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>
              <Text style={styles.boldText}>Sanitized Public Listings: </Text>
              Sensitive KYC details (Aadhaar, PAN, internal medical records) are never exposed to public or patient-facing API listings.
            </Text>
          </View>
        </View>

        {/* Section 4 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Data Sharing & Third Parties</Text>
          <Text style={styles.bodyText}>
            We do <Text style={styles.boldText}>NOT</Text> sell, rent, or trade your personal or health data. Data is only accessible to:
          </Text>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>The treating doctor and authorized front-desk clinic staff for consultation management.</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>SMS/OTP delivery services solely for authentication and queue alerts.</Text>
          </View>
        </View>

        {/* Section 5 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>5. Your Rights & Control</Text>
          <Text style={styles.bodyText}>
            You have the right to request review of your registered details, cancel active queue tokens at any time, or request profile data rectification through your clinic administration or our Help Center.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>6. Contact Privacy Officer</Text>
          <Text style={styles.bodyText}>
            If you have questions about this Privacy Policy or your healthcare records, please contact us at:
          </Text>
          <Text style={[styles.bodyText, { color: '#0052FF', fontWeight: '700', marginTop: 6 }]}>
            privacy@carequeue.in
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
