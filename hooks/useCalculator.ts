import { useState, useCallback } from 'react';

type Operator = '+' | '-' | '×' | '÷' | null;

interface CalcState {
  display: string;
  expression: string;
  firstOperand: string | null;
  operator: Operator;
  waitingForSecond: boolean;
  justEvaluated: boolean;
}

const initialState: CalcState = {
  display: '0',
  expression: '',
  firstOperand: null,
  operator: null,
  waitingForSecond: false,
  justEvaluated: false,
};

function formatDisplay(value: string): string {
  // Limit display length
  if (value.length > 12) {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Error';
    return num.toPrecision(8).replace(/\.?0+$/, '');
  }
  return value;
}

function calculate(a: string, b: string, op: Operator): string {
  const numA = parseFloat(a);
  const numB = parseFloat(b);
  if (isNaN(numA) || isNaN(numB)) return 'Error';

  let result: number;
  switch (op) {
    case '+': result = numA + numB; break;
    case '-': result = numA - numB; break;
    case '×': result = numA * numB; break;
    case '÷':
      if (numB === 0) return 'Error';
      result = numA / numB;
      break;
    default: return b;
  }

  // Handle floating point precision
  const str = result.toPrecision(12).replace(/\.?0+$/, '');
  return parseFloat(str).toString();
}

export function useCalculator() {
  const [state, setState] = useState<CalcState>(initialState);

  const pressDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.justEvaluated) {
        return {
          ...initialState,
          display: digit === '.' ? '0.' : digit,
          expression: digit === '.' ? '0.' : digit,
        };
      }

      if (prev.waitingForSecond) {
        const newDisplay = digit === '.' ? '0.' : digit;
        return {
          ...prev,
          display: newDisplay,
          waitingForSecond: false,
        };
      }

      // Handle decimal
      if (digit === '.') {
        if (prev.display.includes('.')) return prev;
        return { ...prev, display: prev.display + '.' };
      }

      const newDisplay = prev.display === '0'
        ? digit
        : prev.display.length < 12
          ? prev.display + digit
          : prev.display;

      return { ...prev, display: newDisplay };
    });
  }, []);

  const pressOperator = useCallback((op: Operator) => {
    setState(prev => {
      const currentDisplay = prev.display;

      if (prev.firstOperand !== null && !prev.waitingForSecond && !prev.justEvaluated) {
        const result = calculate(prev.firstOperand, currentDisplay, prev.operator);
        const expr = `${result} ${op}`;
        return {
          ...prev,
          display: formatDisplay(result),
          expression: expr,
          firstOperand: result,
          operator: op,
          waitingForSecond: true,
          justEvaluated: false,
        };
      }

      const expr = `${currentDisplay} ${op}`;
      return {
        ...prev,
        expression: expr,
        firstOperand: currentDisplay,
        operator: op,
        waitingForSecond: true,
        justEvaluated: false,
      };
    });
  }, []);

  const pressEquals = useCallback(() => {
    setState(prev => {
      if (prev.firstOperand === null || prev.operator === null) return prev;

      const second = prev.waitingForSecond ? prev.firstOperand : prev.display;
      const result = calculate(prev.firstOperand, second, prev.operator);
      const expr = `${prev.firstOperand} ${prev.operator} ${second} =`;

      return {
        ...prev,
        display: formatDisplay(result),
        expression: expr,
        firstOperand: null,
        operator: null,
        waitingForSecond: false,
        justEvaluated: true,
      };
    });
  }, []);

  const pressClear = useCallback(() => {
    setState(initialState);
  }, []);

  const pressToggleSign = useCallback(() => {
    setState(prev => {
      const num = parseFloat(prev.display);
      if (isNaN(num)) return prev;
      return { ...prev, display: (-num).toString() };
    });
  }, []);

  const pressPercent = useCallback(() => {
    setState(prev => {
      const num = parseFloat(prev.display);
      if (isNaN(num)) return prev;
      return { ...prev, display: (num / 100).toString() };
    });
  }, []);

  const pressBackspace = useCallback(() => {
    setState(prev => {
      if (prev.justEvaluated || prev.display.length <= 1) {
        return { ...prev, display: '0', justEvaluated: false };
      }
      return { ...prev, display: prev.display.slice(0, -1) };
    });
  }, []);

  return {
    display: state.display,
    expression: state.expression,
    activeOperator: state.operator,
    pressDigit,
    pressOperator,
    pressEquals,
    pressClear,
    pressToggleSign,
    pressPercent,
    pressBackspace,
  };
}
