import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { MD3 } from '../constants/theme';

export type ButtonVariant = 'number' | 'operator' | 'equals' | 'function' | 'clear';

interface CalcButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  wide?: boolean;
  active?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
  number: {
    container: { backgroundColor: MD3.surfaceContainerHigh },
    text: { color: MD3.onSurface },
  },
  operator: {
    container: { backgroundColor: MD3.tertiaryContainer },
    text: { color: MD3.onTertiaryContainer },
  },
  equals: {
    container: { backgroundColor: MD3.primary },
    text: { color: MD3.onPrimary },
  },
  function: {
    container: { backgroundColor: MD3.secondaryContainer },
    text: { color: MD3.onSecondaryContainer },
  },
  clear: {
    container: { backgroundColor: MD3.errorContainer },
    text: { color: MD3.onErrorContainer },
  },
};

export default function CalcButton({
  label,
  onPress,
  variant = 'number',
  wide = false,
  active = false,
}: CalcButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const overlayAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.91,
        useNativeDriver: true,
        tension: 400,
        friction: 18,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, overlayAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 14,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, overlayAnim]);

  const variantStyle = VARIANT_STYLES[variant];
  const activeContainerStyle: ViewStyle = active
    ? { backgroundColor: MD3.primary, borderWidth: 2, borderColor: MD3.primaryContainer }
    : {};
  const activeTextStyle: TextStyle = active ? { color: MD3.onPrimary } : {};

  return (
    <Animated.View style={[
      styles.wrapper,
      wide && styles.wideWrapper,
      { transform: [{ scale: scaleAnim }] },
    ]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          wide && styles.wide,
          variantStyle.container,
          activeContainerStyle,
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      >
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.12] }) },
          ]}
        />
        <Text style={[styles.label, variantStyle.text, activeTextStyle]}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
  },
  wideWrapper: {
    flex: 2.1,
    aspectRatio: undefined,
  },
  button: {
    flex: 1,
    borderRadius: MD3.shapeFull,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // M3 Expressive shadow
    shadowColor: MD3.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  wide: {
    borderRadius: MD3.shapeFull,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 26,
    fontWeight: '500',
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
});
