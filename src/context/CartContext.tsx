// src/context/CartContext.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Pizza } from '../types/pizza';

export type CartItem = {
    pizza: Pizza;
    qty: number;
};

type CartState = {
    items: Record<string, CartItem>;
    totalItems: number;
    totalPrice: number;
};

type CartActions = {
    add: (pizza: Pizza, qty?: number) => void;
    remove: (pizzaId: string) => void;
    setQty: (pizzaId: string, qty: number) => void;
    clear: () => void;
};

const CartContext = createContext<CartState & CartActions | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<Record<string, CartItem>>(() => {
        try {
            const raw = localStorage.getItem('cart_v1');
            return raw ? (JSON.parse(raw) as Record<string, CartItem>) : {};
        } catch {
            return {};
        }
    });

    // persist
    React.useEffect(() => {
        try {
            localStorage.setItem('cart_v1', JSON.stringify(items));
        } catch { }
    }, [items]);

    const add = (pizza: Pizza, qty = 1) => {
        setItems(prev => {
            const cur = prev[pizza.id];
            const nextQty = (cur?.qty || 0) + qty;
            return { ...prev, [pizza.id]: { pizza, qty: nextQty } };
        });
    };

    const remove = (pizzaId: string) => {
        setItems(prev => {
            const next = { ...prev };
            delete next[pizzaId];
            return next;
        });
    };

    const setQty = (pizzaId: string, qty: number) => {
        setItems(prev => {
            if (!prev[pizzaId]) return prev;
            if (qty <= 0) {
                const next = { ...prev };
                delete next[pizzaId];
                return next;
            }
            return { ...prev, [pizzaId]: { ...prev[pizzaId], qty } };
        });
    };

    const clear = () => setItems({});

    const totals = useMemo(() => {
        const totalItems = Object.values(items).reduce((s, it) => s + it.qty, 0);
        const totalPrice = Object.values(items).reduce((s, it) => s + it.qty * it.pizza.price, 0);
        return { totalItems, totalPrice };
    }, [items]);

    return (
        <CartContext.Provider value={{ items, totalItems: totals.totalItems, totalPrice: totals.totalPrice, add, remove, setQty, clear }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCartContext = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCartContext must be used within CartProvider');
    return ctx;
};
