export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Extract pagination parameters from request query
 */
export function getPaginationParams(
    page: number = 1,
    limit: number = 10
): PaginationParams {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
    const skip = (validPage - 1) * validLimit;

    return {
        page: validPage,
        limit: validLimit,
        skip,
    };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
    page: number,
    limit: number,
    total: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}

/**
 * Apply pagination to Prisma query
 */
export function applyPagination<T>(params: PaginationParams) {
    return {
        skip: params.skip,
        take: params.limit,
    };
}
