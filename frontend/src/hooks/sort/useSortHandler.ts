import { useState } from "react";

interface SortConfig {
  [key: string]: {
    sortKey: string;
    sortFlg: boolean;
  };
}

interface UseSortHandlerProps {
  initialSortOption: string;
  sortConfig: SortConfig;
  searchParams: any;
  searchAPI: (params: any) => void;
  additionalParams?: any;
}

export const useSortHandler = ({
  initialSortOption,
  sortConfig,
  searchParams,
  searchAPI,
  additionalParams = {},
}: UseSortHandlerProps) => {
  const [sortOption, setSortOption] = useState<string>(initialSortOption);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    
    const sortSettings = sortConfig[option] || { sortKey: "lot", sortFlg: true };
    
    const params = {
      ...searchParams,
      ...additionalParams,
      sortKey: sortSettings.sortKey,
      sortFlg: sortSettings.sortFlg,
    };
    
    searchAPI(params);
  };

  return {
    sortOption,
    setSortOption,
    handleSortChange,
  };
};
