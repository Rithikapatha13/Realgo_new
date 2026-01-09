import { useMemo } from "react";

/**
 * @param {Array} data - original full data
 * @param {String} search - search input
 * @param {Array} keys - fields to search in
 */
export default function useSearchFilter(data, search, keys = []) {
    const filteredData = useMemo(() => {
        if (!search.trim()) return data;

        const value = search.toLowerCase();

        return data.filter((item) =>
            keys.some((key) => {
                const field = item[key];
                if (!field) return false;
                return String(field).toLowerCase().includes(value);
            })
        );
    }, [data, search, keys]);

    return filteredData;
}
