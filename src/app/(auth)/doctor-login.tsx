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
import { useRouter } from 'expo-router';
import { SmartClinicLogo } from '@/components/ui/logo';
import { RemoteAPI } from '@/utils/api';
import { MockDB, Storage } from '@/utils/storage';

export default function DoctorLoginScreen() {
  const router = useRouter();

  const [roleType, setRoleType] = useState<'DOCTOR' | 'RECEPTIONIST'>('DOCTOR');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);

  const handleLogin = async () => {
    const cleanId = identifier.trim();
    if (!cleanId) {
      setError('Please enter your registered mobile number or email');
      setAccountNotFound(false);
      return;
    }

    if (loginMode === 'PASSWORD' && !password) {
      setError('Please enter your account password');
      setAccountNotFound(false);
      return;
    }

    // OTP mode: verify account existence before navigating to OTP screen
    if (loginMode === 'OTP') {
      const numericPhone = cleanId.replace(/\D/g, '');
      if (numericPhone.length !== 10) {
        setError('Please enter a valid 10-digit mobile number for OTP');
        setAccountNotFound(false);
        return;
      }

      setLoading(true);
      setError('');
      setAccountNotFound(false);

      try {
        const checkRes = await RemoteAPI.checkUser(numericPhone, roleType);
        let exists = checkRes.exists;

        if (!exists && !checkRes.mismatch) {
          const localUser = await MockDB.getUserByPhone(numericPhone, roleType);
          if (localUser) exists = true;
        }

        // STRICT RULE: If person does not have account, do not let them enter!
        if (!exists) {
          setAccountNotFound(true);
          setError(
            checkRes.mismatch
              ? checkRes.error || `This number is registered as a ${checkRes.actualRole} account.`
              : `No registered ${roleType === 'DOCTOR' ? 'Doctor or Clinic' : 'Staff'} account found for +91 ${numericPhone}. Please register your practice first.`
          );
          return;
        }

        router.push({
          pathname: '/otp',
          params: { phone: numericPhone, flow: 'doctor', role: roleType },
        });
      } catch {
        setError('Unable to verify account status. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError('');
    setAccountNotFound(false);

    try {
      // 1. Authenticate with backend
      let result = null;
      try {
        result = await RemoteAPI.doctorLogin(cleanId, password);
      } catch (err: any) {
        // Check if user is stored in local MockDB for offline fallback
        const localUser = await MockDB.getUserByPhone(cleanId, roleType);
        if (localUser) {
          result = {
            user: localUser,
            role: localUser.role,
            approvalStatus: localUser.status,
          };
        } else {
          // If 404 or not found, show account not found banner
          if (err.message && (err.message.includes('not found') || err.message.includes('register'))) {
            setAccountNotFound(true);
          }
          throw err;
        }
      }

      const userRole = (result.role || roleType).toUpperCase();
      const status = (result.approvalStatus || result.user?.status || 'APPROVED').toUpperCase();

      // Check account suspension
      if (status === 'SUSPENDED') {
        setError('Your practice account has been suspended by the platform administrator. Please contact support@carequeue.in');
        setLoading(false);
        return;
      }

      // Save user session
      const resolvedDoctorId = result.user?.doctorId || result.doctor?._id || result.receptionist?.authorizedByDoctorId || result.user?.clinicId || result.user?.id || null;
      const resolvedClinicName = result.doctor?.clinicName || result.user?.clinicName || (userRole === 'RECEPTIONIST' ? 'Care Clinic Desk' : 'Care Clinic');

      const userSession = {
        id: result.user?._id || result.user?.id || result.receptionist?.id || cleanId,
        phone: result.user?.phone || cleanId,
        email: result.user?.email || cleanId,
        role: userRole as any,
        status: status as any,
        name: result.user?.name || (userRole === 'RECEPTIONIST' ? 'Reception Staff' : 'Dr. Practitioner'),
        permissions: result.user?.permissions || result.receptionist?.permissions || [],
        clinicId: result.user?.clinicId || result.receptionist?.clinicId || null,
        clinicName: resolvedClinicName,
        doctorId: resolvedDoctorId,
      };

      await MockDB.addUser(userSession);
      await MockDB.setCurrentSession(userSession);
      await Storage.setItem('hasOnboarded', 'true');

      // 2. Status-aware routing
      if (userRole === 'DOCTOR' || userRole === 'CLINIC') {
        if (status === 'PENDING' || status === 'REJECTED') {
          router.replace('/(doctor)/pending-verification');
        } else {
          router.replace('/(doctor)/dashboard');
        }
      } else if (userRole === 'RECEPTIONIST' || userRole === 'STAFF') {
        router.replace('/(doctor)/dashboard');
      } else {
        router.replace('/(doctor)/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your phone/email and password.');
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
        {/* Top Navigation */}
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </Pressable>
          <View style={styles.portalPill}>
            <Ionicons name="medkit" size={13} color="#059669" />
            <Text style={styles.portalPillText}>PRACTITIONER COCKPIT</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Branding */}
          <View style={styles.brandRow}>
            <SmartClinicLogo size={46} color="#059669" hideText />
            <Text style={styles.brandTitle}>CareQueue</Text>
            <Text style={styles.brandSub}>Doctor, Clinic & Staff Console</Text>
          </View>

          <View style={styles.card}>
            {/* Role Type Selector Tabs */}
            <View style={styles.roleTabs}>
              <Pressable
                style={[styles.roleTab, roleType === 'DOCTOR' && styles.roleTabActive]}
                onPress={() => {
                  setError('');
                  setRoleType('DOCTOR');
                }}
              >
                <Ionicons
                  name="medical"
                  size={15}
                  color={roleType === 'DOCTOR' ? '#059669' : '#64748B'}
                />
                <Text style={[styles.roleTabText, roleType === 'DOCTOR' && styles.roleTabTextActive]}>
                  Doctor
                </Text>
              </Pressable>

              <Pressable
                style={[styles.roleTab, roleType === 'RECEPTIONIST' && styles.roleTabActive]}
                onPress={() => {
                  setError('');
                  setRoleType('RECEPTIONIST');
                }}
              >
                <Ionicons
                  name="people"
                  size={15}
                  color={roleType === 'RECEPTIONIST' ? '#059669' : '#64748B'}
                />
                <Text style={[styles.roleTabText, roleType === 'RECEPTIONIST' && styles.roleTabTextActive]}>
                  Receptionist / Desk
                </Text>
              </Pressable>
            </View>

            <Text style={styles.cardHeader}>
              {roleType === 'DOCTOR' ? 'Practitioner Sign In' : 'Front-Desk Staff Sign In'}
            </Text>
            <Text style={styles.cardSub}>
              {roleType === 'DOCTOR'
                ? 'Access your consultation queue, call patients, and manage your practice.'
                : 'Sign in with your authorized mobile number to issue tokens and manage walk-ins.'}
            </Text>

            {accountNotFound ? (
              <View style={styles.notFoundCard}>
                <View style={styles.notFoundHeader}>
                  <View style={styles.notFoundIconCircle}>
                    <Ionicons name="medical" size={20} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notFoundTitle}>Account Not Registered</Text>
                    <Text style={styles.notFoundDesc}>
                      {roleType === 'DOCTOR'
                        ? 'No active Doctor account found with this credential.'
                        : 'No authorized front-desk staff account found. Please ask your doctor to authorize you.'}
                    </Text>
                  </View>
                </View>

                {roleType === 'DOCTOR' && (
                  <Pressable
                    style={styles.registerNowBtn}
                    onPress={() => router.push('/register')}
                  >
                    <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.registerNowBtnText}>Register Practice Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                  </Pressable>
                )}
              </View>
            ) : error !== '' ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#DC2626" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Identifier (Phone or Email) */}
            <Text style={styles.label}>REGISTERED MOBILE OR EMAIL</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mobile number or email"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                value={identifier}
                onChangeText={(t) => {
                  setError('');
                  setIdentifier(t);
                }}
              />
            </View>

            {/* Mode Switcher: Password vs OTP */}
            <View style={styles.modeToggleRow}>
              <Pressable
                style={[styles.modeToggleBtn, loginMode === 'PASSWORD' && styles.modeToggleBtnActive]}
                onPress={() => setLoginMode('PASSWORD')}
              >
                <Text style={[styles.modeToggleText, loginMode === 'PASSWORD' && styles.modeToggleTextActive]}>
                  Password Sign-in
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeToggleBtn, loginMode === 'OTP' && styles.modeToggleBtnActive]}
                onPress={() => setLoginMode('OTP')}
              >
                <Text style={[styles.modeToggleText, loginMode === 'OTP' && styles.modeToggleTextActive]}>
                  Mobile OTP
                </Text>
              </Pressable>
            </View>

            {/* Password input (if in password mode) */}
            {loginMode === 'PASSWORD' && (
              <>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter account password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(t) => {
                      setError('');
                      setPassword(t);
                    }}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </Pressable>
                </View>
              </>
            )}

            {/* Submit Button */}
            <Pressable
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
              disabled={loading}
              onPress={handleLogin}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitBtnText}>
                    {loginMode === 'OTP' ? 'Send Verification OTP' : 'Sign In to Dashboard'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </Pressable>

            {/* Register New Practice / Clinic */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>NEW PRACTITIONER?</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable
              style={styles.registerBtn}
              onPress={() => router.push('/register')}
            >
              <Ionicons name="medical-outline" size={18} color="#059669" />
              <Text style={styles.registerBtnText}>Register as Doctor</Text>
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
    backgroundColor: '#ECFDF5',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  portalPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brandRow: {
    alignItems: 'center',
    marginVertical: 14,
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
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  roleTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#059669',
    fontWeight: '700',
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
    marginBottom: 18,
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
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    height: '100%',
  },
  modeToggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 14,
  },
  modeToggleBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  modeToggleBtnActive: {
    backgroundColor: '#ECFDF5',
  },
  modeToggleText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  modeToggleTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#059669',
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  registerBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  notFoundCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 14,
    marginBottom: 16,
  },
  notFoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
  registerNowBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#DC2626',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  registerNowBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
