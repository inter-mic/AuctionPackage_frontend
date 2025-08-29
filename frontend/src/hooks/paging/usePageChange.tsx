import { useState } from "react";

type UsePageChangeParams = {
  searchAPI: (params: any) => Promise<void>;
  searchParams: any;
  itemsPerPage: number;
};

type UsePageChangeReturn = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

export const usePageChange = ({
  searchAPI,
  searchParams,
  itemsPerPage,
}: UsePageChangeParams): UsePageChangeReturn => {
  const [currentPage, setCurrentPage] = useState(1);

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

  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
  };
};
