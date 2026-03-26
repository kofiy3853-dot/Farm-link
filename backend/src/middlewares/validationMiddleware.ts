import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';
import { ResponseHelper } from '../utils/response.js';

/**
 * Middleware factory to validate request body, query, or params using Zod schema
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req[source];
            const validated = await schema.parseAsync(data);
            req[source] = validated;
            next();
        } catch (error: any) {
            if (error instanceof ZodError || error?.name === 'ZodError') {
                const details = (error as any).errors.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));
                return ResponseHelper.validationError(res, details);
            }
            return ResponseHelper.serverError(res, 'Validation error');
        }
    };
}

/**
 * Validate request body
 */
export const validateBody = (schema: ZodSchema) => validate(schema, 'body');

/**
 * Validate query parameters
 */
export const validateQuery = (schema: ZodSchema) => validate(schema, 'query');

/**
 * Validate URL parameters
 */
export const validateParams = (schema: ZodSchema) => validate(schema, 'params');
