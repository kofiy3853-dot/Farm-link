import { create } from 'zustand';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'FARMER' | 'ADMIN' | 'LOGISTICS';
    isVerified?: boolean;
    rating?: number;
    totalSales?: number;
    farmName?: string;
    farmSize?: number;
    experienceYears?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    certifications?: any;
    district?: string;
    businessName?: string;
    industryType?: string;
    businessLicense?: string;
    onTimePaymentRate?: number;
    fleetSize?: number;
    vehicleTypes?: string[];
    serviceRegions?: string[];
    deliverySuccessRate?: number;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // loading until initAuth runs on client

    login: (user, token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, isAuthenticated: true });
    },

    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        set({ user: null, isAuthenticated: false });
    },

    initAuth: () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    set({ user, isAuthenticated: true, isLoading: false });
                    return;
                } catch {
                    console.error('Failed to parse user from local storage');
                }
            }
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
    }
}));
