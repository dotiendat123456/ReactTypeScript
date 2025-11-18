// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User, LoginPayload } from '../types/auth';
import { authService } from '../services/authService';

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
};

type AuthActions = {
    login: (payload: LoginPayload) => Promise<void>;
    logout: () => void;
};

const AuthCtx = createContext<(AuthState & AuthActions) | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
    const [user, setUser] = useState<User | null>(() => {
        const raw = localStorage.getItem('auth_user');
        return raw ? (JSON.parse(raw) as User) : null;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (token) localStorage.setItem('auth_token', token);
        else localStorage.removeItem('auth_token');
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        else localStorage.removeItem('auth_user');
    }, [user]);

    const login = async (payload: LoginPayload) => {
        setLoading(true);
        try {
            const { token, user } = await authService.loginRequest(payload);
            setToken(token);
            setUser(user);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    const value = useMemo(
        () => ({ user, token, loading, isAuthenticated: !!token, login, logout }),
        [user, token, loading]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};