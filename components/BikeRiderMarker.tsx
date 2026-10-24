import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Scale with screen width so the marker reads at a consistent relative size
// across phone/tablet, clamped to sane bounds.
const ICON_SIZE = Math.max(28, Math.min(44, SCREEN_WIDTH * 0.1));
const RING_MAX_SIZE = ICON_SIZE * 2.4;

export default function BikeRiderMarker() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.45, 0.15, 0] });

  return (
    <View style={[styles.wrap, { width: RING_MAX_SIZE, height: RING_MAX_SIZE }]}>
      <Animated.View
        style={[
          styles.ring,
          {
            width: RING_MAX_SIZE,
            height: RING_MAX_SIZE,
            borderRadius: RING_MAX_SIZE / 2,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />
      <View
        style={[
          styles.backdrop,
          { width: ICON_SIZE + 10, height: ICON_SIZE + 10, borderRadius: (ICON_SIZE + 10) / 2 },
        ]}
      >
        <Image
          source={require('../assets/images/order-card/bike-rider.png')}
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    backgroundColor: '#22C55E',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
