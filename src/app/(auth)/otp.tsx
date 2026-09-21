import { SmartClinicLogo } from '@/components/ui/logo';
import { Storage, MockDB } from '@/utils/storage';
import { RemoteAPI } from '@/utils/api';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
} from 'react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone, flow, role } = useLocalSearchParams();

  const formattedPhone =
    typeof phone === 'string'
      ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
      : '+91 XXXXX XXXXX';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendTimer((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '');
    const next = [...otp];
    next[index] = digit.slice(-1);

    setOtp(next);

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      otp[index] === '' &&
      index > 0
    ) {
      const previousIndex = index - 1;
      inputRefs[previousIndex].current?.focus();

      const next = [...otp];
      next[previousIndex] = '';
      setOtp(next);
      setActiveIndex(previousIndex);
    }
  };

  const handleResend = () => {
    if (resendTimer !== 0) {
      return;
    }

    setResendTimer(30);
    setError('A new code has been sent to your number.');
  };

  const verifyOTP = async () => {
    const code = otp.join('');

    if (code.length !== 4) {
      setError('Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    const cleanPhone = (phone as string || '').replace(/\D/g, '');

    try {
      // ===== 1. PATIENT FLOW =====
      if (flow === 'patient') {
        let patientUser = null;
        let loginErrorMessage = '';

        try {
          const res = await RemoteAPI.patientLogin(cleanPhone, code);
          patientUser = res.user;
        } catch (err: any) {
          loginErrorMessage = err.message || '';
          // Fallback check in local DB
          const localMatch = await MockDB.getUserByPhone(cleanPhone, 'PATIENT');
          if (localMatch) {
            patientUser = localMatch;
          }
        }

        // STRICT RULE: If person does NOT have an account, do not let them enter!
        if (!patientUser) {
          setAccountNotFound(true);
          setError(loginErrorMessage || `No patient account found for +91 ${cleanPhone}. Please create an account to get started.`);
          setLoading(false);
          return;
        }

        const sessionUser = {
          phone: cleanPhone,
          role: 'PATIENT' as const,
          status: 'APPROVED' as const,
          name: patientUser?.name || 'Care Patient',
        };

        await MockDB.addUser(sessionUser);
        await MockDB.setCurrentSession(sessionUser);
        await Storage.setItem('hasOnboarded', 'true');
        router.replace('/(patient)/(tabs)/home');
        return;
      }

      // ===== 2. DOCTOR / STAFF FLOW =====
      if (flow === 'doctor') {
        let doctorResult = null;
        try {
          doctorResult = await RemoteAPI.doctorLogin(cleanPhone, undefined, true);
        } catch (err: any) {
          const localMatch = await MockDB.getUserByPhone(cleanPhone, (role as string) || 'DOCTOR');
          if (localMatch) {
            doctorResult = {
              user: localMatch,
              role: localMatch.role,
              approvalStatus: localMatch.status,
            };
          } else {
            setAccountNotFound(true);
            setError(err.message || 'No practitioner account found for this mobile number. Please register your practice first.');
            setLoading(false);
            return;
          }
        }

        const userRole = (doctorResult.role || role || 'DOCTOR').toUpperCase();
        const status = (doctorResult.approvalStatus || doctorResult.user?.status || 'APPROVED').toUpperCase();

        if (status === 'SUSPENDED') {
          setError('This account has been suspended by the administrator.');
          setLoading(false);
          return;
        }

        const sessionUser = {
          phone: cleanPhone,
          role: userRole as any,
          status: status as any,
          name: doctorResult.user?.name || (userRole === 'RECEPTIONIST' ? 'Staff Member' : 'Dr. Practitioner'),
          permissions: doctorResult.user?.permissions || [],
        };

        await MockDB.addUser(sessionUser);
        await MockDB.setCurrentSession(sessionUser);
        await Storage.setItem('hasOnboarded', 'true');

        if (userRole === 'DOCTOR' || userRole === 'CLINIC') {
          if (status === 'PENDING' || status === 'REJECTED') {
            router.replace('/(doctor)/pending-verification');
          } else {
            router.replace('/(doctor)/dashboard');
          }
        } else {
          router.replace('/(doctor)/dashboard');
        }
        return;
      }

      // ===== 3. GENERAL FALLBACK FLOW =====
      const user = await MockDB.getUserByPhone(cleanPhone);
      if (!user) {
        setAccountNotFound(true);
        setError('No account found for this mobile number. Please choose your portal and sign up.');
        setLoading(false);
        return;
      } else {
        await MockDB.setCurrentSession(user);
        if (user.role === 'SUPER_ADMIN') {
          Linking.openURL('https://queuemanagement-api.onrender.com/superadmin');
          router.replace('/(patient)/(tabs)/home');
        } else if (user.role === 'DOCTOR' || user.role === 'CLINIC') {
          if (user.status === 'PENDING' || user.status === 'REJECTED') {
            router.replace('/(doctor)/pending-verification');
          } else {
            router.replace('/(doctor)/dashboard');
          }
        } else if (user.role === 'RECEPTIONIST' || user.role === 'STAFF') {
          router.replace('/(doctor)/dashboard');
        } else {
          router.replace('/(patient)/(tabs)/home');
        }
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const timerLabel = resendTimer
    ? `Resend in 00:${String(resendTimer).padStart(2, '0')}`
    : 'Resend Code';

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.backgroundLayer}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons
                  name="arrow-back"
                  size={22}
                  color="#1E293B"
                />
              </Pressable>

              <View style={styles.brandRow}>
                <View style={styles.logoBox}>
                  <SmartClinicLogo hideText size={22} color="#fff" />
                </View>
                <Text style={styles.brandText}>CareQueue</Text>
              </View>
            </View>

            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>
              Enter the 4-digit code we just sent to
              <Text style={styles.phoneText}> {formattedPhone}</Text>
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={[
                    styles.otpInput,
                    activeIndex === index && styles.activeInput,
                  ]}
                  value={digit}
                  maxLength={1}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  textAlign="center"
                  onFocus={() => setActiveIndex(index)}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  selectionColor="#2563EB"
                />
              ))}
            </View>

            <Text style={styles.captionText}>
              {resendTimer === 0
                ? 'Need a new code? Tap resend.'
                : `Waiting to resend code...`}
            </Text>

            {accountNotFound ? (
              <View style={styles.notFoundCard}>
                <View style={styles.notFoundHeader}>
                  <Ionicons name="alert-circle" size={20} color="#DC2626" />
                  <Text style={styles.notFoundTitle}>Account Not Found</Text>
                </View>
                <Text style={styles.notFoundMessage}>
                  {error || 'No registered account found with this mobile number.'}
                </Text>
                <Pressable
                  style={styles.createAccountBtn}
                  onPress={() => {
                    if (flow === 'patient') {
                      router.replace({ pathname: '/patient-signup', params: { phone } });
                    } else if (flow === 'doctor') {
                      router.replace('/register');
                    } else {
                      router.replace('/role-selection');
                    }
                  }}
                >
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                  <Text style={styles.createAccountBtnText}>
                    {flow === 'patient'
                      ? 'Create Patient Account Now'
                      : flow === 'doctor'
                      ? 'Register Practice Now'
                      : 'Choose Portal & Sign Up'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            ) : error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            {!accountNotFound && (
              <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={verifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Verify & Continue</Text>
                    <Ionicons
                      name="arrow-forward"
                      color="#fff"
                      size={18}
                      style={styles.buttonIcon}
                    />
                  </>
                )}
              </Pressable>
            )}

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't get the code?</Text>
              <Pressable
                onPress={handleResend}
                disabled={resendTimer !== 0}
              >
                <Text
                  style={[
                    styles.resendLink,
                    resendTimer !== 0 && styles.resendLinkDisabled,
                  ]}
                >
                  {timerLabel}
                </Text>
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Need a hand?</Text>
              <Text style={styles.infoText}>
                Check your network or try again in a few moments. If the
                message still doesn’t arrive, use a different number.
              </Text>
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
    backgroundColor: '#EFF6FF',
  },

  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },

  circleOne: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
  },

  circleTwo: {
    position: 'absolute',
    top: 120,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
  },

  safeArea: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 36,
    paddingTop: 18,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#2563EB',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
  },

  brandText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },

  phoneText: {
    fontWeight: '600',
    color: '#0F172A',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  
  otpInput: {
    padding: 16,
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#F8FAFC',
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlignVertical: 'center',
  },

  activeInput: {
    borderColor: '#2563EB',
    backgroundColor: '#EEF2FF',
  },

  captionText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginBottom: 18,
  },

  error: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '700',
  },

  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonDisabled: {
    backgroundColor: '#93C5FD',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  buttonIcon: {
    marginLeft: 10,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 14,
  },

  resendText: {
    color: '#64748B',
    fontSize: 14,
  },

  resendLink: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  resendLinkDisabled: {
    color: '#94A3B8',
  },

  infoCard: {
    marginTop: 10,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  notFoundCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    padding: 16,
    marginBottom: 16,
  },
  notFoundHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  notFoundTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
  },
  notFoundMessage: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 14,
  },
  createAccountBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DC2626',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  createAccountBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});