import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface SmartClinicLogoProps extends SvgProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  hideText?: boolean;
}

export function SmartClinicLogo({
  size = 120,
  color = '#0066FF',
  strokeWidth = 6,
  hideText = false,
  style,
  ...props
}: SmartClinicLogoProps) {
  // SVG coordinates: viewBox 0 0 100 100
  // Top half of the cross outline (open at left and right ends for ECG line)
  const topCrossPath = 'M 10,43 L 10,38 A 8,8 0 0,1 18,30 L 32,30 A 8,8 0 0,0 40,22 L 40,18 A 8,8 0 0,1 48,10 L 52,10 A 8,8 0 0,1 60,18 L 60,22 A 8,8 0 0,0 68,30 L 82,30 A 8,8 0 0,1 90,38 L 90,43';
  
  // Bottom half of the cross outline
  const bottomCrossPath = 'M 90,57 L 90,62 A 8,8 0 0,1 82,70 L 68,70 A 8,8 0 0,0 60,78 L 60,82 A 8,8 0 0,1 52,90 L 48,90 A 8,8 0 0,1 40,82 L 40,78 A 8,8 0 0,0 32,70 L 18,70 A 8,8 0 0,1 10,62 L 10,57';

  // ECG Heartbeat line passing horizontally through the cross (matched to the reference logo)
  const ecgPath = 'M 5,50 L 30,50 L 33,55 L 36,44 L 39,50 L 44,22 L 49,78 L 53,38 L 56,53 L 59,50 L 95,50';

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        {...props}
      >
        <Path
          d={topCrossPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={bottomCrossPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d={ecgPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {!hideText && (
        <Text style={[styles.logoText, { color, fontSize: size * 0.22 }]}>
          Smart Clinic
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'Outfit_800ExtraBold',
    marginTop: 8,
    letterSpacing: -0.8,
  },
});
