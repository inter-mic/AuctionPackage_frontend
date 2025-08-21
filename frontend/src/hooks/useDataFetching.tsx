import { useState, useEffect } from "react";

type UseDataFetchingParams<T> = {
  searchAPI: (params: any) => Promise<void>;
  countAPI: (params: any) => Promise<void>;
  searchParams: any;
  itemsPerPage: number;
  initialData?: T[];
};

type UseDataFetchingReturn<T> = {
  data: T[];
  count: number;
  currentPage: number;
  formErrors: { [key: string]: string };
  setCurrentPage: (page: number) => void;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  formSearch: () => Promise<void>;
  formClear: () => void;
  resetForm: () => void;
};

export const useDataFetching = <T>({
  searchAPI,
  countAPI,
  searchParams,
  itemsPerPage,
  initialData = [],
}: UseDataFetchingParams<T>): UseDataFetchingReturn<T> => {
  const [data, setData] = useState<T[]>(initialData);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const formSearch = async () => {
    setCurrentPage(1);
    const params = {
      ...searchParams,
      pageNumber: 1,
      pageSize: itemsPerPage,
    };
    await searchAPI(params);
    await countAPI(params);
  };

  const handlePageChange = async (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    const params = {
      ...searchParams,
      pageNumber: page,
      pageSize: itemsPerPage,
    };
    await searchAPI(params);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1000);
  };

  const formClear = () => {
    setData([]);
    setCurrentPage(1);
  };

  const resetForm = () => {
    // この関数は各ページで独自の実装が必要なため、オーバーライド可能にする
  };

  return {
    data,
    count,
    currentPage,
    formErrors,
    setCurrentPage,
    handlePageChange,
    formSearch,
    formClear,
    resetForm,
  };
};
