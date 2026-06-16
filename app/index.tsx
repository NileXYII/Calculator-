import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useCalculator } from '../hooks/useCalculator';
import CalcButton, { ButtonVariant } from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';
import { MD3 } from '../constants/theme';

const { width } = Dimensions.get('window');

type ButtonDef = {
  label: string;
  variant: ButtonVariant;
  wide?: boolean;
  action: 'digit' | 'operator' | 'equals' | 'clear' | 'sign' | 'percent' | 'backspace';
  value?: string;
};

const BUTTONS: ButtonDef[][] = [
  [
    { label: 'AC',  variant: 'clear',    action: 'clear' },
    { label: '+/-', variant: 'function', action: 'sign' },
    { label: '%',   variant: 'function', action: 'percent' },
    { label: '÷',   variant: 'operator', action: 'operator', value: '÷' },
  ],
  [
    { label: '7', variant: 'number', action: 'digit', value: '7' },
    { label: '8', variant: 'number', action: 'digit', value: '8' },
    { label: '9', variant: 'number', action: 'digit', value: '9' },
    { label: '×', variant: 'operator', action: 'operator', value: '×' },
  ],
  [
    { label: '4', variant: 'number', action: 'digit', value: '4' },
    { label: '5', variant: 'number', action: 'digit', value: '5' },
    { label: '6', variant: 'number', action: 'digit', value: '6' },
    { label: '-', variant: 'operator', action: 'operator', value: '-' },
  ],
  [
    { label: '1', variant: 'number', action: 'digit', value: '1' },
    { label: '2', variant: 'number', action: 'digit', value: '2' },
    { label: '3', variant: 'number', action: 'digit', value: '3' },
    { label: '+', variant: 'operator', action: 'operator', value: '+' },
  ],
  [
    { label: '⌫',  variant: 'function', action: 'backspace' },
    { label: '0',  variant: 'number',   action: 'digit', value: '0' },
    { label: '.',  variant: 'number',   action: 'digit', value: '.' },
    { label: '=',  variant: 'equals',   action: 'equals' },
  ],
];

export default function Calculator() {
  const calc = useCalculator();

  function handleButton(btn: ButtonDef) {
    switch (btn.action) {
      case 'digit':     return calc.pressDigit(btn.value!);
      case 'operator':  return calc.pressOperator(btn.value as any);
      case 'equals':    return calc.pressEquals();
      case 'clear':     return calc.pressClear();
      case 'sign':      return calc.pressToggleSign();
      case 'percent':   return calc.pressPercent();
      case 'backspace': return calc.pressBackspace();
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={MD3.background} />

      {/* Display */}
      <View style={styles.displayArea}>
        <CalcDisplay value={calc.display} expression={calc.expression} />
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Button grid */}
      <View style={styles.pad}>
        {BUTTONS.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {row.map((btn) => (
              <CalcButton
                key={btn.label}
                label={btn.label}
                variant={btn.variant}
                wide={btn.wide}
                active={btn.action === 'operator' && calc.activeOperator === btn.value}
                onPress={() => handleButton(btn)}
              />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: MD3.background,
  },
  displayArea: {
    flex: 1,
    minHeight: 180,
  },
  divider: {
    height: 1,
    backgroundColor: MD3.outlineVariant,
    marginHorizontal: 24,
    opacity: 0.6,
  },
  pad: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    height: (width - 24) / 4 - 10,
    marginBottom: 2,
  },
});
