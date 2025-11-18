// src/utils/format.ts
export const formatCurrency = (v: number, locale = 'vi-VN', currency = 'VND') =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(v);
