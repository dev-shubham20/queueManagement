import { SmartClinicLogo } from '@/components/ui/logo';
import { Storage, MockDB } from '@/utils/storage';
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
} from 'react-native';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const { phone } = useLocalSearchParams();

  const formattedPhone =
    typeof phone === 'string'
      ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`
      : '+91 XXXXX XXXXX';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
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

    try {
      const user = await MockDB.getUserByPhone(phone as string);

      if (!user) {
        // New user goes to role selection
        router.replace({ pathname: '/(auth)/role-selection', params: { phone } });
      } else {
        // Existing user routing
        await MockDB.setCurrentSession(user);
        
        if (user.role === 'DOCTOR') {
          if (user.status === 'PENDING') {
            router.replace('/(doctor)/pending-verification');
          } else {
            router.replace('/(doctor)/dashboard');
          }
        } else if (user.role === 'STAFF') {
          // Staff also uses the doctor dashboard, but RBAC hides things
          router.replace('/(doctor)/dashboard');
        } else if (user.role === 'PATIENT') {
          router.replace('/(patient)/(tabs)/home');
        }
      }
    } catch {
      setError('OTP verification failed. Please try again.');
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

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
});