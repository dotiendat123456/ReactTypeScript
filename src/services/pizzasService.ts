// src/services/pizzasService.ts
import type { Pizza } from '../types/pizza';
import { PIZZAS } from '../data/pizzas';

// In dev we return mock. Later you can switch to apiFetch('/api/pizzas')
export async function fetchPizzas(): Promise<Pizza[]> {
    // simulate small network delay
    await new Promise(res => setTimeout(res, 100));
    return PIZZAS;
}

export const pizzasService = { fetch: fetchPizzas };
