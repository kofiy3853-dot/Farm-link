import type { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export class ResponseHelper {
    static success<T>(
        res: Response,
        data: T,
        message?: string,
        statusCode: number = 200
    ): Response {
        const response: ApiResponse<T> = {
            success: true,
            data,
        };
        return res.status(statusCode).json(response);
    }

    static error(
        res: Response,
        code: string,
        message: string,
        statusCode: number = 400,
        details?: any
    ): Response {
        const response: ApiResponse = {
            success: false,
            error: {
                code,
                message,
                ...(details && process.env.NODE_ENV !== 'production' ? { details } : {}),
            },
        };
        return res.status(statusCode).json(response);
    }

    static paginated<T>(
        res: Response,
        data: T[],
        page: number,
        limit: number,
        total: number,
        statusCode: number = 200
    ): Response {
        const response: ApiResponse<T[]> = {
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        return res.status(statusCode).json(response);
    }

    static created<T>(res: Response, data: T, message?: string): Response {
        return this.success(res, data, message, 201);
    }

    static noContent(res: Response): Response {
        return res.status(204).send();
    }

    static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
        return this.error(res, 'UNAUTHORIZED', message, 401);
    }

    static forbidden(res: Response, message: string = 'Forbidden'): Response {
        return this.error(res, 'FORBIDDEN', message, 403);
    }

    static notFound(res: Response, message: string = 'Resource not found'): Response {
        return this.error(res, 'NOT_FOUND', message, 404);
    }

    static validationError(res: Response, details: any): Response {
        return this.error(res, 'VALIDATION_ERROR', 'Validation failed', 400, details);
    }

    static serverError(res: Response, message: string = 'Internal server error'): Response {
        return this.error(res, 'SERVER_ERROR', message, 500);
    }
}
