import { describe, it, expect } from 'vitest';
import { FormValidator } from '../utils/validation';
import { ERROR_CODES } from '../types/errors';

describe('FormValidator', () => {
  describe('validateField', () => {
    it('should return error for required field when empty', () => {
      const result = FormValidator.validateField(
        '',
        { required: true },
        'email'
      );

      expect(result).not.toBeNull();
      expect(result?.field).toBe('email');
      expect(result?.code).toBe(ERROR_CODES.VALIDATION_REQUIRED_FIELD);
      expect(result?.message).toContain('email is required');
    });

    it('should return null for valid email', () => {
      const result = FormValidator.validateField(
        'test@example.com',
        { required: true, email: true },
        'email'
      );

      expect(result).toBeNull();
    });

    it('should return error for invalid email format', () => {
      const result = FormValidator.validateField(
        'invalid-email',
        { email: true },
        'email'
      );

      expect(result).not.toBeNull();
      expect(result?.field).toBe('email');
      expect(result?.code).toBe(ERROR_CODES.VALIDATION_INVALID_FORMAT);
    });

    it('should return error for string too short', () => {
      const result = FormValidator.validateField(
        'abc',
        { minLength: 5 },
        'password'
      );

      expect(result).not.toBeNull();
      expect(result?.field).toBe('password');
      expect(result?.code).toBe(ERROR_CODES.VALIDATION_OUT_OF_RANGE);
    });

    it('should return error for number below minimum', () => {
      const result = FormValidator.validateField(5, { min: 10 }, 'amount');

      expect(result).not.toBeNull();
      expect(result?.field).toBe('amount');
      expect(result?.code).toBe(ERROR_CODES.VALIDATION_OUT_OF_RANGE);
    });
  });

  describe('validateForm', () => {
    it('should return valid result for correct data', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
      };

      const rules = {
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
      };

      const result = FormValidator.validateForm(data, rules);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid result with errors for incorrect data', () => {
      const data = {
        email: 'invalid-email',
        password: '123',
      };

      const rules = {
        email: { required: true, email: true },
        password: { required: true, minLength: 6 },
      };

      const result = FormValidator.validateForm(data, rules);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].field).toBe('email');
      expect(result.errors[1].field).toBe('password');
    });
  });

  describe('getCommonRules', () => {
    it('should return correct email rules', () => {
      const rules = FormValidator.getCommonRules();

      expect(rules.email.required).toBe(true);
      expect(rules.email.email).toBe(true);
      expect(rules.email.maxLength).toBe(255);
    });

    it('should return correct password rules', () => {
      const rules = FormValidator.getCommonRules();

      expect(rules.password.required).toBe(true);
      expect(rules.password.minLength).toBe(8);
      expect(rules.password.pattern).toBeInstanceOf(RegExp);
    });
  });
});
