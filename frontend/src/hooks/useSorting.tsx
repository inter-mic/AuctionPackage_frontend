import { useEffect, useState } from 'react';



type SortOrder = 'asc' | 'desc';
interface Sortable {
    [key: string]: string | number; 
}

export function useSorting<T extends Sortable>(initialData: T[], initialSortColumn: keyof T, initialSortOrder: SortOrder) {
    const [sortColumn, setSortColumn] = useState<keyof T>(initialSortColumn);
    const [sortOrder, setSortOrder] = useState<SortOrder>(initialSortOrder);
    const [data, setData] = useState<T[]>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const parseValue = (value: string | number) => {
        if (typeof value === 'string') {
            const parsedValue = value.replace(/,/g, '');
            return isNaN(Number(parsedValue)) ? value : Number(parsedValue);
        }
        return value;
    };

    const sortData = (column: keyof T, order: SortOrder) => {
        const sortedData = [...data].sort((a, b) => {
            const aValue = parseValue(a[column]);
            const bValue = parseValue(b[column]);

            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
    };

    const handleSort = (column: keyof T) => {
        const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortOrder(newOrder);
        sortData(column, newOrder);
    };

    return { data, handleSort };
}