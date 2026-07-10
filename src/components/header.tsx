import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';

const MenuIcon = ({ size = 24, color = '#60646C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 12h18M3 6h18M3 18h18" />
  </Svg>
);

const SmartClinicLogo = ({ size = 24, color = '#0052FF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 3h6v5h5v6h-5v5H9v-5H4V8h5V3z" />
    <Path d="M2 12h5l2.5-5 3.5 10 2.5-5h6" />
  </Svg>
);

export function Header() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Pressable style={styles.menuButton}>
          <MenuIcon size={24} color="#60646C" />
        </Pressable>
        
        <View style={styles.logoContainer}>
          <SmartClinicLogo size={24} color="#0052FF" />
          <ThemedText style={styles.title}>Smart Clinic</ThemedText>
        </View>
        
        <Pressable 
          style={styles.profileContainer}
          onPress={() => router.push('/profile' as any)}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.profileImage}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFC',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.03)',
      },
    }),
    zIndex: 10,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8, 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold', 
    color: '#0052FF',
  },
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    backgroundColor: '#F5F6FA',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});
