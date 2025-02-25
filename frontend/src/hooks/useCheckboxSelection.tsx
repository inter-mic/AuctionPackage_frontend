import { useState, useCallback, useEffect } from 'react';



export function useCheckboxSelection<T>(initialItems: T[]) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<T[]>([]);

  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedIds(checked ? initialItems : []);
  }, [initialItems]);

  const handleSelect = useCallback((id: T) => {
    setSelectedIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  }, []);

  return {
    selectAll,
    setSelectAll,
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleSelect,
  };
}