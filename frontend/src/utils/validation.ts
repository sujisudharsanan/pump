import { ERROR_CODES } from '../types/errors';

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: unknown) => string | null;
}

export interface ValidationError {
  field: string;
  message: string;
  code: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export class FormValidator {
  /**
   * Validate a single field
   */
  static validateField(
    value: unknown,
    rules: ValidationRule,
    fieldName: string,
  ): ValidationError | null {
    // Required validation
    if (
      rules.required &&
      (!value || (typeof value === 'string' && value.trim() === ''))
    ) {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
        code: ERROR_CODES.VALIDATION_REQUIRED_FIELD,
      };
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Email validation
    if (rules.email && typeof value === 'string') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          field: fieldName,
          message: `${fieldName} must be a valid email address`,
          code: ERROR_CODES.VALIDATION_INVALID_FORMAT,
        };
      }
    }

    // Min length validation
    if (
      rules.minLength &&
      typeof value === 'string' &&
      value.length < rules.minLength
    ) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${rules.minLength} characters`,
        code: ERROR_CODES.VALIDATION_OUT_OF_RANGE,
      };
    }

    // Max length validation
    if (
      rules.maxLength &&
      typeof value === 'string' &&
      value.length > rules.maxLength
    ) {
      return {
        field: fieldName,
        message: `${fieldName} must not exceed ${rules.maxLength} characters`,
        code: ERROR_CODES.VALIDATION_OUT_OF_RANGE,
      };
    }

    // Pattern validation
    if (
      rules.pattern &&
      typeof value === 'string' &&
      !rules.pattern.test(value)
    ) {
      return {
        field: fieldName,
        message: `${fieldName} format is invalid`,
        code: ERROR_CODES.VALIDATION_INVALID_FORMAT,
      };
    }

    // Min value validation
    if (
      rules.min !== undefined &&
      typeof value === 'number' &&
      value < rules.min
    ) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${rules.min}`,
        code: ERROR_CODES.VALIDATION_OUT_OF_RANGE,
      };
    }

    // Max value validation
    if (
      rules.max !== undefined &&
      typeof value === 'number' &&
      value > rules.max
    ) {
      return {
        field: fieldName,
        message: `${fieldName} must not exceed ${rules.max}`,
        code: ERROR_CODES.VALIDATION_OUT_OF_RANGE,
      };
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return {
          field: fieldName,
          message: customError,
          code: ERROR_CODES.VALIDATION_INVALID_FORMAT,
        };
      }
    }

    return null;
  }

  /**
   * Validate multiple fields
   */
  static validateForm(
    data: Record<string, unknown>,
    rules: Record<string, ValidationRule>,
  ): ValidationResult {
    const errors: ValidationError[] = [];

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const value = data[fieldName];
      const error = this.validateField(value, fieldRules, fieldName);
      if (error) {
        errors.push(error);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get validation rules for common field types
   */
  static getCommonRules() {
    return {
      email: {
        required: true,
        email: true,
        maxLength: 255,
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      },
      phone: {
        required: true,
        pattern: /^\+?[\d\s\-()]{10,15}$/,
      },
      amount: {
        required: true,
        min: 0.01,
        max: 999999.99,
      },
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s]+$/,
      },
    };
  }
}
