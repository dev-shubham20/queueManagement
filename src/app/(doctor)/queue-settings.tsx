import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import BottomTabBar from '../../components/BottomTabBar';
import DashboardHeader from '../../components/DashboardHeader';

export default function QueueSettingsScreen() {
  const router = useRouter();

  // State for toggles & inputs
  const [tokenPrefix, setTokenPrefix] = useState('CL');
  const [autoSkip, setAutoSkip] = useState(true);
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [walkIn, setWalkIn] = useState(true);
  const [phoneBooking, setPhoneBooking] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <DashboardHeader title="Queue Settings" leftIcon="back" rightElement="none" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Queue Controls */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Queue Controls</Text>
              <Text style={styles.cardSubtitle}>Master switch for all active flows</Text>
            </View>
            <Pressable style={styles.pauseButton}>
              <Ionicons name="pause-circle-outline" size={18} color="#E11D48" />
              <Text style={styles.pauseButtonText}>Pause All Queues</Text>
            </Pressable>
          </View>
        </View>

        {/* General Preferences */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>General Preferences</Text>
          </View>

          {/* Token Prefix */}
          <View style={styles.settingItemRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Token Prefix</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputTextValue}
                  value={tokenPrefix}
                  onChangeText={setTokenPrefix}
                  placeholder="CL"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  maxLength={5}
                />
                <Text style={styles.inputPlaceholder}>Characters only</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />

          {/* Auto Skip */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>Auto Skip Missed Patient</Text>
              <Text style={styles.settingSubtitle}>Automatically move to the next patient after 3 failed calls.</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setAutoSkip}
              value={autoSkip}
            />
          </View>

          <View style={styles.divider} />

          {/* Emergency Token */}
          <View style={styles.settingItemRow}>
            <View style={styles.settingTextContent}>
              <Text style={styles.settingTitle}>Emergency Token Setup</Text>
              <Text style={styles.settingSubtitle}>Prioritize urgent care cases automatically at the top of the list.</Text>
            </View>
            <Pressable style={styles.configureButton}>
              <Text style={styles.configureButtonText}>Configure</Text>
            </Pressable>
          </View>
        </View>

        {/* Booking Channels */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="git-network-outline" size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Booking Channels</Text>
          </View>

          {/* Online Booking */}
          <View style={styles.settingItemRow}>
            <View style={styles.iconBox}>
              <Ionicons name="earth" size={20} color="#1E1B4B" />
            </View>
            <View style={styles.settingTextContentWithIcon}>
              <Text style={styles.settingTitle}>Allow Online Booking</Text>
              <Text style={styles.settingSubtitle}>Via ClinicFlow mobile app or web portal.</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setOnlineBooking}
              value={onlineBooking}
            />
          </View>

          {/* Walk-in */}
          <View style={[styles.settingItemRow, { marginTop: 16 }]}>
            <View style={styles.iconBox}>
              <Ionicons name="walk" size={20} color="#1E1B4B" />
            </View>
            <View style={styles.settingTextContentWithIcon}>
              <Text style={styles.settingTitle}>Allow Walk-in</Text>
              <Text style={styles.settingSubtitle}>Via reception kiosk or front desk.</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setWalkIn}
              value={walkIn}
            />
          </View>

          {/* Phone Booking */}
          <View style={[styles.settingItemRow, { marginTop: 16 }]}>
            <View style={[styles.iconBox, { backgroundColor: '#A7F3D0' }]}>
              <Ionicons name="call" size={18} color="#065F46" />
            </View>
            <View style={styles.settingTextContentWithIcon}>
              <Text style={styles.settingTitle}>Allow Phone Booking</Text>
              <Text style={styles.settingSubtitle}>Manual registration by clinic staff.</Text>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              thumbColor="#ffffff"
              ios_backgroundColor="#D1D5DB"
              onValueChange={setPhoneBooking}
              value={phoneBooking}
            />
          </View>
        </View>

        {/* Illustration & Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.illustrationPlaceholder}>
             {/* Simple geometric mockup of the isometric illustration */}
             <Ionicons name="desktop-outline" size={48} color="#94A3B8" />
             <View style={{ flexDirection: 'row', marginTop: 10 }}>
               <View style={{ width: 40, height: 30, backgroundColor: '#CBD5E1', borderRadius: 4, marginHorizontal: 5 }} />
               <View style={{ width: 40, height: 30, backgroundColor: '#CBD5E1', borderRadius: 4, marginHorizontal: 5 }} />
             </View>
          </View>
          <Text style={styles.footerText}>
            Changes to these settings take effect immediately across all connected kiosks and practitioner dashboards.
          </Text>
        </View>

      </ScrollView>

      {/* App Bottom Tab Bar */}
      <BottomTabBar />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 8,
  },
  
  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContent: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  pauseButton: {
    backgroundColor: '#FFE4E6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 24,
  },
  pauseButtonText: {
    color: '#BE123C',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
    lineHeight: 14,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 8,
  },

  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  inputTextValue: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
    height: '100%',
  },
  inputPlaceholder: {
    fontSize: 14,
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
  },
  settingTextContent: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  configureButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  configureButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContentWithIcon: {
    flex: 1,
    paddingRight: 12,
  },

  footerContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  illustrationPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#475569', // Dark slate to mimic the image
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
