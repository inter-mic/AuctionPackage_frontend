import { useState, useCallback, useEffect } from 'react';


export function useCheckboxSelection<T>(initialItems: T[], allSelectData: T[],fetchAllIds: () => Promise<void>) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<T[]>([]);
  const [allGoodsData, setAllGoodsData] = useState<T[]>([]);

  useEffect(() => {
    if (allGoodsData.length == 0 && allSelectData.length > 0) {
      setAllGoodsData(allSelectData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSelectData]);
  useEffect(() => {
    if (selectAll && allGoodsData.length > 0) {
      setSelectedIds(allSelectData);
    }else{
      setSelectedIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGoodsData, selectAll]);

  const handleSelectAll = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setSelectAll(checked);
      setSelectedIds(checked ? initialItems : []);
      if (checked) {
        await fetchAllIds();
      }else{
        setSelectedIds([]);
        setAllGoodsData([]);
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[initialItems]);

  const handleSelect = useCallback((id: T) => {
    setSelectedIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  }, []);

  const resetSelection = useCallback(() => {
    setSelectAll(false);
    setSelectedIds([]);
    setAllGoodsData([]);
  }, []);

  return {
    selectAll,
    setSelectAll,
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleSelect,
    resetSelection,
  };
}