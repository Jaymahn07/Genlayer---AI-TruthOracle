import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Recursively converts Map objects to plain JavaScript objects.
 * Also handles nested Arrays and BigInt values.
 */
export function normalizeGenLayerData(data: any): any {
    if (data instanceof Map) {
        const obj: any = {};
        data.forEach((value, key) => {
            obj[key] = normalizeGenLayerData(value);
        });
        return obj;
    } else if (Array.isArray(data)) {
        return data.map(item => normalizeGenLayerData(item));
    } else if (typeof data === 'bigint') {
        return Number(data);
    } else if (data !== null && typeof data === 'object') {
        const obj: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                obj[key] = normalizeGenLayerData(data[key]);
            }
        }
        return obj;
    }
    return data;
}
