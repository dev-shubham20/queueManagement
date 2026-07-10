import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Basic check for active state
  const isActive = (path: string) => {
    // For this mockup, we'll assume /success implies we're in the app/home area
    if (path === '/' && (pathname === '/' || pathname === '/success')) return true;
    return pathname === path;
  };

  return (
    <View style={styles.bottomTabBar}>
      <Pressable 
        style={styles.tabItem} 
        onPress={() => router.push('/dashboard')}
      >
        <Ionicons 
          name={isActive('/dashboard') ? "home" : "home-outline"} 
          size={24} 
          color={isActive('/dashboard') ? "#111827" : "#6B7280"} 
        />
        <Text style={[styles.tabText, isActive('/dashboard') && styles.tabTextActive]}>
          Home
        </Text>
      </Pressable>

      <Pressable 
        style={styles.tabItem}
        onPress={() => {
          router.push('/queue')
        }}
      >
        <Ionicons 
          name={isActive('/queue') ? "people" : "people-outline"} 
          size={24} 
          color={isActive('/queue') ? "#111827" : "#6B7280"} 
        />
        <Text style={[styles.tabText, isActive('/queue') && styles.tabTextActive]}>
          Queue
        </Text>
      </Pressable>

      <Pressable 
        style={styles.tabItem}
        onPress={() => {
          router.push('/patients-list')
        }}
      >
        <Ionicons 
          name={isActive('/patients-list') ? "folder" : "folder-outline"} 
          size={24} 
          color={isActive('/patients-list') ? "#111827" : "#6B7280"} 
        />
        <Text style={[styles.tabText, isActive('/patients-list') && styles.tabTextActive]}>
          Patients List
        </Text>
      </Pressable>

      <Pressable 
        style={styles.tabItem}
        onPress={() => {
          router.push('/settings')
        }}
      >
        <Ionicons 
          name={isActive('/settings') ? "settings" : "settings-outline"} 
          size={24} 
          color={isActive('/settings') ? "#111827" : "#6B7280"} 
        />
        <Text style={[styles.tabText, isActive('/settings') && styles.tabTextActive]}>
          Settings
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#111827',
  },
});
