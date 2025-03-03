import { useState } from 'react';

type SearchParams = {
  pageNumber: number;
  pageSize: number;
  sortKey: string;
  sortFlg: boolean;
};

type SearchAPI = (params: SearchParams) => void;

export const useSort = ({
  searchAPI,
  initialSortName = 'userId',
  initialSortFlg = 'asc',
  itemsPerPage,
  params,
}: {
  searchAPI: SearchAPI;
  initialSortName?: string;
  initialSortFlg?: string;
  itemsPerPage: number;
  params: Record<string, any>; // Record<string, any> にすることで汎用的に対応
}) => {
  const [sortName, setSortName] = useState<string>(initialSortName);
  const [sortFlg, setSortFlg] = useState<string>(initialSortFlg);

  const handleSortNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortName = e.target.value;
    setSortName(newSortName);
    callSearchAPI(newSortName, sortFlg);
  };

  const handleSortFlgChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortFlg = e.target.value;
    setSortFlg(newSortFlg);
    callSearchAPI(sortName, newSortFlg);
  };

  const callSearchAPI = (sortName: string, sortFlg: string) => {
    const paramsWithSort = {
      ...params,
      pageNumber: 1,
      pageSize: itemsPerPage,
      sortKey: sortName,
      sortFlg: sortFlg === 'asc', // sortFlg を boolean に変換
    };
    searchAPI(paramsWithSort);
  };

  return {
    sortName,
    sortFlg,
    handleSortNameChange,
    handleSortFlgChange,
  };
};
