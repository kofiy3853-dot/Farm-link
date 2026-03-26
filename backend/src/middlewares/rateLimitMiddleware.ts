import rateLimit from 'express-rate-limit';

// Rate limiter for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many authentication attempts. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for general API endpoints
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for sensitive operations
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: {
        success: false,
        error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests for this operation. Please try again later.',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});
