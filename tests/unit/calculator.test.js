import { describe, it, expect, vi } from 'vitest';
vi.mock('@/utils/logger', () => ({ default: { info: vi.fn(), error: vi.fn() } }));
const calculate = (a, b, op) => {
  switch (op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return b === 0 ? 'Error' : a / b; default: return b; }
};
describe('Calculator Logic', () => {
  it('addition', () => expect(calculate(5, 3, '+')).toBe(8));
  it('subtraction', () => expect(calculate(10, 4, '-')).toBe(6));
  it('multiplication', () => expect(calculate(6, 7, '*')).toBe(42));
  it('division', () => expect(calculate(20, 4, '/')).toBe(5));
  it('division by zero', () => expect(calculate(1, 0, '/')).toBe('Error'));
  it('decimal', () => expect(calculate(10, 3, '/')).toBeCloseTo(3.33333, 4));
  it('negative result', () => expect(calculate(3, 8, '-')).toBe(-5));
});
