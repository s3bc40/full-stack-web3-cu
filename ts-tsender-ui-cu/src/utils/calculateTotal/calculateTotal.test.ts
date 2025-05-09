import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculateTotal';

describe('calculateTotal', () => {
    it('should return 0 for empty input', () => {
        expect(calculateTotal('')).toBe(0);
        expect(calculateTotal('   ')).toBe(0);
        expect(calculateTotal(null as any)).toBe(0);
        expect(calculateTotal(undefined as any)).toBe(0);
    });

    it('should handle a single number', () => {
        expect(calculateTotal('100')).toBe(100);
        expect(calculateTotal('42.5')).toBe(42.5);
        expect(calculateTotal('  123  ')).toBe(123);
    });

    it('should sum comma-separated numbers', () => {
        expect(calculateTotal('100,200,300')).toBe(600);
        expect(calculateTotal('10.5,20.3,30.7')).toBe(61.5);
        expect(calculateTotal('  100 , 200 ')).toBe(300);
    });

    it('should sum newline-separated numbers', () => {
        expect(calculateTotal('100\n200\n300')).toBe(600);
        expect(calculateTotal('10.5\n20.3\n30.7')).toBe(61.5);
        expect(calculateTotal('  100 \n 200 ')).toBe(300);
    });

    it('should handle mixed comma and newline separators', () => {
        expect(calculateTotal('100,200\n300')).toBe(600);
        expect(calculateTotal('10.5\n20.3,30.7')).toBe(61.5);
        expect(calculateTotal('100,\n200,300')).toBe(600);
    });

    it('should skip non-numeric values', () => {
        expect(calculateTotal('100,abc,300')).toBe(400);
        expect(calculateTotal('100\nabc\n300')).toBe(400);
        expect(calculateTotal('abc,def')).toBe(0);
    });

    it('should handle consecutive separators', () => {
        expect(calculateTotal('100,,200')).toBe(300);
        expect(calculateTotal('100\n\n200')).toBe(300);
        expect(calculateTotal('100,\n,200')).toBe(300);
    });

    it('should handle negative numbers', () => {
        expect(calculateTotal('-100,200')).toBe(100);
        expect(calculateTotal('100,-200')).toBe(-100);
        expect(calculateTotal('-100,-200')).toBe(-300);
    });

    it('should handle decimal precision', () => {
        expect(calculateTotal('0.1,0.2')).toBeCloseTo(0.3);
        expect(calculateTotal('0.1\n0.2')).toBeCloseTo(0.3);
    });

    it('should handle real-world examples', () => {
        expect(calculateTotal('100\n100\n100')).toBe(300);
        expect(calculateTotal('200,200\n100')).toBe(500);
        expect(calculateTotal('99.99\n45.50\n199.99')).toBeCloseTo(345.48);
    });
});