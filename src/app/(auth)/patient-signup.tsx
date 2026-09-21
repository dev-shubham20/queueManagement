import React, { useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RemoteAPI } from '@/utils/api';
import { MockDB, Storage } from '@/utils/storage';

export default function PatientSignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState(params.phone || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Try remote API registration
      let remoteUser = null;
      try {
        const res = await RemoteAPI.patientRegister({
          name: name.trim(),
          phone: cleanPhone,
          age: age ? parseInt(age, 10) : 30,
          gender,
          condition: condition.trim() || 'General Consultation',
        });
        remoteUser = res.user;
      } catch (err: any) {
        console.warn('Remote patient register fallback:', err.message);
      }

      // 2. Persist in local session
      const patientSession = {
        name: name.trim(),
        phone: cleanPhone,
        role: 'PATIENT' as const,
        status: 'APPROVED' as const,
      };

      await MockDB.addUser(patientSession);
      await MockDB.setCurrentSession(patientSession);
      await Storage.setItem('hasOnboarded', 'true');

      // 3. Navigate directly to Patient Experience
      router.replace('/(patient)/(tabs)/home');
    } catch {
      setError('Could not complete registration. Please try again.');
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
            <Ionicons name="person-add" size={12} color="#4F46E5" />
            <Text style={styles.portalPillText}>NEW PATIENT REGISTRATION</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerArea}>
            <Text style={styles.title}>Create Patient Account</Text>
            <Text style={styles.subtitle}>
              Fill in your details once to receive real-time queue tokens and clinic prescriptions.
            </Text>
          </View>

          <View style={styles.card}>
            {error !== '' && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Full Name */}
            <Text style={styles.label}>FULL NAME *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={(text) => {
                  setError('');
                  setName(text);
                }}
              />
            </View>

            {/* Mobile Number */}
            <Text style={styles.label}>MOBILE NUMBER *</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.prefixText}>🇮🇳 +91</Text>
              <TextInput
                style={styles.input}
                placeholder="10-digit mobile number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={(text) => {
                  setError('');
                  setPhone(text.replace(/\D/g, ''));
                }}
              />
            </View>

            {/* Age & Gender */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>AGE</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 28"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={3}
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
              </View>

              <View style={{ flex: 1.5 }}>
                <Text style={styles.label}>GENDER</Text>
                <View style={styles.genderRow}>
                  {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                    <Pressable
                      key={g}
                      style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                        {g === 'MALE' ? 'M' : g === 'FEMALE' ? 'F' : 'O'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            {/* Medical condition notes */}
            <Text style={styles.label}>PRIMARY CONCERN / REASON FOR VISIT</Text>
            <View style={[styles.inputWrapper, { height: 64, alignItems: 'flex-start', paddingTop: 8 }]}>
              <TextInput
                style={[styles.input, { textAlignVertical: 'top' }]}
                placeholder="e.g. Fever, Consultation, Routine checkup"
                placeholderTextColor="#94A3B8"
                value={condition}
                onChangeText={setCondition}
                multiline
              />
            </View>

            {/* Submit Button */}
            <Pressable
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              disabled={loading}
              onPress={handleRegister}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>Create Account & Continue</Text>
                  <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </Pressable>

            {/* Sign in prompt */}
            <View style={styles.signinPrompt}>
              <Text style={styles.signinPromptText}>Already have an account?</Text>
              <Pressable onPress={() => router.push('/patient-login')}>
                <Text style={styles.signinPromptLink}> Sign In</Text>
              </Pressable>
            </View>
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
  headerArea: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
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
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  prefixText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
    height: 50,
    marginBottom: 16,
  },
  genderBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnActive: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  genderBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  genderBtnTextActive: {
    color: '#4F46E5',
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signinPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  signinPromptText: {
    fontSize: 13,
    color: '#64748B',
  },
  signinPromptLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F46E5',
  },
});
