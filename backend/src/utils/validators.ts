import { z } from 'zod';

// Auth Schemas
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100),
    role: z.enum(['farmer', 'customer']),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Product Schemas
export const createProductSchema = z.object({
    name: z.string().min(2, 'Product name must be at least 2 characters').max(200),
    price: z.string().or(z.number()).transform((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num) || num <= 0) {
            throw new Error('Price must be a positive number');
        }
        return num;
    }),
    description: z.string().max(1000).optional(),
});

export const updateProductSchema = z.object({
    name: z.string().min(2).max(200).optional(),
    price: z.string().or(z.number()).transform((val) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        if (isNaN(num) || num <= 0) {
            throw new Error('Price must be a positive number');
        }
        return num;
    }).optional(),
    description: z.string().max(1000).optional(),
});

// Order Schemas
export const createOrderSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.string().or(z.number()).transform((val) => {
        const num = typeof val === 'string' ? parseInt(val) : val;
        if (isNaN(num) || num <= 0) {
            throw new Error('Quantity must be a positive integer');
        }
        return num;
    }),
});

export const updateOrderStatusSchema = z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

// Chat Schemas
export const createChatSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1, 'Message cannot be empty').max(5000),
});

// User Schemas
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
});

// Pagination Schema
export const paginationSchema = z.object({
    page: z.string().or(z.number()).transform((val) => {
        const num = typeof val === 'string' ? parseInt(val) : val;
        return isNaN(num) || num < 1 ? 1 : num;
    }).optional().default(1 as any),
    limit: z.string().or(z.number()).transform((val) => {
        const num = typeof val === 'string' ? parseInt(val) : val;
        return isNaN(num) || num < 1 ? 10 : Math.min(num, 100);
    }).optional().default(10 as any),
});

// Search Schema
export const searchSchema = z.object({
    q: z.string().min(1, 'Search query is required').max(200),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CreateChatInput = z.infer<typeof createChatSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
