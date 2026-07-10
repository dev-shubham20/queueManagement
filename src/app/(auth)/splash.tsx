import { Storage } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const navigateAfterDelay = async () => {
      const isLoggedIn = await Storage.getItem('isLoggedIn');
      if (!active) return;

      if (isLoggedIn === 'true') {
        router.replace('/(patient)/(tabs)/home');
      } else {
        router.replace('/login');
      }
    };

    const timer = setTimeout(navigateAfterDelay, 1200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandTitle}>Smart Clinic</Text>
        <Text style={styles.brandSubtitle}>Fast, secure healthcare access</Text>
      </View>
      <ActivityIndicator size="large" color="#0052FF" style={styles.spinner} />
      <Text style={styles.loadingText}>Opening your healthcare dashboard...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FF',
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00256F',
  },
  brandSubtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#4C5B77',
    textAlign: 'center',
  },
  spinner: {
    marginTop: 24,
  },
  loadingText: {
    marginTop: 18,
    color: '#5B6A82',
    fontSize: 14,
    textAlign: 'center',
  },
});
