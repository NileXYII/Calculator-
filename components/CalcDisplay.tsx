import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MD3 } from '../constants/theme';

interface CalcDisplayProps {
  value: string;
  expression: string;
}

function getFontSize(value: string): number {
  const len = value.replace('-', '').length;
  if (len <= 6) return 72;
  if (len <= 9) return 56;
  if (len <= 12) return 44;
  return 36;
}

export default function CalcDisplay({ value, expression }: CalcDisplayProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      slideAnim.setValue(6);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 320,
        friction: 22,
      }).start();
      prevValue.current = value;
    }
  }, [value]);

  return (
    <View style={styles.container}>
      {/* Expression row */}
      <Text style={styles.expression} numberOfLines={1} adjustsFontSizeToFit>
        {expression || ' '}
      </Text>

      {/* Main display */}
      <Animated.Text
        style={[
          styles.display,
          { fontSize: getFontSize(value) },
          { transform: [{ translateY: slideAnim }] },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 28,
    paddingBottom: 12,
    paddingTop: 8,
  },
  expression: {
    fontSize: 18,
    color: MD3.onSurfaceVariant,
    fontWeight: '400',
    letterSpacing: 0.15,
    marginBottom: 4,
    maxWidth: '100%',
  },
  display: {
    color: MD3.onBackground,
    fontWeight: '300',
    letterSpacing: -1.5,
    lineHeight: undefined,
  },
});
