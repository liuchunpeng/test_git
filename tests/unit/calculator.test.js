import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CalculatorButton from '@/components/CalculatorButton.vue';

// Mock logger
vi.mock('@/utils/logger', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}));

describe('CalculatorButton', () => {
  it('renders button with correct value', () => {
    const wrapper = mount(CalculatorButton, {
      props: {
        value: '5',
        type: 'number'
      }
    });
    
    expect(wrapper.text()).toBe('5');
  });

  it('displays operator symbol correctly', () => {
    const wrapper = mount(CalculatorButton, {
      props: {
        value: '*',
        type: 'operator'
      }
    });
    
    expect(wrapper.text()).toBe('×');
  });

  it('emits click event with value', async () => {
    const wrapper = mount(CalculatorButton, {
      props: {
        value: '7',
        type: 'number'
      }
    });
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(wrapper.emitted('click')[0]).toEqual(['7']);
  });

  it('applies correct class based on type', () => {
    const numberWrapper = mount(CalculatorButton, {
      props: { value: '1', type: 'number' }
    });
    expect(numberWrapper.classes()).toContain('calculator-btn--number');

    const operatorWrapper = mount(CalculatorButton, {
      props: { value: '+', type: 'operator' }
    });
    expect(operatorWrapper.classes()).toContain('calculator-btn--operator');

    const functionWrapper = mount(CalculatorButton, {
      props: { value: 'C', type: 'function' }
    });
    expect(functionWrapper.classes()).toContain('calculator-btn--function');

    const equalWrapper = mount(CalculatorButton, {
      props: { value: '=', type: 'equal' }
    });
    expect(equalWrapper.classes()).toContain('calculator-btn--equal');
  });

  it('applies wide class when span is 2', () => {
    const wrapper = mount(CalculatorButton, {
      props: { value: '0', type: 'number', span: 2 }
    });
    
    expect(wrapper.classes()).toContain('calculator-btn--wide');
  });
});

describe('Calculator Logic', () => {
  // 测试计算逻辑
  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 'Error' : a / b;
      default: return b;
    }
  };

  it('performs addition correctly', () => {
    expect(calculate(5, 3, '+')).toBe(8);
  });

  it('performs subtraction correctly', () => {
    expect(calculate(10, 4, '-')).toBe(6);
  });

  it('performs multiplication correctly', () => {
    expect(calculate(6, 7, '*')).toBe(42);
  });

  it('performs division correctly', () => {
    expect(calculate(20, 4, '/')).toBe(5);
  });

  it('handles division by zero', () => {
    expect(calculate(1, 0, '/')).toBe('Error');
  });

  it('handles decimal results', () => {
    expect(calculate(10, 3, '/')).toBeCloseTo(3.333333, 5);
  });

  it('handles negative results', () => {
    expect(calculate(3, 8, '-')).toBe(-5);
  });
});
