import { formatPrice } from '../src/utils/format-price';
import { describe, it, expect } from 'vitest';
import { dollarSing } from '../src/constants/constants';

describe('formatPrice', () => {
  it('returns empty string for underfined price', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(formatPrice(undefined)).toBe('');
  });
  it('returns empty string for 0 or negative', () => {
    expect(formatPrice(0)).toBe('');
    expect(formatPrice(-100)).toBe('');
  });
  it('return formatted price', () => {
    expect(formatPrice(100)).toBe(`${dollarSing}1.00`);
    expect(formatPrice(199)).toBe(`${dollarSing}1.99`);
    expect(formatPrice(12345)).toBe(`${dollarSing}123.45`);
  });
});
