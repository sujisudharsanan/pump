import type { ApiError, ApiResponse } from '../types/errors';
import { ERROR_CODES, type ErrorCode } from '../types/errors';

export class ApiErrorHandler {
  /**
   * Create a standardized API error
   */
  static createError(
    status: number,
    message: string,
    code: ErrorCode,
    details?: Record<string, unknown>,
  ): ApiError {
    return {
      status,
      message,
      code,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a success response
   */
  static createSuccess<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  /**
   * Create an error response
   */
  static createErrorResponse(error: ApiError): ApiResponse {
    return {
      success: false,
      error,
    };
  }

  /**
   * Handle different types of errors and convert to ApiError
   */
  static handleError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as {
        response?: { data?: { error?: ApiError } };
      };
      if (responseError.response?.data?.error) {
        return responseError.response.data.error;
      }
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const codeError = error as { code: string };
      if (codeError.code === 'NETWORK_ERROR') {
        return this.createError(
          503,
          'Network connection failed. Please check your internet connection.',
          ERROR_CODES.SYSTEM_INTERNAL_ERROR,
        );
      }

      if (codeError.code === 'TIMEOUT') {
        return this.createError(
          408,
          'Request timed out. Please try again.',
          ERROR_CODES.SYSTEM_INTERNAL_ERROR,
        );
      }
    }

    // Default error
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return this.createError(
      500,
      'An unexpected error occurred. Please try again.',
      ERROR_CODES.SYSTEM_INTERNAL_ERROR,
      { originalError: errorMessage },
    );
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: ApiError): string {
    const errorMessages: Record<number, string> = {
      [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
      [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'User account not found.',
      [ERROR_CODES.AUTH_TOKEN_EXPIRED]:
        'Your session has expired. Please log in again.',
      [ERROR_CODES.USER_EMAIL_REQUIRED]: 'Email address is required.',
      [ERROR_CODES.USER_PASSWORD_REQUIRED]: 'Password is required.',
      [ERROR_CODES.USER_EMAIL_INVALID]: 'Please enter a valid email address.',
      [ERROR_CODES.PUMP_NOT_FOUND]: 'Pump not found.',
      [ERROR_CODES.TRANSACTION_INVALID_AMOUNT]: 'Invalid transaction amount.',
      [ERROR_CODES.INVENTORY_LOW_STOCK]: 'Insufficient fuel stock.',
      [ERROR_CODES.CREDIT_LIMIT_EXCEEDED]: 'Credit limit exceeded.',
      [ERROR_CODES.SYSTEM_DATABASE_ERROR]:
        'Database connection issue. Please try again.',
      [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Required field is missing.',
    };

    return errorMessages[error.code] || error.message || 'An error occurred.';
  }
}
