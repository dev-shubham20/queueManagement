import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';

export default function SuperAdminRedirectScreen() {
  const router = useRouter();

  useEffect(() => {
    const adminUrl = 'http://localhost:5001/superadmin';
    if (Platform.OS === 'web') {
      window.location.href = adminUrl;
    } else {
      Linking.openURL(adminUrl).catch(() => {
        router.replace('/(auth)/role-selection');
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text style={styles.text}>Connecting to Super Admin Cockpit...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  text: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
});
