import type { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

// Extend Express Request type
export interface AuthRequest extends Request {
    user: {
        id: string;
        role: Role;
    };
}

/**
 * Middleware to check if user has required role(s)
 * @param allowedRoles - Array of roles that are allowed to access the endpoint
 */
export function requireRole(allowedRoles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const authReq = req as AuthRequest;

        if (!authReq.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                },
            });
        }

        if (!allowedRoles.includes(authReq.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
                },
            });
        }

        next();
    };
}

/**
 * Middleware to check if user is a farmer
 */
export const requireFarmer = requireRole([Role.FARMER]);

/**
 * Middleware to check if user is a customer
 */
export const requireCustomer = requireRole([Role.CUSTOMER]);

/**
 * Middleware to check if user is authenticated (any role)
 */
export const requireAuth = requireRole([Role.FARMER, Role.CUSTOMER]);
