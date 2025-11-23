// src/utils/file.ts

/**
 * Convert 1 File (ảnh, pdf, ...) sang base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            // result dạng: "data:image/png;base64,AAAA..."
            const parts = result.split(',');
            resolve(parts[1] || result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
};
