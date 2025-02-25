import { useEffect, useState } from 'react';
export function usePagination<T>(data: T[]) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const paginatedData = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
    };
  
    return {
      currentPage,
      paginatedData,
      totalPageCount: Math.ceil(data.length / itemsPerPage),
      handlePageChange,
    };
  }