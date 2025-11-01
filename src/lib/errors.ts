/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Error codes for common application errors
 */
export const ErrorCodes = {
  // Authentication errors (4000-4999)
  INVALID_CREDENTIALS: 'AUTH_4001',
  UNAUTHORIZED: 'AUTH_4002',
  SESSION_EXPIRED: 'AUTH_4003',

  // Validation errors (5000-5999)
  VALIDATION_FAILED: 'VALID_5001',
  MISSING_REQUIRED_FIELD: 'VALID_5002',
  INVALID_INPUT: 'VALID_5003',

  // Resource errors (6000-6999)
  NOT_FOUND: 'RES_6001',
  ALREADY_EXISTS: 'RES_6002',
  CONFLICT: 'RES_6003',

  // Permission errors (7000-7999)
  INSUFFICIENT_PERMISSIONS: 'PERM_7001',
  FORBIDDEN: 'PERM_7002',

  // Database errors (8000-8999)
  DATABASE_ERROR: 'DB_8001',
  CONNECTION_FAILED: 'DB_8002',

  // Server errors (9000-9999)
  INTERNAL_ERROR: 'SRV_9001',
  SERVICE_UNAVAILABLE: 'SRV_9002',
} as const;

type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Create an AppError with common error patterns
 */
export const createError = {
  unauthorized: (message: string = 'Unauthorized') =>
    new AppError(message, ErrorCodes.UNAUTHORIZED, 401),

  forbidden: (message: string = 'Forbidden') =>
    new AppError(message, ErrorCodes.FORBIDDEN, 403),

  notFound: (resource: string = 'Resource') =>
    new AppError(`${resource} not found`, ErrorCodes.NOT_FOUND, 404),

  validation: (message: string) =>
    new AppError(message, ErrorCodes.VALIDATION_FAILED, 400),

  conflict: (message: string) =>
    new AppError(message, ErrorCodes.CONFLICT, 409),

  database: (message: string = 'Database error') =>
    new AppError(message, ErrorCodes.DATABASE_ERROR, 500),

  server: (message: string = 'Internal server error') =>
    new AppError(message, ErrorCodes.INTERNAL_ERROR, 500),
};

/**
 * Error handler utility for consistent error formatting
 */
export const errorHandler = {
  /**
   * Handle and format errors consistently
   */
  handle: (error: unknown): { message: string; code: ErrorCode; statusCode: number } => {
    if (error instanceof AppError) {
      return {
        message: error.message,
        code: error.code as ErrorCode,
        statusCode: error.statusCode,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code: ErrorCodes.INTERNAL_ERROR,
        statusCode: 500,
      };
    }

    return {
      message: 'An unexpected error occurred',
      code: ErrorCodes.INTERNAL_ERROR,
      statusCode: 500,
    };
  },

  /**
   * Check if error is operational (expected) vs programming (unexpected)
   */
  isOperational: (error: unknown): boolean => {
    if (error instanceof AppError) {
      return error.isOperational;
    }
    return false;
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage: (error: unknown): string => {
    const { message } = errorHandler.handle(error);

    // Map technical errors to user-friendly messages
    if (message.includes('NetworkError') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }

    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    if (message.includes('UNAUTHORIZED') || message.includes('401')) {
      return 'Your session has expired. Please log in again.';
    }

    if (message.includes('NOT_FOUND') || message.includes('404')) {
      return 'The requested resource was not found.';
    }

    if (message.includes('VALIDATION_FAILED') || message.includes('400')) {
      return 'The provided information is invalid. Please check your input.';
    }

    // Default fallback
    return message;
  },

  /**
   * Log error for debugging (in production, send to error reporting service)
   */
  log: (error: unknown, context?: string) => {
    if (import.meta.env.DEV) {
      console.error(`[Error${context ? ` (${context})` : ''}]:`, error);
    } else {
      // In production, send to error reporting service like Sentry
      // Example: Sentry.captureException(error, { extra: { context } });
    }
  },
};
