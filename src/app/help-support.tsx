import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput, ImageBackground, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Polyline, Line, Rect } from 'react-native-svg';

// Icons
const ArrowLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1="19" y1="12" x2="5" y2="12" />
    <Polyline points="12 19 5 12 12 5" />
  </Svg>
);

const SearchIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Line x1="16" y1="2" x2="16" y2="6" />
    <Line x1="8" y1="2" x2="8" y2="6" />
    <Line x1="3" y1="10" x2="21" y2="10" />
    <Circle cx="12" cy="16" r="1.5" fill="#0052FF" />
  </Svg>
);

const QueueIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <Rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <Circle cx="12" cy="14" r="4" />
    <Polyline points="12 12 12 14 14 15" />
  </Svg>
);

const UserIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const ChevronDownIcon = ({ style }: { style?: any }) => (
  <Animated.View style={style}>
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="6 9 12 15 18 9" />
    </Svg>
  </Animated.View>
);

const ChatIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <Line x1="9" y1="10" x2="15" y2="10" />
    <Line x1="9" y1="14" x2="13" y2="14" />
  </Svg>
);

const PhoneIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const AlertIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <Line x1="12" y1="9" x2="12" y2="13" />
    <Line x1="12" y1="17" x2="12.01" y2="17" />
  </Svg>
);

const FeedbackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <Path d="M8 10h.01" />
    <Path d="M12 10h.01" />
    <Path d="M16 10h.01" />
  </Svg>
);

const ChevronRightSmallIcon = ({ color = '#ffffff' }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.faqCard}>
      <Pressable 
        style={styles.faqHeader} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.faqText}>{question}</Text>
        <ChevronDownIcon 
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </Pressable>
      {expanded && (
        <Text style={styles.faqAnswer}>{answer}</Text>
      )}
    </View>
  );
};

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'top', 'bottom']}>
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeftIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>CATEGORIES</Text>
        <View style={styles.categoriesRow}>
          <Pressable style={styles.categoryCard}>
            <CalendarIcon />
            <Text style={styles.categoryText}>Booking</Text>
          </Pressable>
          <Pressable style={styles.categoryCard}>
            <QueueIcon />
            <Text style={styles.categoryText}>Queue</Text>
          </Pressable>
          <Pressable style={styles.categoryCard}>
            <UserIcon />
            <Text style={styles.categoryText}>Account</Text>
          </Pressable>
        </View>

        {/* Top FAQs */}
        <Text style={styles.sectionTitle}>TOP FAQS</Text>
        <View style={styles.faqsContainer}>
          <FaqItem 
            question="How do I track my live queue?" 
            answer="You can track your live queue status from the Queue tab in the bottom navigation bar. It updates in real-time."
          />
          <FaqItem 
            question="Can I cancel a booking?" 
            answer="Yes, you can cancel your booking up to 2 hours before the scheduled time from the My Bookings screen."
          />
          <FaqItem 
            question="How to add a family member?" 
            answer="Go to Profile > Family Members, and tap the 'Add Family Member' button at the bottom of the screen."
          />
        </View>

        {/* Still need help box */}
        <View style={styles.helpBox}>
          <Text style={styles.helpBoxTitle}>Still need help?</Text>
          
          <Pressable style={styles.chatButton}>
            <ChatIcon />
            <Text style={styles.chatButtonText}>Chat with Support</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightSmallIcon />
          </Pressable>
          
          <Pressable style={styles.callButton}>
            <PhoneIcon />
            <Text style={styles.callButtonText}>Call Clinic Support</Text>
            <View style={{ flex: 1 }} />
            <ChevronRightSmallIcon color="#0052FF" />
          </Pressable>
        </View>

        {/* Grid Buttons */}
        <View style={styles.gridRow}>
          <Pressable style={styles.gridCard}>
            <AlertIcon />
            <Text style={styles.gridCardTitle}>Report Issue</Text>
            <Text style={styles.gridCardSubtitle}>App errors or bugs</Text>
          </Pressable>
          <Pressable style={styles.gridCard}>
            <FeedbackIcon />
            <Text style={styles.gridCardTitle}>Give Feedback</Text>
            <Text style={styles.gridCardSubtitle}>Suggest a feature</Text>
          </Pressable>
        </View>

        {/* Banner */}
        <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80' }} 
          style={styles.bannerContainer}
          imageStyle={styles.bannerImage}
        >
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>SMART CLINIC SUPPORT</Text>
            <Text style={styles.bannerSubtitle}>Available 24/7 for your health needs</Text>
          </View>
        </ImageBackground>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_600SemiBold',
    color: '#0052FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: '#1E293B',
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 16,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B',
    marginTop: 8,
  },
  faqsContainer: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 22,
  },
  helpBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  helpBoxTitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#1E40AF',
    marginBottom: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0052FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  callButtonText: {
    color: '#0052FF',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    marginLeft: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginTop: 24,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridCardTitle: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
  },
  gridCardSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  bannerContainer: {
    height: 120,
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    opacity: 0.3,
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0052FF',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
});
