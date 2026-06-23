import { describe, expect, it } from 'vitest';
import {
  getSafeCustomCategoryIcon,
  validateCustomCategoryIconValue,
  validateCategoryIconValue,
} from './category-icon-validation';

describe('category icon validation', () => {
  it('allows empty and preset-style icon keys', () => {
    expect(validateCategoryIconValue(null)).toEqual({ valid: true, value: null });
    expect(validateCategoryIconValue(' coffee ')).toEqual({ valid: true, value: 'coffee' });
    expect(validateCategoryIconValue('briefcase')).toEqual({ valid: true, value: 'briefcase' });
  });

  it('allows short custom emoji and text values', () => {
    expect(validateCategoryIconValue(' 🍜 ')).toEqual({ valid: true, value: '🍜' });
    expect(validateCategoryIconValue('💼')).toEqual({ valid: true, value: '💼' });
    expect(validateCategoryIconValue('$$')).toEqual({ valid: true, value: '$$' });
    expect(validateCategoryIconValue('Ă')).toEqual({ valid: true, value: 'Ă' });
  });

  it('keeps safe legacy keys valid at the service boundary', () => {
    expect(validateCategoryIconValue('hello')).toEqual({ valid: true, value: 'hello' });
    expect(validateCategoryIconValue('<script>')).toEqual({ valid: false, value: '<script>' });
  });

  it('rejects long custom display text and html-like input', () => {
    expect(validateCustomCategoryIconValue('X')).toEqual({ valid: true, value: 'X' });
    expect(validateCustomCategoryIconValue('AB')).toEqual({ valid: true, value: 'AB' });
    expect(validateCustomCategoryIconValue('hello')).toEqual({ valid: false, value: 'hello' });
    expect(validateCustomCategoryIconValue('too long')).toEqual({ valid: false, value: 'too long' });
    expect(validateCustomCategoryIconValue('<script>')).toEqual({ valid: false, value: '<script>' });
  });

  it('only exposes safe non-key values for text rendering', () => {
    expect(getSafeCustomCategoryIcon('🍜')).toBe('🍜');
    expect(getSafeCustomCategoryIcon('X')).toBe('X');
    expect(getSafeCustomCategoryIcon('coffee')).toBeNull();
    expect(getSafeCustomCategoryIcon('<script>')).toBeNull();
  });
});
