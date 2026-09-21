import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SmartClinicLogo } from '@/components/ui/logo';
import { Storage, MockDB } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';

export default function PatientLoginScreen() {
  const router = useRouter();
  const phoneInputRef = useRef<TextInput>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);

  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      setAccountNotFound(false);
      return;
    }

    setLoading(true);
    setError('');
    setAccountNotFound(false);

    try {
      // 1. Verify user existence on backend
      const checkRes = await RemoteAPI.checkUser(cleanPhone, 'PATIENT');

      let exists = checkRes.exists;
      if (!exists && !checkRes.mismatch) {
        // Check local MockDB for offline support
        const localUser = await MockDB.getUserByPhone(cleanPhone, 'PATIENT');
        if (localUser) {
          exists = true;
        }
      }

      // If user does NOT have an existing account:
      // STRICT RULE: Do not make him enter in the app, show prompt to create account!
      if (!exists) {
        setAccountNotFound(true);
        setError(
          checkRes.mismatch
            ? checkRes.error || `This number is registered as a ${checkRes.actualRole} account.`
            : `No patient account found for +91 ${cleanPhone}. Please create an account to get started.`
        );
        return;
      }

      await Storage.setItem('hasOnboarded', 'true');
      router.push({
        pathname: '/otp',
        params: { phone: cleanPhone, flow: 'patient' },
      });
    } catch {
      setError('Unable to verify account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </Pressable>
          <View style={styles.portalPill}>
            <Ionicons name="person" size={12} color="#4F46E5" />
            <Text style={styles.portalPillText}>PATIENT ACCESS</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand & Title */}
          <View style={styles.brandRow}>
            <SmartClinicLogo size={46} color="#4F46E5" hideText />
            <Text style={styles.brandTitle}>CareQueue</Text>
            <Text style={styles.brandSub}>Patient Health Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardHeader}>Sign In as Patient</Text>
            <Text style={styles.cardSub}>
              Enter your mobile number to view your active tokens and join clinic waitlists.
            </Text>

            {accountNotFound ? (
              <View style={styles.notFoundCard}>
                <View style={styles.notFoundHeader}>
                  <View style={styles.notFoundIconCircle}>
                    <Ionicons name="alert-circle" size={22} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notFoundTitle}>No Account Found</Text>
                    <Text style={styles.notFoundDesc}>
                      There is no active patient profile registered for <Text style={styles.notFoundPhone}>+91 {phone}</Text>.
                    </Text>
                  </View>
                </View>

                <Pressable
                  style={styles.createNowBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/patient-signup',
                      params: { phone },
                    })
                  }
                >
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                  <Text style={styles.createNowBtnText}>Create Patient Account Now</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : error !== '' ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>MOBILE NUMBER</Text>
            <Pressable
              style={[styles.inputRow, focused && styles.inputRowFocused]}
              onPress={() => phoneInputRef.current?.focus()}
            >
              <View style={styles.prefixBox}>
                <Text style={styles.prefixText}>🇮🇳 +91</Text>
                <Ionicons name="chevron-down" size={14} color="#64748B" style={{ marginLeft: 2 }} />
              </View>
              <TextInput
                ref={phoneInputRef}
                style={styles.input}
                value={phone}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChangeText={(text) => {
                  setError('');
                  setPhone(text.replace(/\D/g, ''));
                }}
              />
            </Pressable>

            <Pressable
              style={[
                styles.submitBtn,
                (phone.length !== 10 || loading) && styles.submitBtnDisabled,
              ]}
              disabled={phone.length !== 10 || loading}
              onPress={handleSendOTP}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Send Verification Code</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </Pressable>

            {/* Privacy note */}
            <View style={styles.secureNote}>
              <Ionicons name="lock-closed" size={13} color="#64748B" />
              <Text style={styles.secureNoteText}>Instant 4-digit code sent via SMS</Text>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>NEW PATIENT?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link to Patient Sign Up */}
            <Pressable
              style={styles.signupBtn}
              onPress={() => router.push('/patient-signup')}
            >
              <Ionicons name="person-add-outline" size={18} color="#4F46E5" />
              <Text style={styles.signupBtnText}>Create a New Patient Account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  portalPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandRow: {
    alignItems: 'center',
    marginVertical: 16,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  brandSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  inputRowFocused: {
    borderColor: '#4F46E5',
    backgroundColor: '#FFFFFF',
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    paddingRight: 10,
    marginRight: 10,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    height: '100%',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
    marginBottom: 18,
  },
  secureNoteText: {
    fontSize: 12,
    color: '#64748B',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  signupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E7FF',
    backgroundColor: '#EEF2FF',
  },
  signupBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  notFoundCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 14,
    marginBottom: 18,
  },
  notFoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  notFoundIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  notFoundDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 16,
  },
  notFoundPhone: {
    fontWeight: '700',
    color: '#991B1B',
  },
  createNowBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DC2626',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  createNowBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
