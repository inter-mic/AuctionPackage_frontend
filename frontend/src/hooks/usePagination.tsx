import { useState } from "react";

type PaginationParams = {
  itemsPerPage: number;
  searchAPI: (params: Record<string, any> & { pageNumber: number; pageSize: number }) => Promise<void>;
  searchParams: Record<string, any>;
};

export const usePagination = ({ itemsPerPage, searchAPI, searchParams }: PaginationParams) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = async (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const params = {
      ...searchParams,
      pageNumber: page,
      pageSize: itemsPerPage,
    };

    await searchAPI(params);
  };

  return { currentPage, setCurrentPage, handlePageChange };
};
