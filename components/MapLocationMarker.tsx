import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle, Polygon } from 'react-native-svg';
import { FuelPumpIcon } from './icons/OrderCardIcons';

interface MapLocationMarkerProps {
  label: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export default function MapLocationMarker({ label, icon, accentColor = '#007AFF' }: MapLocationMarkerProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.pinContainer}>
        <View style={styles.badgeShadow}>
          <View style={styles.badgeClip}>
            <Svg width={36} height={36} style={StyleSheet.absoluteFill}>
              <Defs>
                <RadialGradient id="grad" cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={accentColor} stopOpacity={0.45} />
                  <Stop offset="1" stopColor={accentColor} stopOpacity={0} />
                </RadialGradient>
              </Defs>
              <Circle cx={18} cy={18} r={18} fill="#F9F9F9" />
              <Circle cx={18} cy={18} r={18} fill="url(#grad)" />
            </Svg>
            <View style={styles.iconWrap}>{icon ?? <FuelPumpIcon />}</View>
          </View>
        </View>

        <Svg width={9} height={6} style={styles.pointer}>
          <Polygon points="4.5,6 9,0 0,0" fill="#fff" />
        </Svg>

        <View style={[styles.dot, { backgroundColor: accentColor }]} />
      </View>

      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    maxWidth: 140,
  },
  pinContainer: {
    width: 36,
    height: 45,
    alignItems: 'center',
  },
  badgeShadow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  badgeClip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    marginTop: -2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#fff',
    marginTop: 1,
  },
  label: {
    marginTop: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
