// src/utils/date.ts

/**
 * Format datetime string về dạng local (mặc định vi-VN)
 */
export const formatDateTime = (
    value: string | null | undefined,
    locale: string = 'vi-VN'
): string => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString(locale);
};
