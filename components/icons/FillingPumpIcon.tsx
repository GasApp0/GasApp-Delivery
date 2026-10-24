import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { FuelPumpIcon } from './OrderCardIcons';

const ICON_SIZE = 16;

interface FillingPumpIconProps {
  /** Loops a bottom-to-top fill to show the tank actively being filled. */
  animated?: boolean;
}

export default function FillingPumpIcon({ animated = false }: FillingPumpIconProps) {
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) {
      fill.setValue(0);
      return;
    }
    fill.setValue(0);
    const loop = Animated.loop(
      Animated.timing(fill, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [animated, fill]);

  if (!animated) {
    return <FuelPumpIcon />;
  }

  const fillHeight = fill.interpolate({ inputRange: [0, 1], outputRange: [0, ICON_SIZE] });

  return (
    <View style={styles.wrap}>
      <View style={styles.dim}>
        <FuelPumpIcon />
      </View>
      <Animated.View style={[styles.mask, { height: fillHeight }]}>
        <View style={styles.maskInner}>
          <FuelPumpIcon />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  dim: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
  },
  mask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ICON_SIZE,
    overflow: 'hidden',
  },
  maskInner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
