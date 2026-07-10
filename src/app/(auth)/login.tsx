import { SmartClinicLogo } from '@/components/ui/logo';
import { Storage } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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

export default function LoginScreen() {
  const router = useRouter();

  const phoneInputRef = useRef<TextInput>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    const value = phone.replace(/\D/g, '');

    if (value.length !== 10) {
      setError('Please enter a valid 10 digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await Storage.setItem('hasOnboarded', 'true');
      router.replace(`/otp?phone=${encodeURIComponent(value)}`);
    } catch (e) {
      setError('Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Elements */}
      <View style={styles.blueBlob} />
      <View style={styles.dotsPattern} />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header & Branding */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <SmartClinicLogo
              size={56}
              color="#2563EB"
              hideText
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <Text style={[styles.brand, { color: '#2563EB', fontWeight: '800' }]}>
                CareQueue
              </Text>
              <Text style={[styles.brand, { color: '#111827', fontWeight: '400', marginLeft: 6 }]}>
                Clinic
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 30 }}>
              Smart Clinic Queue Management
            </Text>
          </View>

          {/* Welcome Text */}
          <Text style={styles.title}>
            Welcome Back!
          </Text>

          <Text style={styles.subtitle}>
            Enter your mobile number to continue
          </Text>

          <View style={styles.card}>
            {/* Input */}
            <View style={styles.inputContainer}>
              {error !== '' && (
                <Text style={styles.error}>
                  {error}
                </Text>
              )}

              <Text style={styles.label}>
                Mobile Number
              </Text>

              <Pressable
                style={[
                  styles.inputRow,
                  focused && styles.inputFocused,
                ]}
                onPress={() => phoneInputRef.current?.focus()}
                accessible={false}
              >
                <View
                  style={styles.countryBox}
                  accessible={false}
                  focusable={false}
                  importantForAccessibility="no-hide-descendants"
                >
                  <Text
                    style={styles.countryText}
                    accessible={false}
                  >
                    🇮🇳 +91
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6B7280" style={{ marginLeft: 4 }} />
                </View>

                <TextInput
                  ref={phoneInputRef}
                  style={styles.input}
                  value={phone}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="number-pad"
                  maxLength={10}
                  autoComplete="tel"
                  textContentType="telephoneNumber"
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChangeText={(text) =>
                    setPhone(text.replace(/[^0-9]/g, ''))
                  }
                />
              </Pressable>
            </View>

            {/* Button */}
            <Pressable
              style={[
                styles.button,
                (phone.length !== 10 || loading) &&
                styles.buttonDisabled,
              ]}
              disabled={phone.length !== 10 || loading}
              onPress={handleSendOTP}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.buttonText}>
                    Continue
                  </Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color="#fff"
                    style={{ marginLeft: 8 }}
                  />
                </>
              )}
            </Pressable>

            {/* Secure OTP Note */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
              <Ionicons name="lock-closed-outline" size={14} color="#6B7280" />
              <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 6 }}>
                We'll send you a <Text style={{ color: '#2563EB', fontWeight: '600' }}>secure OTP</Text> to verify your number
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.line} />
            </View>

            {/* Action Cards */}
            <Pressable style={styles.actionCard} onPress={() => router.push('/register')}>
              <View style={styles.actionIconBox}>
                <Ionicons name="business-outline" size={24} color="#2563EB" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Register Your Clinic</Text>
                <Text style={styles.actionSubtitle}>New to CareQueue? Create your clinic account</Text>
              </View>
            </Pressable>

            <Pressable style={[styles.actionCard, { marginTop: 12 }]}>
              <View style={styles.actionIconBox}>
                <Ionicons name="qr-code-outline" size={24} color="#2563EB" />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Scan Clinic QR Code</Text>
                <Text style={styles.actionSubtitle}>Join your clinic using a QR code</Text>
              </View>
            </Pressable>

            {/* Help */}
            <Pressable style={styles.helpButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name="headset-outline"
                  size={16}
                  color="#2563EB"
                />
                <Text style={styles.helpText}>
                  Need help logging in?
                </Text>
              </View>
              <Text style={styles.helpSubtext}>Contact our support team</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Lighter background color, closer to image
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 60,
    paddingBottom: 40,
  },

  safeArea: {
    width: '100%',
    alignItems: 'center',
  },

  // Background Elements
  blueBlob: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(37,99,235,0.08)',
  },
  dotsPattern: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 60,
    height: 60,
    opacity: 0.1,
  },

  brand: {
    fontSize: 24,
    textAlign: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 28,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },

  inputContainer: {
    marginBottom: 20,
  },

  error: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },

  label: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    marginBottom: 10,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    height: 54,
    overflow: 'hidden',
  },

  inputFocused: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },

  countryBox: {
    height: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
  },

  countryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
  },

  button: {
    height: 54,
    backgroundColor: '#2563EB',
    borderRadius: 14,
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

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  or: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },

  actionIconBox: {
    marginRight: 16,
  },

  actionTextContainer: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  helpButton: {
    marginTop: 32,
    alignItems: 'center',
  },

  helpText: {
    marginLeft: 6,
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },

  helpSubtext: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 4,
  },
});