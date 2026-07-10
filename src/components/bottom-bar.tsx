import React from 'react';
import {
  Tabs,
  TabSlot,
  TabList,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { Pressable, View, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const Home = ({ isFocused }: { isFocused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 39.434 39.434">
    <Path 
      fill={isFocused ? '#0052FF' : '#8E9AA8'}
      d="M39.434,20.718c0,1.104-0.895,2-2,2c-0.004,0-0.012,0-0.02,0h-3.805v10.637c0,1.104-0.896,2-2,2h-6.568
		c-1.104,0-2-0.896-2-2v-5.638c0-1.838-1.496-3.333-3.333-3.333c-1.838,0-3.334,1.495-3.334,3.333v5.638c0,1.104-0.896,2-2,2H7.805
		c-1.104,0-2-0.896-2-2V22.718H2c-0.844,0-1.598-0.528-1.882-1.322c-0.285-0.795-0.043-1.682,0.606-2.22L18.432,4.538
		c0.74-0.611,1.81-0.611,2.549,0L38.526,19.04C39.072,19.398,39.434,20.016,39.434,20.718z"
    />
  </Svg>
);
const FindIcon = ({ isFocused }: { isFocused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={isFocused ? '#0052FF' : '#8E9AA8'} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const BookIcon = ({ isFocused }: { isFocused: boolean }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={isFocused ? '#0052FF' : '#8E9AA8'} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const QueueIcon = ({ isFocused }: { isFocused: boolean }) => (
  <Svg width={24} height={20} viewBox="0 0 24 20" fill="none">
    {isFocused ? (
      <Path d="M2,4 C2,2.9 2.9,2 4,2 L20,2 C21.1,2 22,2.9 22,4 L22,8 C21,8 20,8.9 20,10 C20,11.1 21,12 22,12 L22,16 C22,17.1 21.1,18 20,18 L4,18 C2.9,18 2,17.1 2,16 L2,12 C3,12 4,11.1 4,10 C4,8.9 3,8 2,8 L2,4 Z" fill="#0052FF" />
    ) : (
      <Path d="M2,4 C2,2.9 2.9,2 4,2 L20,2 C21.1,2 22,2.9 22,4 L22,8 C21,8 20,8.9 20,10 C20,11.1 21,12 22,12 L22,16 C22,17.1 21.1,18 20,18 L4,18 C2.9,18 2,17.1 2,16 L2,12 C3,12 4,11.1 4,10 C4,8.9 3,8 2,8 L2,4 Z" stroke="#8E9AA8" strokeWidth={2} fill="none" />
    )}
    <Circle cx={12} cy={7} r={1.2} fill={isFocused ? '#ffffff' : '#8E9AA8'} />
    <Circle cx={12} cy={10} r={1.2} fill={isFocused ? '#ffffff' : '#8E9AA8'} />
    <Circle cx={12} cy={13} r={1.2} fill={isFocused ? '#ffffff' : '#8E9AA8'} />
  </Svg>
);

interface TabButtonProps extends TabTriggerSlotProps {
  label: string;
  Icon: React.ComponentType<{ isFocused: boolean }>;
}

export function TabButton({ label, Icon, isFocused, ...props }: TabButtonProps) {
  const focused = !!isFocused;

  return (
    <Pressable {...props} style={styles.tabButton}>
      <View style={styles.iconWrapper}>
        <Icon isFocused={focused} />
      </View>
      <ThemedText
        style={[
          styles.tabLabel,
          { color: focused ? '#0052FF' : '#8E9AA8' },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function BottomBar() {
  return (
    <Tabs style={styles.container}>
      <View style={styles.contentSlot}>
        {Platform.OS === 'web' ? (
          <div style={{ height: '100%', width: '100%', overflowY: 'auto' }}>
            <TabSlot />
          </div>
        ) : (
          <TabSlot />
        )}
      </View>

      <TabList style={styles.tabListContainer}>
        <TabTrigger name="home" asChild>
          <TabButton label="Home" Icon={Home} />
        </TabTrigger>

        <TabTrigger name="explore" asChild>
          <TabButton label="Find" Icon={FindIcon} />
        </TabTrigger>

        <TabTrigger name="queue" asChild>
          <TabButton label="Queue" Icon={QueueIcon} />
        </TabTrigger>

        <TabTrigger name="book" asChild>
          <TabButton label="My Booking" Icon={BookIcon} />
        </TabTrigger>

      </TabList>

      <TabList style={styles.hiddenTabList}>
        <TabTrigger name="home" href="/home" />
        <TabTrigger name="explore" href="/explore" />
        <TabTrigger name="book" href="/book" />
        <TabTrigger name="queue" href="/queue" />
        <TabTrigger name="profile" href="/profile" />
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'relative',
    backgroundColor: '#FAFAFC',
  },
  contentSlot: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingBottom: 68,
  },
  hiddenTabList: {
    display: 'none',
  },
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: '#ffffff',
    borderTopWidth: 1.2,
    borderTopColor: '#EBF0F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 14 : 0,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px -4px 10px rgba(0,0,0,0.02)',
      },
    }),
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    width: '25%',
    gap: 4,
  },
  iconWrapper: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: -0.2,
  },
});
