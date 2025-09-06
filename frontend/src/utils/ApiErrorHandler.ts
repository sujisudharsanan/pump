interface ApiError {
  code: number;
  message: string;
  details?: string;
}

export class ApiErrorHandler {
  // Error code ranges: 1000-1099 (Auth), 1100-1199 (Validation), 
  // 1200-1299 (Business), 1300-1399 (System)
  private static errorMessages: Record<number, string> = {
    // Authentication Errors (1000-1099)
    1001: 'Invalid email or password',
    1002: 'Account has been locked due to multiple failed attempts',
    1003: 'Email address is already registered',
    1004: 'Session has expired. Please login again',
    1005: 'Account verification required',
    1006: 'Insufficient permissions to access this resource',

    // Validation Errors (1100-1199)
    1101: 'Invalid email address format',
    1102: 'Password must be at least 6 characters long',
    1103: 'Phone number format is invalid',
    1104: 'Required field is missing',
    1105: 'Invalid amount entered',
    1106: 'Pump number must be between 1 and 20',

    // Business Logic Errors (1200-1299)
    1201: 'Pump is currently out of service',
    1202: 'Insufficient fuel in selected pump',
    1203: 'Transaction limit exceeded for today',
    1204: 'Invalid transaction reference',
    1205: 'Pump is already in use',
    1206: 'Fuel grade not available',

    // System Errors (1300-1399)
    1301: 'Database connection failed',
    1302: 'External payment service unavailable',
    1303: 'Backup system is running',
    1304: 'Maintenance mode is active',
    1305: 'Server overloaded. Please try again later',
  };

  static handleError(error: ApiError | string | number): string {
    if (typeof error === 'string') {
      return this.sanitizeErrorMessage(error);
    }

    if (typeof error === 'number') {
      return this.errorMessages[error] || 'An unexpected error occurred';
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const knownMessage = this.errorMessages[error.code];
      if (knownMessage) {
        return knownMessage;
      }
      
      // Fallback to provided message but sanitize it
      return this.sanitizeErrorMessage(error.message || 'Unknown error');
    }

    return 'An unexpected error occurred';
  }

  static sanitizeErrorMessage(message: string): string {
    // Remove technical jargon and make user-friendly
    const sanitized = message
      .replace(/SQL|Database|Server|Internal/gi, 'System')
      .replace(/Exception|Error:/gi, '')
      .replace(/\b\d{4}-\d{2}-\d{2}\b/g, '') // Remove timestamps
      .replace(/\b[A-Z]{2,}\b/g, (match) => 
        match.charAt(0) + match.slice(1).toLowerCase()
      ) // Convert ALL CAPS to proper case
      .trim();

    // Ensure it starts with capital letter and ends with period
    const formatted = sanitized.charAt(0).toUpperCase() + 
                     sanitized.slice(1).toLowerCase();
    
    return formatted.endsWith('.') ? formatted : formatted + '.';
  }

  static getErrorCode(message: string): number {
    // Try to extract error code from message
    const codeMatch = message.match(/\b1[0-3]\d{2}\b/);
    return codeMatch ? parseInt(codeMatch[0], 10) : 1399; // Default system error
  }

  static isAuthenticationError(error: ApiError | number): boolean {
    const code = typeof error === 'number' ? error : error.code;
    return code >= 1000 && code <= 1099;
  }

  static isValidationError(error: ApiError | number): boolean {
    const code = typeof error === 'number' ? error : error.code;
    return code >= 1100 && code <= 1199;
  }

  static isBusinessLogicError(error: ApiError | number): boolean {
    const code = typeof error === 'number' ? error : error.code;
    return code >= 1200 && code <= 1299;
  }

  static isSystemError(error: ApiError | number): boolean {
    const code = typeof error === 'number' ? error : error.code;
    return code >= 1300 && code <= 1399;
  }

  static logError(error: ApiError | string, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorData = {
      timestamp,
      context: context || 'Unknown',
      error: typeof error === 'string' ? { message: error } : error,
    };
    
    console.error('API Error:', errorData);
    
    // In production, this would send to logging service
    // Example: LoggingService.logError(errorData);
  }
}
