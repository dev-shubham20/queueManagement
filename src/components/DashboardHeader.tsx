import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title?: string;
  leftIcon?: 'menu' | 'back' | 'logo';
  onLeftPress?: () => void;
  rightElement?: 'avatar' | 'none' | 'icon';
  rightIconName?: any;
  onRightPress?: () => void;
}

export default function DashboardHeader({
  title,
  leftIcon = 'menu',
  onLeftPress,
  rightElement = 'avatar',
  rightIconName,
  onRightPress,
}: HeaderProps) {
  const router = useRouter();

  const [time, setTime] = useState('');
  useEffect(() => {
    if (!title) {
      const updateTime = () => {
        const now = new Date();
        setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      };
      updateTime();
      const interval = setInterval(updateTime, 60000);
      return () => clearInterval(interval);
    }
  }, [title]);

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (leftIcon === 'back') {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {leftIcon === 'menu' && (
        <Pressable style={styles.iconButton} onPress={handleLeftPress}>
          <Ionicons name="menu" size={28} color="#2563EB" />
        </Pressable>
      )}
      {leftIcon === 'back' && (
        <Pressable style={styles.iconButton} onPress={handleLeftPress}>
          <Ionicons name="arrow-back" size={24} color="#2563EB" />
        </Pressable>
      )}
      {leftIcon === 'logo' && (
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={16} color="#FFFFFF" />
          </View>
        </View>
      )}

      {leftIcon === 'logo' ? (
        <Text style={styles.headerTitleLogo}>{title || 'ClinicFlow'}</Text>
      ) : (
        <Text style={title ? styles.headerTitle : styles.timeText}>
          {title || time || '12:46'}
        </Text>
      )}

      {rightElement === 'avatar' && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatarImagePlaceholder}>
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </View>
        </View>
      )}
      {rightElement === 'icon' && rightIconName && (
        <Pressable style={styles.iconButtonRight} onPress={onRightPress}>
          <Ionicons name={rightIconName} size={24} color="#475569" />
        </Pressable>
      )}
      {rightElement === 'none' && (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -4,
  },
  iconButtonRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: -4,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerTitleLogo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginLeft: 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  avatarImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
